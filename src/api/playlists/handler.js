const { successResponse } = require('../../utils/responses');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
 
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }
 
  async postPlaylistHandler(request, h) {
      this._validator.validatePlaylistPayload(request.payload);

      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const playlistId = await this._service.addPlaylist({ name, owner: credentialId });
 
      return successResponse(h, {
        responseMessage: 'Playlist berhasil ditambahkan',
        responseData: {
          playlistId,
        },
        responseCode: 201,
      });
  }

  async getPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const playlistOwner = await this._service.getPlaylists(credentialId);

    return successResponse(h, {
      responseData: { playlists: playlistOwner },
    });
  }

  async deletePlaylistByIdHandler(request, h) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(playlistId, credentialId);

        await this._service.deletePlaylistById(playlistId);

        return successResponse(h, {
          responseMessage: 'Playlist berhasil dihapus',
        });
  }
}

module.exports = PlaylistsHandler;