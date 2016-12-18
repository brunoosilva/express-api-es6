import Api from './index';
import config from './config';
import routes from './routes';

describe('Api', () => {

    beforeEach(() => {
        spyOn(Api.app, 'use');
        spyOn(Api.app, 'listen');
        spyOn(Api.mongoose, 'connect');
        spyOn(Api.log, 'info');
    });

    it('valida os middleware', () => {
        Api.middleware();

        expect(Api.app.use.calls.count()).toEqual(5);
    });

    it('valida conexao do mongo', (done) => {
        let mongoConfig = config.mongo();
        Api.connectMongo();

        expect(Api.mongoose.connect).toHaveBeenCalledWith(mongoConfig.uri);
        setTimeout(() => {
            expect(Api.log.info).toHaveBeenCalledWith(`MongoDB connection open to: ${mongoConfig.uri}`);
            done();
        }, 2000);
    });

    it('valida as rotas importadas e passada para o express', () => {
        Api.routes();

        expect(Api.app.use.calls.count()).toEqual(routes.length);

        routes.map((route, index) => {
            expect(Api.app.use.calls.argsFor(index)).toEqual(['/', route]);
        });
    });

    it('valida start da api', () => {
        Api.start();

        expect(Api.app.listen).toHaveBeenCalledWith(config.port);
        expect(Api.log.info).toHaveBeenCalledWith(`Listening on ${config.port}`);
    });
});