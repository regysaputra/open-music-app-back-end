const Joi = require('joi');
 
const MusicPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number().integer()
});

module.exports = { MusicPayloadSchema };