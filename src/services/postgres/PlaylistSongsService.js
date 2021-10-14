const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongsService {
    constructor(collaborationService) {
        this._pool = new Pool();
        this._collaborationService = collaborationService
    }

    async addSongToPlaylist(playlistId, songId) {
        const id = `playlistsong-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if(!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan pada playlist');
        }

        return result.rows[0].id;
    }

    async getSongFromPlaylist(playlistId) {
        const query = {
            text: `SELECT ps.id, s.title, s.performer 
            FROM playlistsongs ps 
            LEFT JOIN music s 
            ON ps.song_id = s.id 
            WHERE ps.playlist_id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);
      
        if (!result.rows.length) {
            throw new InvariantError('Playlist gagal diverifikasi');
        }

        return result.rows;
    }

    async verifyPlaylistSongOwner(playlistId, credentialId) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [playlistId],
        };
      
        const result = await this._pool.query(query);
      
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
      
        const playlistsong = result.rows[0];
        
        if (playlistsong.owner !== credentialId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess (playlistId, userId) {
        try {
          await this.verifyPlaylistSongOwner(playlistId, userId)
        } catch (error) {
          if (error instanceof NotFoundError) {
            throw error
          }
          try {
            await this._collaborationService.verifyCollaborator(playlistId, userId)
          } catch {
            throw error
          }
        }
    }

    async deleteMusicFromPlaylist(playlistId, songId) {
        const query = {
          text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
          values: [playlistId, songId],
        };
        //console.log("songId = " + songId);
        const result = await this._pool.query(query);
        //console.log("songId = " + songId + " , " + "result = " + result.rows.length);
        if (!result.rows.length) {
            throw new NotFoundError('Lagu pada playlist gagal dihapus');
        }
    }

    // async verifyPlaylistAccess(playlistId, userId) {
    //     try {
    //         await this.verifyPlaylistOwner(playlistId, userId);
    //     } catch (error) {
    //         if (error instanceof NotFoundError) {
    //           throw error;
    //         }

    //         try {
    //             await this._collaborationService.verifyCollaborator(playlistId, userId);
    //         } catch {
    //             throw error;
    //         }
    //     }
    // }
}

module.exports = PlaylistSongsService;