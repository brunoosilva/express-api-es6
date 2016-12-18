import Log from './log';

describe('Provider: Log', () => {
    let log;

    beforeEach(() => {
        log = new Log();

        spyOn(log.log4js, 'loadAppender');
        spyOn(log.log4js, 'configure');

        spyOn(log.logger, 'trace');
        spyOn(log.logger, 'debug');
        spyOn(log.logger, 'info');
        spyOn(log.logger, 'warn');
        spyOn(log.logger, 'error');
        spyOn(log.logger, 'fatal');
    });

    it('deve contruir as configs do log', () => {
        log.configure();

        expect(log.log4js.loadAppender).toHaveBeenCalledWith('log4js-logstash');
        expect(log.log4js.configure).toHaveBeenCalledWith({
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
    });

    it('deve gerar um log de trace', () => {
        log.trace('Teste');

        expect(log.logger.trace).toHaveBeenCalledWith('Teste');
    });

    it('deve gerar um log de debug', () => {
        log.debug('Teste');

        expect(log.logger.debug).toHaveBeenCalledWith('Teste');
    });

    it('deve gerar um log de info', () => {
        log.info('Teste');

        expect(log.logger.info).toHaveBeenCalledWith('Teste');
    });

    it('deve gerar um log de warn', () => {
        log.warn('Teste');

        expect(log.logger.warn).toHaveBeenCalledWith('Teste');
    });

    it('deve gerar um log de error', () => {
        log.error('Teste');

        expect(log.logger.error).toHaveBeenCalledWith('Teste');
    });

    it('deve gerar um log de fatal', () => {
        log.fatal('Teste');

        expect(log.logger.fatal).toHaveBeenCalledWith('Teste');
    });
});
