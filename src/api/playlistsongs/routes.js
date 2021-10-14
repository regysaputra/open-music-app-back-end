const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{playlistId}/songs',
        handler: handler.postMusicToPlaylistByIdHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/songs',
        handler: handler.getMusicFromPlaylistByIdHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/songs',
        handler: handler.deleteMusicFromPlaylistByIdHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    }
];

module.exports = routes;