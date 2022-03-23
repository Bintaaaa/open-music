const ClientError = require("../../exception/ClientError");

class MusicHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postAlbumHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const { name, year } = request.payload;
            const albumId = await this._service.addAlbum({ name, year });
            const response = h.response({
                status: 'success',
                message: 'Menambahkan album',
                data: {
                    album: albumId
                }
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            //SERVER ERROR
            const response = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server kami!'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const album = await this._service.getAlbumById(id);
            return {
                status: 'success',
                data: {
                    album,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(response.statusCode);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server kami!'
            });

            response.code(500);
            console.error(error);
            return response;
        }
    }

    async putAlbumByIdHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        try {
            const { id } = request.params;
            await this._service.editAlbumById(id, request.payload);
            return {
                status: 'success',
                message: 'Album berhasil diperbaharui'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message
                });
                response.code(error.statusCode);
                return response;
            }

            const response = h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server kami!'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteAlbumById(id);
            return {
                status: 'success',
                message: 'Album berhasil dihapus'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = {
                    status: 'fail',
                    message: error.message
                }
                response.code(error.statusCode);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: 'Terjadi Kesalahan pada server kami!'
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const {
                title,
                year,
                performer,
                genre,
                duration,
            } = request.payload;

            const songId = await this._service.addSong({
                title,
                year,
                performer,
                genre,
                duration,
            });

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getSongsHandler() {
        const songs = await this._service.getSongs();
        return {
            status: 'success',
            data: {
                song: songs,
            },
        };
    }

    async getSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const song = await this._service.getSongById(id);
            return {
                status: 'success',
                data: {
                    song,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async putSongByIdHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const { id } = request.params;
            await this._service.editSongById(id, request.payload);
            return {
                status: 'success',
                message: 'Catatan berhasil diperbarui',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteSongByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteSongById(id);

            return {
                status: 'success',
                message: 'Catatan berhasil dihapus',
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server ERROR!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = MusicHandler;