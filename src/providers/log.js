import * as log4js from 'log4js';

export default class Log {

    constructor(){
        this.log4js = log4js;

        this.configure();
    }

    configure(){
        this.log4js.loadAppender('log4js-logstash');
        this.log4js.addAppender(this.log4js.appenders['log4js-logstash']());
        this.log4js.configure({
            appenders: [
                { type: 'console', category: 'logs' },
                {
                    type: 'log4js-logstash',
                    host: 'logstash.com',
                    port: 9999,
                    appName: 'appName',
                    fields: {
                        appName: 'appName'
                    },
                    category: 'logs'
                }
            ]
        });

        this.logger = this.log4js.getLogger('logs');
    }

    trace(message) {
        this.logger.trace(message);
    }

    debug(message) {
        this.logger.debug(message);
    }

    info(message) {
        this.logger.info(message);
    }

    warn(message) {
        this.logger.warn(message);
    }

    error(message) {
        this.logger.error(message);
    }

    fatal(message) {
        this.logger.fatal(message);
    }
}
