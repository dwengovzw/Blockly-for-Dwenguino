/**
 * @jest-environment node
 */

jest.mock('../../../../backend/models/student_team.model');

jest.mock('../../../../backend/dist/models/portfolio.model')

import { describe, expect, it, jest, beforeEach, afterEach } from "@jest/globals";
import { Request, Response } from "express";
import { AssignmentGroupController } from "../../../../backend/dist/controllers/assignmentgroup.controller";
import { User } from "../../../../backend/dist/models/user.model";
import { ClassGroup } from "../../../../backend/dist/models/class_group.model";
import { AssignmentGroup } from "../../../../backend/dist/models/assignment_group.model";
import { StudentTeam } from "../../../../backend/dist/models/student_team.model";
import { Portfolio } from "../../../../backend/dist/models/portfolio.model";
import { IUser } from "../../../../backend/models/user.model";
import { FilterQuery, Types } from "mongoose";
import { IClassGroup } from "../../../../backend/models/class_group.model";
import { IStudentTeam } from "../../../../backend/models/student_team.model";
import { IAssignmentGroup } from "../../../../backend/models/assignment_group.model";

let existingUser: IUser = {
    userId: "some-user-id",
    platform: "some-platform",
    portfolios: [],
    acceptedTerms: true,
};

let existingClassGroup: IClassGroup = {
    uuid: "some-uuid",
    ownedBy: [existingUser],
    name: "Class Group 1",
    description: "Description 1",
    students: [],
    awaitingStudents: [],
    createdAt: new Date(),
};

let existingAssignmentGroup: IAssignmentGroup = {
    uuid: "some-uuid",
    name: "Assignment 1",
    description: "Description 1",
    inClassGroup: existingClassGroup,
    studentTeams: [],
};

let existingStudentTeam: IStudentTeam = {
  uuid: "some-uuid",
  students: [],
  portfolio: null,
};

describe("AssignmentGroupController", () => {
    let controller: AssignmentGroupController;
    let req: Request;
    let res: Response;

    beforeEach(() => {
        controller = new AssignmentGroupController();
        // @ts-ignore
        req = {
            params: {
                classGroupUUID: "some-uuid",
            },
            userId: "some-user-id",
            platform: "some-platform",
        } as Request;
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        } as unknown as Response;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("all", () => {
        it("should return assignments for a given class group", async () => {
            jest.spyOn(User, "findOne").mockResolvedValue(existingUser);
            jest.spyOn(ClassGroup, "findOne").mockResolvedValue(existingClassGroup);
            jest.spyOn(AssignmentGroup, "find").mockReturnValue(
              {
                // @ts-ignore
                populate: jest.fn().mockResolvedValueOnce([existingAssignmentGroup]),
              }
            );

            await controller.all(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([existingAssignmentGroup]);
        });

        it("should return a 500 error if there is an error", async () => {
            jest.spyOn(User, "findOne").mockRejectedValue(new Error("Database error"));

            await controller.all(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: "Unable to create assignment" });
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe("updateStudentTeams", () => {
      it("should remove student teams that no longer exist", async () => {
          const currentTeams = [existingStudentTeam];
          const newTeams: IStudentTeam[] = [];

          jest.spyOn(StudentTeam, "findOneAndDelete").mockResolvedValue(null);

          const result = await controller.updateStudentTeams(currentTeams, newTeams, existingUser, "Assignment 1");

          expect(StudentTeam.findOneAndDelete).toHaveBeenCalledWith({ uuid: existingStudentTeam.uuid });
          expect(result).toEqual([]);
      });

     
  });
});

existingUser = {
    userId: "some-user-id",
    platform: "some-platform",
    portfolios: [],
    acceptedTerms: true,
};

existingClassGroup = {
    uuid: "some-uuid",
    ownedBy: [existingUser],
    name: "Class Group 1",
    description: "Description 1",
    students: [],
    awaitingStudents: [],
    createdAt: new Date(),
};

existingAssignmentGroup = {
    uuid: "some-uuid",
    name: "Assignment 1",
    description: "Description 1",
    inClassGroup: existingClassGroup,
    studentTeams: [],
};

describe("AssignmentGroupController", () => {
    let controller: AssignmentGroupController;
    let req: Request;
    let res: Response;

    beforeEach(() => {
        controller = new AssignmentGroupController();
        req = {} as Request;
        res = {} as Response;
        // @ts-ignore
        res.status = jest.fn().mockReturnThis();
        // @ts-ignore
        res.json = jest.fn();
        // @ts-ignore
        res.send = jest.fn();
        // @ts-ignore
        req.userId = "some-user-id";
        // @ts-ignore
        req.platform = "some-platform";
        // @ts-ignore
        req.params = {
            classGroupUUID: "some-uuid",
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("all", () => {
        it("should return assignments", async () => {
            const mockFindOne = jest
                .fn<(filter?: FilterQuery<IUser>) => Promise<IUser>>()
                .mockResolvedValueOnce(existingUser);
            // @ts-ignore
            jest.spyOn(User, "findOne").mockImplementationOnce(mockFindOne);
            const mockFindClassGroup = jest
                .fn<(filter?: FilterQuery<IClassGroup>) => Promise<IClassGroup>>()
                .mockResolvedValueOnce(existingClassGroup);
            // @ts-ignore
            jest.spyOn(ClassGroup, "findOne").mockImplementationOnce(mockFindClassGroup);
            const mockFindAssignments = jest.fn<(filter?: FilterQuery<IStudentTeam>) => any>().mockResolvedValueOnce({
                populate: jest
                    .fn<(query: any) => Promise<IAssignmentGroup[]>>()
                    .mockResolvedValueOnce([existingAssignmentGroup]),
            });
            // @ts-ignore
            jest.spyOn(AssignmentGroup, "find").mockImplementationOnce(mockFindAssignments);

            await controller.all(req, res);

            expect(mockFindOne).toHaveBeenCalledTimes(1);
            expect(mockFindOne).toHaveBeenCalledWith({
                // @ts-ignore
                userId: req.userId,
                // @ts-ignore
                platform: req.platform,
            });
            expect(mockFindClassGroup).toHaveBeenCalledTimes(1);

            expect(mockFindAssignments).toHaveBeenCalledTimes(1);

        });

        it("should handle errors", async () => {
      const mockFindOne = User.findOne as jest.Mock;
      // @ts-ignore
      mockFindOne.mockRejectedValueOnce(new Error("Database error"));

      await controller.all(req, res);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne).toHaveBeenCalledWith({
        // @ts-ignore
        userId: req.userId,
        // @ts-ignore
        platform: req.platform,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Unable to create assignment",
      });
    });
  });
});

