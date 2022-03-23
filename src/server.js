const Hapi = require('@hapi/hapi');
const MusicValidator = require('./validator');
const music = require('./api/music');
const MusicService = require('./services/postgres/MusicService');
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
    });;

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();