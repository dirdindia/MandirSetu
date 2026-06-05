import Joi from 'joi';

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required',
    }),
  });
  return schema.validate(data);
};
