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

        const { title, year, performer, genre, duration } = request.payload;

        const music = await this._service.addMusic({ title, year, performer, genre, duration });

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId: music
            }
        })

        response.code(201);

        return response;
    }

    async getMusicHandler(request, h) {
        const music = await this._service.getMusic();

        const musicRest = music.map(({year, genre, duration, insertedAt, updatedAt,...rest}) => ({...rest}));

        return {
            status: 'success',
            data: {
                songs: musicRest,
            },
        };
    }

    async getMusicByIdHandler(request, h) {
        const { songId } = request.params;
        const music = await this._service.getMusicById(songId)

        return {
            status: 'success',
            data: {
                song: music,
            },
        };
    }

    async putMusicByIdHandler(request, h) {
        this._validator.validateMusicPayload(request.payload);
        const { songId } = request.params;
    
        await this._service.editMusicById(songId, request.payload);

        return{
            status: "success",
            message: "Lagu berhasil diperbarui"
        };
    }

    async deleteMusicByIdHandler(request, h) {
        const { songId } = request.params;
        await this._service.deleteMusicById(songId);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus'
        }
    }
}

module.exports = MusicHandler;