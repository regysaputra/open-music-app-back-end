const Joi = require('joi');
 
const PlaylistSongsPayloadSchema = Joi.object({
    songId: Joi.string().min(7).required()
});

module.exports = { PlaylistSongsPayloadSchema };