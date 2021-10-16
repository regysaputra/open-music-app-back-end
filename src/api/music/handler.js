const { successResponse } = require('../../utils/responses');

class MusicHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postMusicHandler = this.postMusicHandler.bind(this);
        this.getMusicHandler = this.getMusicHandler.bind(this);
        this.getMusicByIdHandler = this.getMusicByIdHandler.bind(this);
        this.putMusicByIdHandler = this.putMusicByIdHandler.bind(this);
        this.deleteMusicByIdHandler = this.deleteMusicByIdHandler.bind(this);
    }

    async postMusicHandler(request, h) {
        this._validator.validateMusicPayload(request.payload);

        const musicId = await this._service.addMusic(request.payload);

        return successResponse(h, {
            responseMessage: 'Lagu berhasil ditambahkan',
            responseData: { songId: musicId },
            responseCode: 201,
        });
    }

    async getMusicHandler(request, h) {
        const music = await this._service.getMusic();

        return successResponse(h, {
            responseData: { songs: music },
        });
    }

    async getMusicByIdHandler(request, h) {
        const { songId } = request.params;
        const music = await this._service.getMusicById(songId)

        return successResponse(h, {
            responseData: { song: music },
        });
    }

    async putMusicByIdHandler(request, h) {
        this._validator.validateMusicPayload(request.payload);
        const { songId } = request.params;
    
        await this._service.editMusicById(songId, request.payload);

        return successResponse(h, {
            responseMessage: 'lagu berhasil diperbarui',
        });
    }

    async deleteMusicByIdHandler(request, h) {
        const { songId } = request.params;
        await this._service.deleteMusicById(songId);

        return successResponse(h, {
            responseMessage: 'lagu berhasil dihapus',
        });
    }
}

module.exports = MusicHandler;