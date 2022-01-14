import Logger from "../../logger.js"
import NonceStore from "../../models/nonce_store.js"
import queryString from "querystring"
import jwt from "jsonwebtoken"
import https from "https"
import crypto from "crypto"
import jwkToPem from "jwk-to-pem"
import { Buffer } from "buffer"
import ContentRequest from "../../models/content_request.js"

let logger = Logger.getLogger()

let ltiController = {}

let authentication_endpoint = process.env.AUTHENTICATION_ENDPOINT
let dwengo_client_id_for_ilearn = process.env.I_LEARN_DWENGO_CLIENT_ID
let dwengo_base_uri = process.env.DOMAIN_URL

/**
 * De login flow wordt gestart door de i-Learn gebruiker die een oefening wil maken in een Tool. Het i-Learn Platform genereert hiervoor een link naar het ‘login initiation endpoint’ van de Tool. Volgens de IMS specificatie dient zowel GET als POST requests te ondersteunen. Vanuit i-Learn zullen enkel GET requests naar deze endpoint gestuurd worden.
 * Sample request from i-Learn: https://learning-tool.org/initiate_login?iss=https://auth-test.i-learn.be/&login_hint=25700ac2-a88a-4446-a5db-4ab24711bace&target_link_uri=https://learning-tool.org/launch&lti_message_hint=b8b7c7c1-23dc-49ec-a81f-2db269e30f4d
 * 
 * req.data contains:
 *  -> iss: (issuer) platform identifier ex.: https://auth-test.i-learn.be/
 *  -> login_hint: id of the user that will be loggin in ex.: 25700ac2-a88a-4446-a5db-4ab24711bace
 *  -> target_link_uri: uri of content that is requested ex.: http://localhost:8085/interface/learningObject/getRaw&=hruid=test7-id
 *  -> lti_message_hint: internal i-Learn id of the exercise ex.: b8b7c7c1-23dc-49ec-a81f-2db269e30f4d
 * 
 * This function should process the req.data parameters and redirect to the i-Learn authentication endpoint
 * @param {*} req 
 * @param {*} res 
 */
ltiController.initiate_login = async (req, res) => {
    let params = req.data;
    console.log(params);
    let nonce
    try{
        nonce = await ltiController.generate_nonce_for_user_id(params.login_hint)
    }catch(err){
        res.sendStatus(500) // internal server error
        return
    }
    let redirect_query = {
        scope: "openid",
        response_type: "id_token",
        client_id: dwengo_client_id_for_ilearn,
        redirect_uri: dwengo_base_uri + "/lti/authorize",
        login_hint: params.login_hint,
        state: {target_link_uri: params.target_link_uri},
        response_mode: "form_post",
        nonce: nonce,
        prompt: "none",
        lti_message_hint: params.lti_message_hint
    }

    let query = queryString.stringify(redirect_query);
    // Redirect back to i-Learn
    res.redirect(302, authentication_endpoint + "?" + query)
}

/**
 * Decode the id_token sent by i-Learn, verify it and redirect to the requested content.
 * @param {*} req 
 * @param {*} res 
 */
ltiController.authorize = async (req, res) => {
    let id_token = req.body.id_token
    let header, payload, signature;
    let split_id_token = id_token.split(".")
    signature = split_id_token.pop()
    const split_id_token_obj = split_id_token.map((elem) => JSON.parse(Buffer.from(elem, "base64")));
    [header, payload] = split_id_token_obj
    if (payload["https://purl.imsglobal.org/spec/lti/claim/message_type"] != "LtiResourceLinkRequest"){
        res.sendStatus(406) // unsupported operation (not acceptable)
        return
    }
    try {
        let i_learn_key
        let i_learn_key_pem
        try {
            i_learn_key_pem = ltiController.retrieve_i_learn_public_keys();  // Try to get the i_lear public key for signing the token
        } catch (err) {
            res.sendStatus(500) // Unable to retrieve the key: Internal server error
            return
        }
        let decoded_payload = jwt.verify(id_token, i_learn_key_pem, {algorithms: i_learn_key.alg, audience: process.env.CLIENT_ID, issuer: "https://saltire.lti.app/platform" })  // Verify token with i-learn public key
        let valid_nonce = await ltiController.validate_nonce_for_user_id(decoded_payload.sub, decoded_payload.nonce);  // Validate nonce for user_id
        if (!valid_nonce){
            res.sendStatus(401) // unauthorized
        }else{
            let resource_id = payload["https://purl.imsglobal.org/spec/lti/claim/resource_link"].id
            // TODO: Check if the resource exists and redirect to either dwengo hosted content or extenal link.
            res.redirect(302, `${process.env.I_LEARN_REDIRECT_URI}?_id=${resource_id}`)  // Redirect to requested content
        }
        return
    } catch (err) {
        res.sendStatus(401) // unauthorized
    }
}

/**
 * Select the correct key for verifying the id_token based on the algorithm information in the header of the id_token
 * @param {String} id_token the id_token that has to be verified
 * @param {Array} keys Array of javascript objects containing the keys 
 */
ltiController.select_key = (header, keys) => {
    if (!header.alg){
        throw new Error(`No algorithm specified`)
    }
    keys = keys.filter((key) => {
        if (header.kid == key.kid && header.alg == key.alg){
            return true
        }else{
            return false
        }
    })
    if (!keys.length){
        throw new Error("No matching key found.")
    }
    return keys[0]
}

/**
 * This key is static
 */
ltiController.retrieve_i_learn_public_keys = () => {
    return process.env.LEARNING_OBJECT_REPO_PUB_KEY   
}

ltiController.generate_nonce_for_user_id = async (user_id) => {
    // Generate save the userid to the nonce store. This automatically generates the nonce and a timestamp
    let nonce = new NonceStore({user_id: user_id});
    let saved_nonce = await nonce.save();
    return saved_nonce.nonce
};

ltiController.validate_nonce_for_user_id = async (user_id, nonce) => {
    let nonce_store = await NonceStore.findOne({
        user_id: user_id,
        nonce: nonce
    }).exec()
    let valid = false
    // if combination user_id, nonce is found in the store it is valid
    if (nonce_store){
        valid = true
        ltiController.remove_nonce_for_user_id(user_id, nonce) // Nonce can only be validated once
    }
    return valid
}

ltiController.remove_nonce_for_user_id = async (user_id, nonce) => {
    await NonceStore.deleteOne({
        user_id: user_id,
        nonce: nonce
    })
}

export default ltiController;