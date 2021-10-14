const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}',
        handler: handler.deletePlaylistByIdHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    }
];

module.exports = routes;