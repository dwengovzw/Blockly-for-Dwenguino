import { IPortfolio, Portfolio } from "../models/portfolio.model.js"
import { StudentTeam } from "../models/student_team.model.js"
import { User } from "../models/user.model.js"
import { Types } from "mongoose"
import { PipelineStage } from "mongoose";
import { PortfolioItem } from "../models/portfolio_items/portfolio_item.model.js";

// TODO: I might need to update this depending on the data we want to request (f.e. startDate, endDate, description keyword, ..)
interface PortfolioFilter {
    uuid?: string,
    isPublic?: boolean,
    sharedWithUUID?: string[],
    ofStudentsUUID?: string[],
    ofStudentTeamsUUID?: string[],
    startDate?: Date,
    endDate?: Date
}

class PortfolioController {
    filter = async (req, res) => {
        try {
            let filter: PortfolioFilter = req.body
            // Get the users that match the sharedWithUUIDs
            let sharedWithUsersIds = (await User.find({uuid: {$in: filter.sharedWithUUID ?? []}})).map(user => user._id)
            let pipeline = [
                {
                    "$match": {
                        uuid: filter.uuid ?? {$exists: true}, // If uuid is not specified, match all portfolios
                        isPublic: filter.isPublic ?? {$exists: true}, // If isPublic is not specified, match all portfolios
                        lastEdited: {$gte: filter.startDate ?? new Date(0), $lte: filter.endDate ?? new Date()}, // If startDate or endDate are not specified, match all portfolios
                        sharedWith: sharedWithUsersIds.length > 0 ? { $in: sharedWithUsersIds } : {$exists: true} , // If sharedWithUUIDs is not specified, match all portfolios
                    },
                }, {
                    "$lookup": {    // Get the owner of the portfolio
                        from: "users",
                        let: {portfolioId: "$_id"},
                        pipeline: [
                            {
                                "$match": {
                                    "$expr": {
                                        "$in": ["$$portfolioId", "$portfolios"]
                                    }
                                }
                            }
                        ],
                        as: "userOwners"
                    }
                }, {
                    "$lookup": {    // Get the student teams that have this portfolio       
                        from: "studentteams",
                        localField: "_id",
                        foreignField: "portfolio",
                        as: "teamOwners"
                    }
                },{
                    //convert array of objects to array of ids
                    $addFields: {
                        userOwnerUUIDs: {
                            $map: {
                                input: '$userOwners',
                                as: 'obj',
                                in: '$$obj.uuid',
                            },
                        },
                        teamOwnerUUIDs: {
                            $map: {
                                input: '$teamOwners',
                                as: 'obj',
                                in: '$$obj.uuid',
                            }
                        }
                    },
                },
                {
                    $unwind: {
                        path: "$userOwnerUUIDs",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$teamOwnerUUIDs",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: filter.ofStudentsUUID || filter.ofStudentTeamsUUID ?
                        {
                            $or: [
                                {userOwnerUUIDs: {$in: filter.ofStudentsUUID ?? []}},
                                {teamOwnerUUIDs: {$in: filter.ofStudentTeamsUUID ?? []}}
                            ]
                        } : 
                        {uuid: {$exists: true}}
                },
                {
                    "$group": {
                        "_id": "$_id",
                        "name": { "$first": "$name" },
                        "description": { "$first": "$description" },
                        "created": { "$first": "$created" },
                        "isPublic": { "$first": "$isPublic" },
                        "items": { "$first": "$items" },
                        "lastEdited": { "$first": "$lastEdited" },
                        "sharedWith": { "$first": "$sharedWith" },
                        "teamOwners": { "$first": "$teamOwners" },
                        "userOwners": { "$first": "$userOwners" },
                        "uuid": { "$first": "$uuid" },
                    }
                },
                {
                    $unset: ["_id"]
                }

            ]
            let portfolios = await Portfolio.aggregate(pipeline);
            res.status(200).send(portfolios)
        } catch (e) {
            res.status(500).send("Error filtering portfolios.")
        }
    }

    mine = async (req, res) => {
        try{
            let user = await User.findOne({userId: req.userId, platform: req.platform}).populate<IPortfolio[]>("portfolios")
            if (!user){
                res.status(403).send({message: "User not found."})
                return
            }
            let studentTeams = await StudentTeam.find({students: {$in: [user._id]}}).populate<IPortfolio>("portfolio")
            let ownPortfolios = user.portfolios.map(portfolio => { 
                return {
                    shared: false,
                    created: portfolio.created,
                    lastEdited: portfolio.lastEdited,
                    isPublic: portfolio.isPublic,
                    uuid: portfolio.uuid,
                    name: portfolio.name,
                    description: portfolio.description,
                    items: portfolio.items,
                    sharedWith: portfolio.sharedWith,
                }
            })
            let sharedPortfolios = studentTeams.map(team => {
                return {
                    shared: true,
                    created: (team.portfolio as IPortfolio).created,
                    lastEdited: (team.portfolio as IPortfolio).lastEdited,
                    isPublic: (team.portfolio as IPortfolio).isPublic,
                    uuid: (team.portfolio as IPortfolio).uuid,
                    name: (team.portfolio as IPortfolio).name, 
                    description: (team.portfolio as IPortfolio).description,
                    items: (team.portfolio as IPortfolio).items,
                    sharedWith: (team.portfolio as IPortfolio).sharedWith,}
                })
            let portfolios = [...ownPortfolios, ...sharedPortfolios]
            res.status(200).send(portfolios)
        } catch (e) {
            res.status(500).send("Error requesting portfolios.")
        }
    }

    // TODO remove _id and __v from the response
    get = async (req, res) => {
        try {
            let portfolio = await Portfolio.findOne({uuid: req.params.uuid})
                .populate("items sharedWith")
            if (!portfolio){
                res.status(404).send({message: "Portfolio not found."})
                return
            }
            res.status(200).send(portfolio)
        } catch (e) {
            res.status(500).send("Error requesting portfolio.")
        }
    }

    checkIfUserOwnsPortfolio = async (req, res, next) => {
        try {
            if (!req.params.uuid){ // If the portfolio uuid is not specified, skip this middleware => the user is creating a new portfolio
                next()
                return
            }
            // Get the porfolio for the given uuid
            let portfolio = await Portfolio.findOne({uuid: req.params.uuid}).populate<IPortfolio>("items")
            if (!portfolio){ // If the portfolio does not exist, return an error
                res.status(404).send({message: "Portfolio not found."})
                return
            }
            // Check if the user owns the portfolio
            let user = await User.findOne({userId: req.userId, platform: req.platform}).populate<IPortfolio[]>("portfolios")
            if (!user){ // If the user does not exist, return an error
                res.status(403).send({message: "User not found."})
                return
            }
            let pIndex = user.portfolios.findIndex(item => (item as IPortfolio).uuid === portfolio?.uuid) // Check if the user owns the portfolio
            if (pIndex === -1){ // If the user does not own the portfolio, check if the user is a member of a team that owns the portfolio
                let studentTeams = await StudentTeam.find({students: {$in: [user._id]}}).populate<IPortfolio>("portfolio")
                pIndex = studentTeams.findIndex(item => (item.portfolio as IPortfolio).uuid === portfolio?.uuid) // Check if the user is a member of a team that owns the portfolio
            }
            if (pIndex === -1){ // If the user does not own the portfolio, return an error
                res.status(403).send({message: "User does not own the portfolio."})
                return
            }
            next() // If the user owns the portfolio, continue
        } catch (e) {
            res.status(500).send("Error checking if user owns portfolio.")
        }
    }

    /**
     * Creates a new portfolio
     * @param req
     * @param res
     * @returns {Promise<void>}
     * @memberof PortfolioController
        */
    saveItem = async (req, res) => {
        try {
            let item
            if (!req.body.uuid){
                item = new PortfolioItem()
            } else {
                item = await PortfolioItem.findOne({uuid: req.body.uuid})
            }
            if (!item){
                res.status(404).send({message: "Item not found."})
                return
            }
            item = Object.assign(item, req.body) 
            item = await item.save()
            res.status(200).send(item)
        } catch (e) {
            res.status(500).send("Error saving item.")
        }
    }
}

export { PortfolioController, PortfolioFilter }