import Joi from "joi";
import { KarmaService } from "../services/karma.service";

export const createUserSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  karma_id: Joi.string().optional()
});
