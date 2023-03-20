import { User, IUser } from "../models/user.model.js"
import { StudentTeam, IStudentTeam } from "../models/student_team.model.js"
import { AssignmentGroup, IAssignmentGroup } from "../models/assignment_group.model.js"
import { ClassGroup, IClassGroup } from "../models/class_group.model.js"
import { Portfolio, IPortfolio } from "../models/portfolio.model.js"
import { PortfolioItem, IPortfolioItem } from "../models/portfolio_items/portfolio_item.model.js"
import { OpenQuestionItem, IOpenQuestionItem } from "../models/portfolio_items/open_question_item.model.js"
import { TextItem, ITextItem } from "../models/portfolio_items/text_item.model.js"
import db from "../config/db.config.js"
import { makeSharingCode } from "./utils.js"
import { Role } from "../models/role.model.js"

const mockDatabaseData = async () => {
    // Add default roles 
    let adminData: IUser = {
        platform: db.PLATFORMS.test,
        userId: "admin",
        birthdate: new Date(1990, 6, 20),
        email: "tom@dwengo.org",
        firstname: "Tom",
        lastname: "Neutens",
        roles: [db.ROLES.user, db.ROLES.teacher, db.ROLES.student, db.ROLES.admin].map(role => new Role({name: role})),
    }
    let admin = new User(adminData)

    let teacher1Data: IUser = {
        platform: db.PLATFORMS.test,
        userId: "teacher1",
        email: "natacha@dwengo.org",
        firstname: "Natacha",
        roles: [db.ROLES.user, db.ROLES.teacher].map(role => new Role({name: role})),
    }
    let teacher1 = new User(teacher1Data)

    let teacher2Data: IUser = {
        platform: db.PLATFORMS.test,
        userId: "teacher2",
        email: "bjarne@dwengo.org",
        firstname: "Bjarne",
        roles: [db.ROLES.user, db.ROLES.teacher].map(role => new Role({name: role})),
    }
    let teacher2 = new User(teacher2Data)

    let student1Data: IUser = {
        platform: db.PLATFORMS.test,
        userId: "student1",
        firstname: "Raf",
        roles: [db.ROLES.user, db.ROLES.student].map(role => new Role({name: role})),
    }
    let student1 = new User(student1Data)

    let student2Data: IUser = {
        platform: db.PLATFORMS.test,
        userId: "student2",
        firstname: "Jana",
        roles: [db.ROLES.user, db.ROLES.student].map(role => new Role({name: role})),
    }
    let student2 = new User(student2Data)

    let student3Data: IUser = {
        platform: db.PLATFORMS.test,
        userId: "student3",
        firstname: "Mat",
        roles: [db.ROLES.user, db.ROLES.student].map(role => new Role({name: role})),
    }
    let student3 = new User(student3Data)

    let student4Data: IUser = {
        platform: db.PLATFORMS.test,
        userId: "student4",
        firstname: "Lisa",
        roles: [db.ROLES.user, db.ROLES.student].map(role => new Role({name: role})),
    }
    let student4 = new User(student4Data)

    let student5Data: IUser = {
        platform: db.PLATFORMS.test,
        userId: "student5",
        firstname: "Carine",
        roles: [db.ROLES.user, db.ROLES.student].map(role => new Role({name: role})),
    }
    let student5 = new User(student5Data)

    try {
        let savedAdmin = await admin.save()
        let savedTeacher1 = await teacher1.save()
        let savedTeacher2 = await teacher2.save()
        let savedStudent1 = await student1.save()
        let savedStudent2 = await student2.save()
        let savedStudent3 = await student3.save()
        let savedStudent4 = await student4.save()
        let savedStudent5 = await student5.save()

        let textItemData: ITextItem = {
            name: "Text item",
            mdText: "#Title \n This is a text based portfolio item."
        }
        let textItem1 = new TextItem(textItemData)
        let savedTextItem1 = await textItem1.save();

        let portfolio1Data: IPortfolio = {
            created: new Date(),
            isPublic: false,
            items: [savedTextItem1._id],
            lastEdited: new Date(),
            name: "Test Portfolio",
        }

        let portfolio1 = new Portfolio(portfolio1Data)
        let savedPortfolio1 = await portfolio1.save();

        let cg1Data: IClassGroup = {
            name: "classgroup 1",
            description: "This is the first classgroup",
            sharingCode: makeSharingCode(),
            awaitingStudents: [savedStudent1._id, savedStudent2._id],
            students: [savedStudent3._id, savedStudent4._id, savedStudent5._id],
            ownedBy: [savedAdmin._id, savedTeacher1._id],
        }
        let cg1 = new ClassGroup(cg1Data)
        let savedCg1 = await cg1.save()

        let st1Data: IStudentTeam = {
            portfolio: savedPortfolio1._id,
            students: [savedStudent3._id, savedStudent4._id]
        }
        let st1 = new StudentTeam(st1Data)
        let savedSt1 = await st1.save()

        let assignmentGroup1Data: IAssignmentGroup = {
            inClassGroup: savedCg1._id,
            name: `Assignment group for class ${savedCg1.name}`,
            description: `Assignment group for class ${savedCg1.name} with teams: ${savedSt1.uuid}}`,
            studentTeams: [ savedSt1._id ]
        }
        let assignmentGroup1 = new AssignmentGroup(assignmentGroup1Data)
        let savedAssignmentGroup1 = assignmentGroup1.save()


    } catch (err) {
        console.log(err);
    }
    
}

export { mockDatabaseData }