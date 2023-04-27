import { PortfolioFilter } from "../controllers/portfolio.controller.js"
import { AssignmentGroup } from "../models/assignment_group.model.js"
import { Portfolio } from "../models/portfolio.model.js"
import { User } from "../models/user.model.js"


const getAllPortfoliosSharedWithUser = async (userId: string) => {
    const sharedPortfolios = await Portfolio.find({sharedWith: {$in: [userId]}})
        // Aggregation query to find all portfolios that are attacht to a portfolio associated with a class group that the user owns
    const classGroupPortfolios = await AssignmentGroup.aggregate([
        { // Start with all assignment groups, lookup the classgroups and match the ones that the user owns
        $graphLookup: {
            from: "classgroups",
            startWith: "$inClassGroup",
            connectFromField: "inClassGroup",
            connectToField: "_id",
            as: "inClassGroup",
            restrictSearchWithMatch: {
            ownedBy: {
                $in: [
                    userId,
                ],
            },
            },
        },
        },
        {   // Only keep the assignment groups that are in a classgroup owned by the current user
        $match: {
            "inClassGroup.0": {
            $exists: true,
            },
        },
        },
        {   // lookup the student teams in the assignment groups
        $graphLookup: {
            from: "studentteams",
            startWith: "$studentTeams",
            connectFromField: "studentTeams",
            connectToField: "_id",
            as: "studentTeams",
            maxDepth: 1,
        },
        },
        {   // make a record for each student team
        $unwind: "$studentTeams",
        },
        {   // Lookup the portfolio for each student team.
        $graphLookup: {
            from: "portfolios",
            startWith: "$studentTeams.portfolio",
            connectFromField: "studentTeams.portfolio",
            connectToField: "_id",
            as: "studentTeams.portfolio",
        },
        },
        {   // Make a record for each portfolio
        $unwind: "$studentTeams.portfolio"
        },
        {   // Only keep the portoflio information.
        $project: {
            _id: 0,
            portfolio: "$studentTeams.portfolio"
        }
        }
    ]
    )
    let portfolios = [...sharedPortfolios, ...classGroupPortfolios.map(portfolio => portfolio.portfolio)]
    portfolios = portfolios.map(portfolio => {
        return {
            shared: true,
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
    return portfolios
}

const getPortfoliosForFilter = async (filter: PortfolioFilter) => {
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
    return portfolios
}

export { 
    getAllPortfoliosSharedWithUser, 
    getPortfoliosForFilter 
}