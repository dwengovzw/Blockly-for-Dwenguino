/**
 * @jest-environment node
 */
import { User } from '../../../../backend/dist/models/user.model'
import db from "../../../../backend/dist/config/db.config"
import { Role } from '../../../../backend/dist/models/role.model'
import { ClassGroup } from "../../../../backend/dist/models/class_group.model"

import { describe, expect, it } from '@jest/globals';


describe("User model", () => {
    it("without userId should throw error", () => {
        let user = new User({platform: db.PLATFORMS.github})
        expect(user.validateSync()).toBeDefined()
    })
    it("without platform should throw error", () => {
        let user = new User({userId: 'anonymous'})
        expect(user.validateSync()).toBeDefined()
    })
    it("with userId and platform should work", () => {
        let user = new User({userId: 'anonymous', platform: db.PLATFORMS.github})
        expect(user.validateSync()).toBeUndefined()
    })
    it ("platform must be supported", () => {
        let user = new User({userId: 'anonymous', platform: "notasupportedpatformname"})
        expect(user.validateSync()).toBeDefined()
    })
})

describe("Role model", () => {
    it("must be an existing role", () => {
        let role = new Role({name: "notanexistingrole"})
        expect(role.validateSync()).toBeDefined();
    })
    it("can be one of the existing roles", () => {
        let role = new Role({name: db.ROLES.student})
        expect(role.validateSync()).toBeUndefined()
    })
})

describe("ClassGroup model", () => {
    /*it("emtpy owner should throw error", async () => {
        let classGroup = new ClassGroup({name: "myvalidname", awaitingStudents: [], students: [], ownedBy:[]})
        await expect(classGroup.validate()).rejects.toThrowError()
    })*/
    it("multiple owners should work", () => {
        let teach1 = new User({userId: 'teach1', platform: db.PLATFORMS.github})
        let teach2 = new User({userId: 'teach2', platform: db.PLATFORMS.beACM})
        let teachers = [teach1, teach2]
        let classGroup = new ClassGroup({name: "myvalidname", awaitingStudents: [], students: [], ownedBy: teachers})
        expect(classGroup.validateSync()).toBeUndefined()
    })
})