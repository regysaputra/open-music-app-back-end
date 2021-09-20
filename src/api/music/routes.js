const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.postMusicHandler
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getMusicHandler
    },
    {
        method: 'GET',
        path: '/songs/{songId}',
        handler: handler.getMusicByIdHandler
    },
    {
        method: 'PUT',
        path: '/songs/{songId}',
        handler: handler.putMusicByIdHandler
    },
    {
        method: 'DELETE',
        path: '/songs/{songId}',
        handler: handler.deleteMusicByIdHandler
    }
];

module.exports = routes;