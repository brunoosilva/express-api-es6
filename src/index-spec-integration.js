import TestUtils from './test-utils';

describe('API', () => {
    let request;

    beforeEach(() => {
        request = TestUtils.requestApi('healthcheck');
    });

    it('checar se o serviço de healthcheck está respondendo', () => {
        it('deve listar as categorias', (done) => {

            request.get('/')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(TestUtils.endTest.bind(null, done));
        });
    });
});
