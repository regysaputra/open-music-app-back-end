// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');

const music = require('./api/music');
const MusicService = require('./services/postgres/MusicService');
const MusicValidator = require('./validator/music');
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
const Jwt = require('@hapi/jwt');

const init = async () => {
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

  await server.register([
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

  // await server.ext('onPreResponse', (request, h) => {
  //   // mendapatkan konteks response dari request
  //   const { response } = request;
  
  //   if (response instanceof ClientError) {
  //     // membuat response baru dari response toolkit sesuai kebutuhan error handling
  //     const newResponse = h.response({
  //       status: 'fail',
  //       message: response.message,
  //     });

  //     newResponse.code(response.statusCode);
      
  //     return newResponse;
  //   }
  
  //   // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
  //   return response.continue || response;
  // });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();