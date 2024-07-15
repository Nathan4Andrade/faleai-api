import Joi from "joi";

import { CreateBitrixPlatformParams } from "@/repositories";

export const bitrixPlatformSchema = Joi.object<CreateBitrixPlatformParams>({
  url: Joi.string().required(),
});
