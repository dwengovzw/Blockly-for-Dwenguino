/**
 * @jest-environment node
 */

import { describe, expect, it, jest, beforeEach, afterEach } from "@jest/globals";
import { Request, Response } from "express";
import { AssignmentGroupController } from "../../../../backend/dist/controllers/assignmentgroup.controller";
import { User } from "../../../../backend/dist/models/user.model";
import { ClassGroup } from "../../../../backend/dist/models/class_group.model";
import { AssignmentGroup } from "../../../../backend/dist/models/assignment_group.model";
import { StudentTeam } from "../../../../backend/dist/models/student_team.model";
import { Portfolio } from "../../../../backend/dist/models/portfolio.model";
import { IUser } from "../../../../backend/models/user.model";
import { FilterQuery } from "mongoose";
import { IClassGroup } from "../../../../backend/models/class_group.model";
import { IStudentTeam } from "../../../../backend/models/student_team.model";
import { IAssignmentGroup } from "../../../../backend/models/assignment_group.model";

const existingUser: IUser = {
    userId: "some-user-id",
    platform: "some-platform",
    portfolios: [],
    acceptedTerms: true,
};

const existingClassGroup: IClassGroup = {
    uuid: "some-uuid",
    ownedBy: [existingUser],
    name: "Class Group 1",
    description: "Description 1",
    students: [],
    awaitingStudents: [],
    createdAt: new Date(),
};

const existingAssignmentGroup: IAssignmentGroup = {
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

        /*it("should handle errors", async () => {
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
      });*/
    });
});

/*describe("createForClassGroup", () => {
    it("should create a new assignment", async () => {
      const mockFindOne = User.findOne as jest.Mock;
      const mockFindClassGroup = ClassGroup.findOne as jest.Mock;
      const mockFindAssignment = AssignmentGroup.findOne as jest.Mock;
      // @ts-ignore
      const mockUpdateStudentTeams = (controller.updateStudentTeams = jest
        .fn()
        .mockResolvedValueOnce([]));
      // @ts-ignore
      const mockSave = jest.fn().mockResolvedValueOnce({});
      // @ts-ignore
      mockFindOne.mockResolvedValueOnce({});
      // @ts-ignore
      mockFindClassGroup.mockResolvedValueOnce({});
      mockFindAssignment.mockReturnValueOnce(null);
      req.body = {
        uuid: "some-uuid",
        studentTeams: [],
        name: "Assignment 1",
        description: "Description 1",
        starred: true,
      };

      await controller.createForClassGroup(req, res);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne).toHaveBeenCalledWith({
        // @ts-ignore
        userId: req.userId,
        // @ts-ignore
        platform: req.platform,
      });
      expect(mockFindClassGroup).toHaveBeenCalledTimes(1);
      expect(mockFindClassGroup).toHaveBeenCalledWith({
        uuid: req.params.classGroupUUID,
        ownedBy: {
          $in: [expect.any(Object)],
        },
      });
      expect(mockFindAssignment).toHaveBeenCalledTimes(1);
      expect(mockFindAssignment).toHaveBeenCalledWith({ uuid: req.body.uuid });
      expect(mockUpdateStudentTeams).toHaveBeenCalledTimes(1);
      expect(mockUpdateStudentTeams).toHaveBeenCalledWith(
        [],
        req.body.studentTeams,
        expect.any(Object),
        req.body.name
      );
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Assignment successfuly created",
        uuid: expect.any(String),
      });
    });

    it("should update an existing assignment", async () => {
      const mockFindOne = User.findOne as jest.Mock;
      const mockFindClassGroup = ClassGroup.findOne as jest.Mock;
      const mockFindAssignment = AssignmentGroup.findOne as jest.Mock;
      // @ts-ignore
      const mockUpdateStudentTeams = (controller.updateStudentTeams = jest
        .fn()
        .mockResolvedValueOnce([]));
      // @ts-ignore
      const mockSave = jest.fn().mockResolvedValueOnce({});
      // @ts-ignore
      mockFindOne.mockResolvedValueOnce({});
      // @ts-ignore
      mockFindClassGroup.mockResolvedValueOnce({});
      mockFindAssignment.mockReturnValueOnce({
        // @ts-ignore
        populate: jest.fn().mockResolvedValueOnce([]),
        save: mockSave,
      });
      req.body = {
        uuid: "some-uuid",
        studentTeams: [],
        name: "Assignment 1",
        description: "Description 1",
        starred: true,
      };

      await controller.createForClassGroup(req, res);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne).toHaveBeenCalledWith({
        // @ts-ignore
        userId: req.userId,
        // @ts-ignore
        platform: req.platform,
      });
      expect(mockFindClassGroup).toHaveBeenCalledTimes(1);
      expect(mockFindClassGroup).toHaveBeenCalledWith({
        uuid: req.params.classGroupUUID,
        ownedBy: {
          $in: [expect.any(Object)],
        },
      });
      expect(mockFindAssignment).toHaveBeenCalledTimes(1);
      expect(mockFindAssignment).toHaveBeenCalledWith({ uuid: req.body.uuid });
      expect(mockUpdateStudentTeams).toHaveBeenCalledTimes(1);
      expect(mockUpdateStudentTeams).toHaveBeenCalledWith(
        [],
        req.body.studentTeams,
        expect.any(Object),
        req.body.name
      );
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Assignment successfuly created",
        uuid: expect.any(String),
      });
    });

    it("should handle errors", async () => {
      const mockFindOne = User.findOne as jest.Mock;
      // @ts-ignore
      mockFindOne.mockRejectedValueOnce(new Error("Database error"));

      await controller.createForClassGroup(req, res);

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

  describe("delete", () => {
    it("should delete an assignment", async () => {
      const mockFindOne = User.findOne as jest.Mock;
      const mockFindClassGroups = ClassGroup.find as jest.Mock;
      const mockFindAssignment = AssignmentGroup.findOne as jest.Mock;
      const mockDeleteOne = jest.fn();
      // @ts-ignore
      mockFindOne.mockResolvedValueOnce({});
      // @ts-ignore
      mockFindClassGroups.mockResolvedValueOnce([]);
      // @ts-ignore
      mockFindAssignment.mockResolvedValueOnce({
        deleteOne: mockDeleteOne,
      });
      req.params = {
        uuid: "some-uuid",
      };

      await controller.delete(req, res);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne).toHaveBeenCalledWith({
        // @ts-ignore
        userId: req.userId,
        // @ts-ignore
        platform: req.platform,
      });
      expect(mockFindClassGroups).toHaveBeenCalledTimes(1);
      expect(mockFindClassGroups).toHaveBeenCalledWith({
        ownedBy: {
          $in: [expect.any(Object)],
        },
      });
      expect(mockFindAssignment).toHaveBeenCalledTimes(1);
      expect(mockFindAssignment).toHaveBeenCalledWith({
        uuid: req.params.uuid,
        inClassGroup: {
          $in: [],
        },
      });
      expect(mockDeleteOne).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Assignment succesfully deleted.",
      });
    });

    it("should handle assignment not found", async () => {
      const mockFindOne = User.findOne as jest.Mock;
      const mockFindClassGroups = ClassGroup.find as jest.Mock;
      const mockFindAssignment = AssignmentGroup.findOne as jest.Mock;
      // @ts-ignore
      mockFindOne.mockResolvedValueOnce({});
      // @ts-ignore
      mockFindClassGroups.mockResolvedValueOnce([]);
      // @ts-ignore
      mockFindAssignment.mockResolvedValueOnce(null);
      req.params = {
        uuid: "some-uuid",
      };

      await controller.delete(req, res);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne).toHaveBeenCalledWith({
        // @ts-ignore
        userId: req.userId,
        // @ts-ignore
        platform: req.platform,
      });
      expect(mockFindClassGroups).toHaveBeenCalledTimes(1);
      expect(mockFindClassGroups).toHaveBeenCalledWith({
        ownedBy: {
          $in: [expect.any(Object)],
        },
      });
      expect(mockFindAssignment).toHaveBeenCalledTimes(1);
      expect(mockFindAssignment).toHaveBeenCalledWith({
        uuid: req.params.uuid,
        inClassGroup: {
          $in: [],
        },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Assignment not found",
      });
    });

    it("should handle errors", async () => {
      const mockFindOne = User.findOne as jest.Mock;
      // @ts-ignore
      mockFindOne.mockRejectedValueOnce(new Error("Database error"));

      await controller.delete(req, res);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne).toHaveBeenCalledWith({
        // @ts-ignore
        userId: req.userId,
        // @ts-ignore
        platform: req.platform,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occured when removing the assignment",
      });
    });
  });

  describe("favorite", () => {
    it("should mark an assignment as favorite", async () => {
      const mockFindOne = User.findOne as jest.Mock;
      const mockFindClassGroups = ClassGroup.find as jest.Mock;
      const mockFindAssignment = AssignmentGroup.findOne as jest.Mock;
      const mockSave = jest.fn();
      // @ts-ignore
      mockFindOne.mockResolvedValueOnce({});
      // @ts-ignore
      mockFindClassGroups.mockResolvedValueOnce([]);
      // @ts-ignore
      mockFindAssignment.mockResolvedValueOnce({
        save: mockSave,
      });
      req.params = {
        uuid: "some-uuid",
      };
      req.body = {
        favorite: true,
      };

      await controller.favorite(req, res);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne).toHaveBeenCalledWith({
        // @ts-ignore
        userId: req.userId,
        // @ts-ignore
        platform: req.platform,
      });
      expect(mockFindClassGroups).toHaveBeenCalledTimes(1);
      expect(mockFindClassGroups).toHaveBeenCalledWith({
        ownedBy: {
          $in: [expect.any(Object)],
        },
      });
      expect(mockFindAssignment).toHaveBeenCalledTimes(1);
      expect(mockFindAssignment).toHaveBeenCalledWith({
        uuid: req.params.uuid,
        inClassGroup: {
          $in: [],
        },
      });
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Assignment succesfully favorited.",
      });
    });

    it("should handle errors", async () => {
      const mockFindOne = User.findOne as jest.Mock;
      // @ts-ignore
      mockFindOne.mockRejectedValueOnce(new Error("Database error"));

      await controller.favorite(req, res);

      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockFindOne).toHaveBeenCalledWith({
        // @ts-ignore
        userId: req.userId,
        // @ts-ignore
        platform: req.platform,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occured when removing the assignment",
      });
    });
  });
});*/
