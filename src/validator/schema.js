const Joi = require("joi");

const AlbumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required(),
});

const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number(),
    albumId: Joi.string(),
});

module.exports = { AlbumPayloadSchema, SongPayloadSchema };