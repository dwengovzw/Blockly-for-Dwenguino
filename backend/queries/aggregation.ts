import { PortfolioFilter } from "../controllers/portfolio.controller"
import { AssignmentGroup } from "../models/assignment_group.model"
import { IPortfolio, Portfolio } from "../models/portfolio.model"
import { StudentTeam } from "../models/student_team.model"
import { IUser, User } from "../models/user.model"

const getAllPortfoliosOwnedByUser = async (userId: string) => {
  let user = await User.findOne({_id: userId}).populate<IPortfolio[]>("portfolios")
  if (!user){
    return []
  }
  let studentTeams = await StudentTeam.find({students: {$in: [user._id]}}).populate<IPortfolio>("portfolio").populate<IUser>("students")
  let ownPortfolios = user?.portfolios.map(portfolio => { 
      return {
          shared: false,
          ownedBy: [`${user?.firstname} ${user?.lastname}`],
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
          ownedBy: team.students.map(student => `${(student as IUser)?.firstname || ""} ${(student as IUser)?.lastname || ""}`),
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
  return portfolios
}



const getAllPortfoliosSharedWithUser = async (userId: string) => {
    const sharedPortfolios = await Portfolio.aggregate([
      {
        $match: {
          sharedWith: { $in: [userId] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: "_id",
          foreignField: "portfolios",
          as: "owner"
        }
      }
    ])
        // Aggregation query to find all portfolios that are attached to a portfolio associated with a class group that the user owns
    const classGroupPortfolios = await AssignmentGroup.aggregate([
        {
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
        {
          $match: {
            "inClassGroup.0": {
              $exists: true,
            },
          },
        },
        {
          $graphLookup: {
            from: "studentteams",
            startWith: "$studentTeams",
            connectFromField: "studentTeams",
            connectToField: "_id",
            as: "studentTeams",
            maxDepth: 1,
          },
        },
         {
          $unwind: "$studentTeams",
        },
        {
          $graphLookup: {
            from: "portfolios",
            startWith: "$studentTeams.portfolio",
            connectFromField: "studentTeams.portfolio",
            connectToField: "_id",
            as: "portfolio",
          },
        },
        {
          $project: {
            _id: 0,
            portfolio: { $arrayElemAt: ["$portfolio", 0] },
            students: "$studentTeams.students"
          },
        },
          {
          $graphLookup: {
            from: 'users',
            startWith: "$students",
            connectFromField: 'students',
            connectToField: '_id',
            as: 'portfolio.ownedBy'
          }
        },
        {
          $project: {
            _id: 0,
            portfolio: "$portfolio"
          }
        }
        
      ]
    )
    const propNames = ['created', 'lastEdited', 'isPublic', 'uuid', 'name', 'description', 'items', 'sharedWith']
    const portfoliosSharedWithMe = sharedPortfolios.map(portfolio => {
      return Object.assign({}, ...propNames.map(prop => ({[prop]: portfolio[prop]})), {shared: true, ownedBy: portfolio.owner.map(o => `${o?.firstname || ""} ${o.lastname || ""}`) })
    })
    const portfoliosInMyClassGroups = classGroupPortfolios.map(portfolio => {
      return Object.assign({}, ...propNames.map(prop => ({[prop]: portfolio.portfolio[prop]})), {shared: true, ownedBy: portfolio.portfolio.ownedBy.map(o => `${o?.firstname || ""} ${o.lastname || ""}`)})
    })
    let portfolios = [...portfoliosSharedWithMe, ...portfoliosInMyClassGroups]
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
    getPortfoliosForFilter,
    getAllPortfoliosOwnedByUser
}