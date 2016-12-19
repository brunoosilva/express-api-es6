import TestUtils from '../../test-utils';

describe('User', () => {
    let userData, request;

    beforeEach(() => {
        request = TestUtils.requestApi('users');

        userData = [
            {
                "_id" : "100000000000000000000000",
                "name" : "Bruno",
                "email" : "bruno.silva@teste.com.br",
                "photo" : "https://s3.amazonaws.com/",
                "type" : "admin",
                "status" : "enable",
                "office": "Front-end Developer",
                "signature": "https://s3.amazonaws.com/",
                "description": "teste",
                "facebookUrl" : "https://www.facebook.com/",
                "twitterUrl" : "https://www.twitter.com/",
                "googlePlusUrl" : "https://plus.google.com/",
                "linkedInUrl" : "https://www.linkedin.com/in/brunoweb",
                "createdAt": "2016-11-29T16:36:57.043Z"
            },
            {
                "_id" : "100000000000000000000001",
                "name" : "Teste",
                "email" : "teste@teste.com.br",
                "photo" : "https://s3.amazonaws.com/",
                "type" : "teacher",
                "status" : "enable",
                "office": "Professor",
                "signature": "https://s3.amazonaws.com/",
                "description": "teste",
                "facebookUrl" : "https://www.facebook.com/",
                "twitterUrl" : "https://www.twitter.com/",
                "googlePlusUrl" : "https://plus.google.com/",
                "linkedInUrl" : "https://www.linkedin.com/in/",
                "createdAt": "2016-11-29T16:36:57.043Z"
            },
            {
                "_id" : "100000000000000000000002",
                "name" : "Editor",
                "email" : "editor@teste.com.br",
                "photo" : "https://s3.amazonaws.com/",
                "type" : "editor",
                "status" : "enable",
                "office": "Editor",
                "signature": "https://s3.amazonaws.com/",
                "description": "Editor",
                "facebookUrl" : "https://www.facebook.com/",
                "twitterUrl" : "https://www.twitter.com/",
                "googlePlusUrl" : "https://plus.google.com/",
                "linkedInUrl" : "https://www.linkedin.com/in/",
                "createdAt": "2016-11-29T16:36:57.043Z"
            }
        ];
    });

    describe('GET /users', () => {
        it('deve listar os usuários', (done) => {

            request.get('/')
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(200, userData)
                .end(TestUtils.endTest.bind(null, done));
        });
    });

    describe('GET /users/:id', () => {
        it('obter um usuário existente', (done) => {
            const userId = '100000000000000000000000';

            request.get(`/${userId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(200, userData[0])
                .end(TestUtils.endTest.bind(null, done));
        });

        it('obter um usuário não existente', (done) => {
            const userId = '100000000000000000000010';

            request.get(`/${userId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(404, {
                    "status": 404,
                    "message": "Registro não encontrado",
                    "fields": null
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('obter um usuário com id inválido', (done) => {
            const userId = 'teste';

            request.get(`/${userId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(404, {
                    "status": 404,
                    "message": "Registro não encontrado",
                    "fields": null
                })
                .end(TestUtils.endTest.bind(null, done));
        });
    });

    describe('POST /users', () => {
        it('validar os campos obrigatórios', (done) => {

            request.post('/')
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(400, {
                    "status": 400,
                    "message": "Parâmetros inválidos",
                    "fields": {
                        "office": {
                            "message": "Informe o cargo",
                            "name": "ValidatorError",
                            "properties": {
                                "type": "required",
                                "message": "Informe o cargo",
                                "path": "office"
                            },
                            "kind": "required",
                            "path": "office"
                        },
                        "email": {
                            "message": "Informe o email",
                            "name": "ValidatorError",
                            "properties": {
                                "type": "required",
                                "message": "Informe o email",
                                "path": "email"
                            },
                            "kind": "required",
                            "path": "email"
                        },
                        "name": {
                            "message": "Informe o nome",
                            "name": "ValidatorError",
                            "properties": {
                                "type": "required",
                                "message": "Informe o nome",
                                "path": "name"
                            },
                            "kind": "required",
                            "path": "name"
                        }
                    }
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('validar registro existente com o mesmo email', (done) => {

            request.post('/')
                .send(userData[0])
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(400, {
                    "status": 400,
                    "message": "Parâmetros inválidos",
                    "fields": {
                        "email": {
                            "message": "Email já utilizado",
                            "name": "ValidatorError",
                            "properties": {
                                "type": "unique",
                                "message": "Email já utilizado",
                                "path": "email",
                                "value": "bruno.silva@teste.com.br"
                            },
                            "kind": "unique",
                            "path": "email",
                            "value": "bruno.silva@teste.com.br"
                        }
                    }
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('criar novo usuário', (done) => {

            request.post('/')
                .send({
                    "name": "Novo usuario",
                    "email": "novo@teste.com.br",
                    "office": "Teste"
                })
                .set('Authorization', TestUtils.tokens.admin)
                .expect(201)
                .end(TestUtils.endTest.bind(null, done));
        });
    });

    describe('PUT /users/:id', () => {
        it('deve atualizar o usuário', (done) => {
            const userId = '100000000000000000000000';


            request.put(`/${userId}`)
                .send({
                    name: 'Bruno 2'
                })
                .set('Authorization', TestUtils.tokens.admin)
                .expect(204)
                .end(TestUtils.endTest.bind(null, done));
        });

        it('validar se foi atualizada', (done) => {
            const userId = '100000000000000000000000';

            const dataUser = userData[0];
            dataUser.name = 'Bruno 2';

            request.get(`/${userId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(200, dataUser)
                .end(TestUtils.endTest.bind(null, done));
        });
    });

    describe('DELETE /users/:id', () => {

        it('excluir um usuário não existente', (done) => {
            const userId = '100000000000000000000020';

            request.delete(`/${userId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(404, {
                    "status": 404,
                    "message": "Registro não encontrado",
                    "fields": null
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('excluir usuário', (done) => {
            const userId = '100000000000000000000001';

            request.delete(`/${userId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect(204)
                .end(TestUtils.endTest.bind(null, done));
        });

        it('validar se o usuario foi deletado', (done) => {
            const userId = '100000000000000000000001';

            request.get(`/${userId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect(404, {
                    "status": 404,
                    "message": "Registro não encontrado",
                    "fields": null
                })
                .end(TestUtils.endTest.bind(null, done));
        });
    });

    describe('POST /users/loginGoogle', () => {
        it('Tenta se logar sem passar nenhuma informacao', (done) => {
            request.post(`/loginGoogle`)
                .expect(400, {
                    status: 400,
                    message: 'Tente se logar novamente'
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('Logar com dados do google', (done) => {
            request.post(`/loginGoogle`)
                .send({
                    email: 'editor@teste.com.br',
                    name: 'Editor',
                    photo: 'https://s3.amazonaws.com/'
                })
                .expect(200)
                .expect((res) => {
                    if (!('token' in res.body)) throw new Error('Token não informado');
                })
                .expect((res) => {
                    res.body.token = null
                })
                .expect({
                    "id": "100000000000000000000002",
                    "name": "Editor",
                    "email": "editor@teste.com.br",
                    "photo": "https://s3.amazonaws.com/",
                    "type": "editor",
                    "token": null
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('Tenta logar novamente com os mesmos dados', (done) => {
            request.post(`/loginGoogle`)
                .send({
                    email: 'editor@teste.com.br',
                    name: 'Editor',
                    photo: 'https://s3.amazonaws.com/'
                })
                .expect(400, {
                    "status": 400,
                    "message": "Parâmetros inválidos",
                    "fields": {
                        "email": {
                            "message": "Você já está logado",
                            "name": "ValidatorError",
                            "properties": {
                                "type": "unique",
                                "message": "Você já está logado",
                                "path": "email",
                                "value": "editor@teste.com.br"
                            },
                            "kind": "unique",
                            "path": "email",
                            "value": "editor@teste.com.br"
                        }
                    }
                })
                .end(TestUtils.endTest.bind(null, done));
        });
    });

    describe('POST /users/logout', () => {
        it('Tenta deslogar sem ter feito o login', (done) => {
            request.post(`/logout`)
                .expect(401, {
                    "status": 401,
                    "message": "Precisa está logado"
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('Faz logout do usuário', (done) => {
            request.post(`/logout`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect(204)
                .end(TestUtils.endTest.bind(null, done));
        });
    });
});
