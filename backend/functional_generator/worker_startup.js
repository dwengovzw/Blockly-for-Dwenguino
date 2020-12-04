import FunctionalVectorGenerator from './functional_vector_generator.js';

import { isMainThread, workerData, parentPort } from 'worker_threads';

import Logitem from "../models/log_model.js"

// Only execute when this is not the main thread.
if (!isMainThread){
    const logitem = workerData;
    let fDataGenerator = new FunctionalVectorGenerator();
    let eventData = JSON.parse(logitem.data);
    let fVector = fDataGenerator.generateFunctionalVector(eventData.blocksJsCode);    

    // return result to main thread through parent port
    //console.log("Posting to parent.");
    parentPort.postMessage({result: fVector});
}