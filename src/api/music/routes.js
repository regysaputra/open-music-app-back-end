const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.postMusicHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getMusicHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/songs/{songId}',
        handler: handler.getMusicByIdHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    },
    {
        method: 'PUT',
        path: '/songs/{songId}',
        handler: handler.putMusicByIdHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/songs/{songId}',
        handler: handler.deleteMusicByIdHandler,
        options: {
            auth: 'musicapp_jwt',
        },
    }
];

module.exports = routes;