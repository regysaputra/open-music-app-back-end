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
 
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId: playlistId,
        },
      });

      response.code(201);

      return response;
  }

  async getPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const playlist = await this._service.getPlaylists(credentialId);

    return {
        status: 'success',
        data: {
          playlists: playlist,
        },
    };
  }

  async deletePlaylistByIdHandler(request, h) {
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.verifyPlaylistOwner(playlistId, credentialId);
        await this._service.deletePlaylistById(playlistId);

        return {
          status: 'success',
          message: 'Playlist berhasil dihapus'
        }
  }
}

module.exports = PlaylistsHandler;