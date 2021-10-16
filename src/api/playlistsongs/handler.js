const { successResponse } = require('../../utils/responses');

class PlaylistSongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
 
    this.postMusicToPlaylistByIdHandler = this.postMusicToPlaylistByIdHandler.bind(this);
    this.getMusicFromPlaylistByIdHandler = this.getMusicFromPlaylistByIdHandler.bind(this);
    this.deleteMusicFromPlaylistByIdHandler = this.deleteMusicFromPlaylistByIdHandler.bind(this);
  }

  async postMusicToPlaylistByIdHandler(request, h) {
        this._validator.validatePlaylistSongsPayload(request.payload);
        
        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;
        const { songId } = request.payload;

        await this._service.verifyPlaylistAccess(playlistId, credentialId);
        await this._service.addSongToPlaylist(playlistId, songId);

        return successResponse(h, {
          responseMessage: 'Lagu berhasil ditambahkan ke playlist',
          responseCode: 201,
        });
  }

  async getMusicFromPlaylistByIdHandler(request, h) {
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);

      const song = await this._service.getSongFromPlaylist(playlistId);

      return successResponse(h, {
        responseData: {
          songs: song,
        },
      });
  }

  async deleteMusicFromPlaylistByIdHandler(request, h) {
      this._validator.validatePlaylistSongsPayload(request.payload);

      const { playlistId } = request.params;
      
      const { songId } = request.payload;

      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);

      await this._service.deleteMusicFromPlaylist(playlistId, songId);

      return successResponse(h, {
        responseMessage: 'Lagu berhasil dihapus dari playlist',
      });
  }
}

module.exports = PlaylistSongsHandler;