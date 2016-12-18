import express from 'express';
import expressHealthcheck from 'express-healthcheck';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';

// Providers
import Log from './providers/log';

// Config
import config from './config';

// Routes
import routes from './routes';

class Api {
    constructor(){
        this.app = express();
        this.log = new Log();
        this.mongoose = mongoose;

        this.middleware();
        this.connectMongo();
        this.routes();
        this.start();
    }

    middleware(){
        // Enable Cors
        this.app.use(cors());

        // Body Parser
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // Morgan - HTTP request logger
        this.app.use(morgan('combined'));

        // HealthCheck
        this.app.use('/healthcheck', expressHealthcheck());
    }

    connectMongo(){
        this.mongoConfig = config.mongo();
        this.mongoose.connect(this.mongoConfig.uri);

        // Set Promise
        this.mongoose.Promise = Promise;

        // Callbacks of connection
        this.mongoose.connection.on('error', (err) =>
            this.log.fatal(`MongoDB connection error: ${err}`));

        this.mongoose.connection.on('connected', () =>
            this.log.info(`MongoDB connection open to: ${this.mongoConfig.uri}`));

        this.mongoose.connection.on('disconnected', () =>
            this.log.fatal('MongoDB connection disconnected'));
    }

    routes(){
        routes.map((route) => this.app.use('/', route));
    }

    start(){
        this.app.listen(config.port);
        this.log.info(`Listening on ${config.port}`);
    }
}

export default new Api();