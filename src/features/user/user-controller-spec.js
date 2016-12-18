import TestUtils from '../../test-utils';
import UserController from './user-controller';
import Http from '../../providers/http';
import Mongo from '../../providers/mongo';

describe('UserController', () => {
    let user, request, response, promises, error, list, load, userForm;

    beforeEach(() => {
        user = new UserController();

        promises = TestUtils.modelSpy(user.userModel);

        spyOn(Http, 'success').and.callThrough();
        spyOn(Http, 'error').and.callThrough();
        spyOn(Mongo, 'errorMongo').and.callThrough();

        request = {
            query: '',
            params: {
                id: 1
            },
            body: {
                name: 'User Teste',
                email: 'teste@teste.com',
                type: 'admin',
                status: 'enable',
                office: 'Tester'
            }
        };

        response = {
            status: function(){
                return this;
            },
            json: function(){
                return this;
            }
        };

        spyOn(response, 'status').and.callThrough();
        spyOn(response, 'json').and.callThrough();

        error = {
            status: 500
        };

        list = [];
        load = {};

        userForm = {
            name: 'User Teste',
            email: 'teste@teste.com',
            type: 'admin',
            status: 'enable',
            office: 'Tester'
        };
    });

    describe('list', () => {
        it('deve listar os usuários', (done) => {
            promises.list.resolve(list);
            user.list(request, response);

            expect(user.userModel.list).toHaveBeenCalledWith(request.query);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, list);
                done();
            });
        });

        it('deve retorna um erro', (done) => {
            promises.list.reject(error);
            user.list(request, response);

            expect(user.userModel.list).toHaveBeenCalledWith(request.query);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('load', () => {
        it('deve retorna um usuário', (done) => {
            promises.load.resolve(load);
            user.load(request, response);

            expect(user.userModel.load).toHaveBeenCalledWith(request.params.id);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, load);
                done();
            });
        });

        it('deve retorna um erro', (done) => {
            promises.load.reject(error);
            user.load(request, response);

            expect(user.userModel.load).toHaveBeenCalledWith(request.params.id);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('create', () => {
        it('deve criar um usuário', (done) => {
            promises.create.resolve();
            user.create(request, response);

            expect(user.userModel.create).toHaveBeenCalledWith(userForm);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, null, 201);
                done();
            });
        });

        it('deve retorna um erro', (done) => {
            promises.create.reject(error);
            user.create(request, response);

            expect(user.userModel.create).toHaveBeenCalledWith(userForm);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('update', () => {
        it('deve atualizar um usuário', (done) => {
            promises.update.resolve();
            user.update(request, response);

            expect(user.userModel.update).toHaveBeenCalledWith(request.params.id, userForm);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, null, 204);
                done();
            });
        });

        it('deve retorna um erro', (done) => {
            promises.update.reject(error);
            user.update(request, response);

            expect(user.userModel.update).toHaveBeenCalledWith(request.params.id, userForm);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('delete', () => {
        it('deve excluir um usuário', (done) => {
            promises.delete.resolve();
            user.delete(request, response);

            expect(user.userModel.delete).toHaveBeenCalledWith(request.params.id);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, null, 204);
                done();
            });
        });

        it('deve retorna um erro', (done) => {
            promises.delete.reject(error);
            user.delete(request, response);

            expect(user.userModel.delete).toHaveBeenCalledWith(request.params.id);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('loginGoogle', () => {
        it('tentar logar sem informar o email', (done) => {
            request.body = {};

            user.loginGoogle(request, response);

            setTimeout(() => {
                expect(Http.error).toHaveBeenCalledWith(response, 'Tente se logar novamente');
                done();
            });
        });

        it('logar usando conta do Google', (done) => {
            const userInfo = {
                "id": "100000000000000000000001",
                "name": "Teste",
                "email": "teste@teste.com.br",
                "photo": "https://lh3.googleusercontent.com/",
                "type": "user",
                "token": null
            };

            promises.loginGoogle.resolve(userInfo);

            request.body = {
                name: 'Teste',
                email: 'teste@teste.com.br',
                photo: 'http://google.com.br/'
            };

            user.loginGoogle(request, response);

            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, userInfo);
                done();
            });
        });

        it('tratar erro ao tentar logar com erro no mongo', (done) => {
            promises.loginGoogle.reject(error);

            request.body = {
                name: 'Teste',
                email: 'teste@teste.com.br',
                photo: 'http://google.com.br/'
            };

            user.loginGoogle(request, response);

            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('logout', () => {
        it('tratar erro ao tentar fazer logout com erro no mongo', (done) => {
            promises.logout.reject(error);

            user.logout(request, response);

            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });

        it('deleta token no banco de dados', (done) => {
            promises.logout.resolve();

            user.logout(request, response);

            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, null, 204);
                done();
            });
        });
    });

});
