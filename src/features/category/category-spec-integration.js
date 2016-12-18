import TestUtils from '../../test-utils';

describe('Category', () => {
    let categoryData, request;

    beforeEach(() => {
        request = TestUtils.requestApi('categories');

        categoryData = [
            {
                _id: '200000000000000000000001',
                name: 'Financeiro',
                url: 'financeiro',
                order: 1,
                parent: null
            },
            {
                _id: '200000000000000000000002',
                name: 'Vendas',
                url: 'vendas',
                order: 2,
                parent: null
            },
            {
                _id: '200000000000000000000003',
                name: 'Caixa',
                url: 'caixa',
                order: 0,
                parent: '200000000000000000000001'
            }
        ];
    });

    describe('GET /categories', () => {
        it('deve listar as categorias', (done) => {

            request.get('/')
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(200, categoryData)
                .end(TestUtils.endTest.bind(null, done));
        });
    });

    describe('GET /categories/tree', () => {
        it('deve listar as categorias em modo tree', (done) => {
            categoryData[0].children = [categoryData[2]];
            categoryData.splice(2, 1);

            request.get('/tree')
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(200, categoryData)
                .end(TestUtils.endTest.bind(null, done));
        });
    });

    describe('GET /categories/:id', () => {
        it('obter uma categoria existente', (done) => {
            const categoryId = '200000000000000000000001';

            request.get(`/${categoryId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(200, categoryData[0])
                .end(TestUtils.endTest.bind(null, done));
        });

        it('obter uma categoria não existente', (done) => {
            const categoryId = '200000000000000000000010';

            request.get(`/${categoryId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(404, {
                    "status": 404,
                    "message": "Registro não encontrado",
                    "fields": null
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('obter uma categoria com id inválido', (done) => {
            const categoryId = 'teste';

            request.get(`/${categoryId}`)
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

    describe('POST /categories', () => {
        it('validar os campos obrigatórios', (done) => {

            request.post('/')
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(400, {
                    "status": 400,
                    "message": "Parâmetros inválidos",
                    "fields": {
                        "name": {
                            "message": "Informe um nome para a categoria",
                            "name": "ValidatorError",
                            "properties": {
                                "type": "required",
                                "message": "Informe um nome para a categoria",
                                "path": "name"
                            },
                            "kind": "required",
                            "path": "name"
                        },
                        "url": {
                            "message": "Informe uma url para a categoria",
                            "name": "ValidatorError",
                            "properties": {
                                "type": "required",
                                "message": "Informe uma url para a categoria",
                                "path": "url",
                                "value": null
                            },
                            "kind": "required",
                            "path": "url",
                            "value": null
                        }
                    }
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('validar registro existente com a mesma url', (done) => {

            request.post('/')
                .send({
                    "name": "Financeiro",
                    "url": "financeiro"
                })
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(400, {
                    "status": 400,
                    "message": "Parâmetros inválidos",
                    "fields": {
                        "url": {
                            "message": "Categoria já cadastrada",
                            "name": "ValidatorError",
                            "properties": {
                                "type": "unique",
                                "message": "Categoria já cadastrada",
                                "path": "url",
                                "value": "financeiro"
                            },
                            "kind": "unique",
                            "path": "url",
                            "value": "financeiro"
                        }
                    }
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('criar uma nova categoria', (done) => {

            request.post('/')
                .send({
                    "name": "Nova categoria",
                    "url": "nova-categoria"
                })
                .set('Authorization', TestUtils.tokens.admin)
                .expect(201)
                .end(TestUtils.endTest.bind(null, done));
        });
    });

    describe('PUT /categories/:id', () => {
        it('deve atualizar a categoria', (done) => {
            const categoryId = '200000000000000000000001';


            request.put(`/${categoryId}`)
                .send({
                    name: 'Financeiro 2'
                })
                .set('Authorization', TestUtils.tokens.admin)
                .expect(204)
                .end(TestUtils.endTest.bind(null, done));
        });

        it('validar se foi atualizada', (done) => {
            const categoryId = '200000000000000000000001';

            request.get(`/${categoryId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(200, {
                    _id: '200000000000000000000001',
                    name: 'Financeiro 2',
                    url: 'financeiro-2',
                    order: 1,
                    parent: null
                })
                .end(TestUtils.endTest.bind(null, done));
        });
    });

    describe('DELETE /categories/:id', () => {
        it('evitar de apagar categoria com dependentes', (done) => {
            const categoryId = '200000000000000000000001';


            request.delete(`/${categoryId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect(409, {
                    status: 409,
                    message: 'Existe registro vinculado, desvincule primeiro',
                    fields: null
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('excluir uma categoria não existente', (done) => {
            const categoryId = '200000000000000000000010';

            request.delete(`/${categoryId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect('Content-Type', /json/)
                .expect(404, {
                    "status": 404,
                    "message": "Registro não encontrado",
                    "fields": null
                })
                .end(TestUtils.endTest.bind(null, done));
        });

        it('excluir uma categoria filha', (done) => {
            request.delete(`/200000000000000000000003`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect(204)
                .end(TestUtils.endTest.bind(null, done));
        });

        it('excluir a categoria pai', (done) => {
            const categoryId = '200000000000000000000001';

            request.delete(`/${categoryId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect(204)
                .end(TestUtils.endTest.bind(null, done));
        });

        it('validar se a categoria foi deletada', (done) => {
            const categoryId = '200000000000000000000001';

            request.get(`/${categoryId}`)
                .set('Authorization', TestUtils.tokens.admin)
                .expect(404, {
                    "status": 404,
                    "message": "Registro não encontrado",
                    "fields": null
                })
                .end(TestUtils.endTest.bind(null, done));
        });
    });
});