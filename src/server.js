const Hapi = require('@hapi/hapi');
const MusicValidator = require('./validator');
const music = require('./api/music');
const MusicService = require('./services/postgres/MusicService');
const ClientError = require('./exception/ClientError');
require('dotenv').config();

const init = async () => {
    const musicService = new MusicService();
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            }
        }
    });

    //this function for pluggin
    await server.register({
        plugin: music,
        options: {
            service: musicService,
            validator: MusicValidator,
        },
    });

    server.ext('onPreResponse', (request, h) => {

        // mendapatkan konteks response dari request

        const { response } = request;



        if (response instanceof ClientError) {

            // membuat response baru dari response toolkit sesuai kebutuhan error handling

            const newResponse = h.response({

                status: 'fail',

                message: response.message,

            });

            newResponse.code(response.statusCode);

            return newResponse;

        }



        // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)

        return response.continue || response;

    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();