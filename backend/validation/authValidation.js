import Joi from 'joi';

export const loginValidation = (data) => {
  const schema = Joi.object({
    identifier: Joi.string().required().messages({
      'string.empty': 'Email or Mobile Number cannot be empty',
      'any.required': 'Email or Mobile Number is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required',
    }),
  });
  return schema.validate(data);
};
