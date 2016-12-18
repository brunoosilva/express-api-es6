import TestUtils from '../../test-utils';
import CategoryController from './category-controller';
import Http from '../../providers/http';
import Mongo from '../../providers/mongo';

describe('CategoryController', () => {
    let category, request, response, promises, error, list, load, categoryForm;

    beforeEach(() => {
        category = new CategoryController();

        promises = TestUtils.modelSpy(category.categoryModel);

        spyOn(Http, 'success').and.callThrough();
        spyOn(Mongo, 'errorMongo').and.callThrough();

        request = {
            query: '',
            params: {
                id: 1
            },
            body: {
                name: 'Teste 1',
                url: 'Teste 1'
            }
        };
        response = {};

        error = {
            status: 500
        };

        list = [];
        load = {};

        categoryForm = {
            name: 'Teste 1',
            url: 'teste-1'
        };
    });

    describe('list', () => {
        it('deve listar as categorias', (done) => {
            promises.list.resolve(list);
            category.list(request, response);

            expect(category.categoryModel.list).toHaveBeenCalledWith(request.query);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, list);
                done();
            });
        });

        it('deve retorna um erro', (done) => {
            promises.list.reject(error);
            category.list(request, response);

            expect(category.categoryModel.list).toHaveBeenCalledWith(request.query);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('tree', () => {
        it('deve listar as categorias em arvore', (done) => {
            promises.tree.resolve(list);
            category.tree(request, response);

            expect(category.categoryModel.tree).toHaveBeenCalledWith(request.query);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, list);
                done();
            });
        });

        it('deve retorna um erro', (done) => {
            promises.tree.reject(error);
            category.tree(request, response);

            expect(category.categoryModel.tree).toHaveBeenCalledWith(request.query);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('load', () => {
        it('deve retorna uma categoria', (done) => {
            promises.load.resolve(load);
            category.load(request, response);

            expect(category.categoryModel.load).toHaveBeenCalledWith(request.params.id);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, load);
                done();
            });
        });

        it('deve retorna um erro', (done) => {
            promises.load.reject(error);
            category.load(request, response);

            expect(category.categoryModel.load).toHaveBeenCalledWith(request.params.id);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('create', () => {
        it('deve criar uma categoria', (done) => {
            promises.create.resolve();
            category.create(request, response);

            expect(category.categoryModel.create).toHaveBeenCalledWith(categoryForm);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, null, 201);
                done();
            });
        });

        it('deve retorna um erro', (done) => {
            promises.create.reject(error);
            category.create(request, response);

            expect(category.categoryModel.create).toHaveBeenCalledWith(categoryForm);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('update', () => {
        it('deve atualizar uma categoria', (done) => {
            promises.update.resolve();
            category.update(request, response);

            expect(category.categoryModel.update).toHaveBeenCalledWith(request.params.id, categoryForm);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, null, 204);
                done();
            });
        });

        it('atualizar sem a url, deve formata-la em slug', () => {
            request.body.url = null;
            category.update(request, response);
            expect(category.categoryModel.update).toHaveBeenCalledWith(request.params.id, categoryForm);
        });

        it('deve retorna um erro', (done) => {
            promises.update.reject(error);
            category.update(request, response);

            expect(category.categoryModel.update).toHaveBeenCalledWith(request.params.id, categoryForm);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

    describe('delete', () => {
        it('deve excluir uma categoria', (done) => {
            promises.delete.resolve();
            category.delete(request, response);

            expect(category.categoryModel.delete).toHaveBeenCalledWith(request.params.id);
            setTimeout(() => {
                expect(Http.success).toHaveBeenCalledWith(response, null, 204);
                done();
            });
        });

        it('deve retorna um erro', (done) => {
            promises.delete.reject(error);
            category.delete(request, response);

            expect(category.categoryModel.delete).toHaveBeenCalledWith(request.params.id);
            setTimeout(() => {
                expect(Mongo.errorMongo).toHaveBeenCalledWith(response, error);
                done();
            });
        });
    });

});