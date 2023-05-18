import * as yup from "yup";

export const integerValidator = yup.number().min(1);