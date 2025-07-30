import { Request, Response } from "express";
import { createUserSchema } from "../validations/user.validation";
import { UserService } from "../services/user.services";
import responseHandler from "../utils/responseHandler";

export const createUser = async (req: Request, res: Response) => {
  const { error, value } = createUserSchema.validate(req.body);

  if (error) {
    return responseHandler.sendError(res, 400, error.details[0].message);
  }

  try {
    const user = await UserService.createUser(value);
    return responseHandler.sendSuccess(res, user, "User created successfully.");
  } catch (err: any) {
    return responseHandler.sendError(res, 500, err.message || "Failed to create user.");
  }
};
