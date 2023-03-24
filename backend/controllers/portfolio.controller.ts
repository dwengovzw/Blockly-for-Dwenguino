import { IPortfolio, Portfolio } from "../models/portfolio.model.js"
import { StudentTeam } from "../models/student_team.model.js"
import { User } from "../models/user.model.js"


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
            let portfolios = await Portfolio.aggregate([
                {
                    "$match": {
                        uuid: filter.uuid ?? {$exists: true}, // If uuid is not specified, match all portfolios
                        isPublic: filter.isPublic ?? {$exists: true}, // If isPublic is not specified, match all portfolios
                        lastEdited: {$gte: filter.startDate ?? new Date(0), $lte: filter.endDate ?? new Date()}, // If startDate or endDate are not specified, match all portfolios
                        sharedWith: sharedWithUsersIds.length > 0 ? { $in: sharedWithUsersIds } : {$exists: true} , // If sharedWithUUIDs is not specified, match all portfolios
                    },
                }, {
                    $addFields: {
                        convertedId: { $toObjectId: "$_id" }
                    }
                }, 
                {
                    "$lookup": {    // Get the owner of the portfolio
                        from: "User",
                        let: {"portfolioId": "$_id"},
                        pipeline: [
                            {
                                "$match": {
                                    "$expr": {
                                        "$in": ["$$portfolioId", "$portfolios"]
                                    }
                                }
                            },{
                                $unwind: {
                                    path: "$portfolios",
                                }
                            }
                        ],
                        as: "userOwners"
                    }
                },{
                    "$lookup": {    // Get the student teams that have this portfolio       
                        from: "StudentTeam",
                        localField: "convertedId",
                        foreignField: "portfolio",
                        as: "teamOwners"
                    }
                }
            ]);
            let users = await User.aggregate([
                {
                    $match: {
                        uuid: {$exists: true}
                    }
                }
            ])
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
}

export { PortfolioController, PortfolioFilter }