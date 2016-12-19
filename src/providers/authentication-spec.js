import TestUtils from '../test-utils';
import Authentication from './authentication';
import Http from './http';

describe('Provider: Authentication', () => {
    let promises, permissions, request, response, mock, user, token;

    beforeEach(() => {
        spyOn(Http, 'error');

        permissions = [];

        promises = TestUtils.modelSpy(Authentication.tokenModel);

        request = {};
        response = {};
        mock = {
            next: function(){}
        };

        spyOn(mock, 'next');

        user = {
            _id: 1,
            name: 'Teste',
            email: 'teste@teste.com',
            photo: 'teste',
            type: 'student'
        };

        token = TestUtils.createToken(user);
    });

    it('criar novo token e salvar no banco de dados', (done) => {
        promises.create.resolve({});
        let promise = Authentication.createToken(user);

        promise.then((userForm) => {
            expect(Authentication.tokenModel.create).toHaveBeenCalled();
            expect(userForm.token).toBeDefined();
            done();
        });
    });

    it('deletar token no banco de dados', () => {
        Authentication.deleteToken(token);

        expect(Authentication.tokenModel.delete).toHaveBeenCalledWith(token);
    });

    it('retorna precisa está logado para request sem o token', (done) => {
        let promise = Authentication.checkAuthAndPermission(permissions, request, response, mock.next, null, null);

        promise.then(() => {
            expect(Http.error).toHaveBeenCalledWith(response, 'Precisa está logado', 401);
            done();
        });
    });

    it('retorna precisa está logado para request com o token inválido', (done) => {
        request.headers = {
            authorization: 'Bearer 1234'
        };

        let promise = Authentication.checkAuthAndPermission(permissions, request, response, mock.next, null, null);

        promise.then(() => {
            expect(Http.error).toHaveBeenCalledWith(response, 'Precisa está logado', 401);
            done();
        });
    });

    it('retorna precisa está logado para request com o token inválido novamente', (done) => {
        request.headers = {
            authorization: 'Bearer1234'
        };

        let promise = Authentication.checkAuthAndPermission(permissions, request, response, mock.next, null, null);

        promise.then(() => {
            expect(Http.error).toHaveBeenCalledWith(response, 'Precisa está logado', 401);
            done();
        });
    });

    it('retorna precisa está logado para request com o token, porem expirado', (done) => {
        request.headers = {
            authorization: `Bearer ${token}`
        };

        promises.load.reject();

        let promise = Authentication.checkAuthAndPermission(permissions, request, response, mock.next, null, null);

        promise.then(() => {
            expect(Http.error).toHaveBeenCalledWith(response, 'Precisa está logado', 401);
            done();
        });
    });

    it('retorna acesso negado, com token válido', (done) => {
        request.headers = {
            authorization: `Bearer ${token}`
        };

        permissions = ['admin'];

        promises.load.resolve({});

        let promise = Authentication.checkAuthAndPermission(permissions, request, response, mock.next, null, null);

        promise.then(() => {
            expect(Http.error).toHaveBeenCalledWith(response, 'Acesso negado', 403);
            done();
        });
    });

    it('continua com token válido e permissão para tudo', (done) => {
        user.permissions = ['student'];

        request.headers = {
            authorization: `Bearer ${TestUtils.createToken(user)}`
        };

        permissions = ['all'];

        promises.load.resolve({});

        let promise = Authentication.checkAuthAndPermission(permissions, request, response, mock.next, null, null);

        promise.then(() => {
            expect(mock.next).toHaveBeenCalled();
            done();
        });
    });

    it('continua com token válido e permissão especifica', (done) => {
        user.permissions = ['student'];

        request.headers = {
            authorization: `Bearer ${TestUtils.createToken(user)}`
        };

        permissions = ['student'];

        promises.load.resolve({});

        let promise = Authentication.checkAuthAndPermission(permissions, request, response, mock.next, null, null);

        promise.then(() => {
            expect(mock.next).toHaveBeenCalled();
            done();
        });
    });


});
