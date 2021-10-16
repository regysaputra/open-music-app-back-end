// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// error
const errors = require('./api/errors');

// music
const music = require('./api/music');
const MusicService = require('./services/postgres/MusicService');
const MusicValidator = require('./validator/music');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// playlistsongs
const playlistsongs = require('./api/playlistsongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistsongs');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// exceptions
const ClientError = require('./exceptions/ClientError')

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService(playlistsService, collaborationsService);
  const musicService = new MusicService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // server.ext('onPreResponse', (request, h) => {
  //   // mendapatkan konteks response dari request
  //   const { response } = request;
    
  //   if (response instanceof Error) {
  //     if (response instanceof ClientError) {
  //       // membuat response baru dari response toolkit sesuai kebutuhan error handling
  //       const newResponse = h.response({
  //         status: 'fail',
  //         message: response.message,
  //       });
                        
  //       newResponse.code(response.statusCode);
        
  //       return newResponse;
  //     }
      
  //     if (response.message === 'Missing authentication') {
  //       return h
  //         .response({
  //           status: 'fail',
  //           message: response.message,
  //         })
  //         .code(401)
  //     }
  //     return h.response({
  //         status: 'error',
  //         message: 'Maaf, terjadi kegagalan pada server kami.',
  //       }).code(500)
  //   }
  
  //   // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
  //   return response.continue || response;
  // });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: errors,
    },
    {
      plugin: music,
      options: {
        service: musicService,
        validator: MusicValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistsongs,
      options: {
        service: playlistSongsService,
        validator: PlaylistSongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();