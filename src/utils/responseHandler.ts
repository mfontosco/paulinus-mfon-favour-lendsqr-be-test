import { Response } from "express";

export default {
  sendSuccess: (res: Response, data: any, message = "Success") => {
    return res.status(200).json({ status: true, message, data });
  },

  sendError: (res: Response, statusCode = 500, message = "Error") => {
    return res.status(statusCode).json({ status: false, message });
  },

  internalServerError: (res: Response) => {
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  },
};
