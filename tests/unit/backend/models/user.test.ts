/**
 * @jest-environment node
 */
import { User, Teacher } from '../../../../backend/dist/models/user.model'
import db from "../../../../backend/dist/config/db.config"
import { Role } from '../../../../backend/dist/models/role.model'
import { ClassGroup } from "../../../../backend/dist/models/class_group.model"

import { describe, expect, it } from '@jest/globals';


describe("User model", () => {
    it("without userId should throw error", async () => {
        let user = new User({platform: db.PLATFORMS.github})        
        await expect(user.validate()).rejects.toThrowError()
    })
    it("without platform should throw error", async () => {
        let user = new User({userId: 'anonymous'})
        await expect(user.validate()).rejects.toThrowError()
    })
    it("with userId and platform should work", async () => {
        let user = new User({userId: 'anonymous', platform: db.PLATFORMS.github})
        await expect(user.validate()).resolves.toBeUndefined()
    })
    it ("platform must be supported", async () => {
        let user = new User({userId: 'anonymous', platform: "notasupportedpatformname"})
        await expect(user.validate()).rejects.toThrowError()
    })
})

describe("Role model", () => {
    it("must be an existing role", async () => {
        let role = new Role({name: "notanexistingrole"})
        await expect(role.validate()).rejects.toThrowError();
    })
    it("can be one of the existing roles", async () => {
        let role = new Role({name: db.ROLES.student})
        await expect(role.validate()).resolves.toBeUndefined()
    })
})

describe("ClassGroup model", () => {
    it("emtpy owner should throw error", async () => {
        let classGroup = new ClassGroup({name: "myvalidname", awaitingStudents: [], students: [], ownedBy:[]})
        await expect(classGroup.validate()).rejects.toThrowError()
    })
    it("multiple owners should work", async () => {
        let teach1 = new Teacher({userId: 'teach1', platform: db.PLATFORMS.github})
        let teach2 = new Teacher({userId: 'teach2', platform: db.PLATFORMS.beACM})
        let teachers = [teach1, teach2]
        let classGroup = new ClassGroup({name: "myvalidname", awaitingStudents: [], students: [], ownedBy: teachers})
        await expect(classGroup.validate()).resolves.toBeUndefined()
    })
})