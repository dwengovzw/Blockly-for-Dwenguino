/**
 * @jest-environment node
 */
import { User } from '../../../../backend/dist/models/user.model'
import db from "../../../../backend/dist/config/db.config"
import { Role } from '../../../../backend/dist/models/role.model'
import { ClassGroup } from "../../../../backend/dist/models/class_group.model"
import { mockDatabaseData } from "../../../../backend/utils/add_mock_database_data"

import { describe, expect, it } from '@jest/globals';
import { beforeEach } from 'node:test';


beforeEach(() => {
    mockDatabaseData()
})


describe("AssignmentGroupController test", () => {
    it("Test student team update without existing teams", async () => {
        // Generate test date for the updateStudentTeam function in the AssignmentGroupController
        
    })
})