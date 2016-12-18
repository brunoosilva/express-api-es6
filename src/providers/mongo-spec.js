import Mongo from './mongo';
import Http from './http';

describe('Provider: Mongo', () => {
    let promises, response, errorObj, errorsStrategies;

    beforeEach(() => {
        promises = {
            find: function(){},
            lean: function(){},
            select: function(){},
            sort: function(){},
            limit: function(){},
            skip: function(){}
        };

        spyOn(promises, 'find').and.callFake(function(){ return promises; });
        spyOn(promises, 'lean').and.callFake(function(){ return promises; });
        spyOn(promises, 'select').and.callFake(function(){ return promises; });
        spyOn(promises, 'sort').and.callFake(function(){ return promises; });
        spyOn(promises, 'limit').and.callFake(function(){ return promises; });
        spyOn(promises, 'skip').and.callFake(function(){ return promises; });

        spyOn(Http, 'error');

        response = {};

        errorObj = {
            status: 500,
            message: 'Ocorreu um erro inesperado',
            messageOriginal: null,
            fields: null,
            trace: null
        };

        errorsStrategies = {
            'AuthenticationError': {
                name: 'AuthenticationError',
                message: 'Authentication error ...'
            },
            'CastError': {
                name: 'CastError',
                message: 'Cast error ...'
            },
            'ValidationError': {
                name: 'ValidationError',
                message: 'Validation error ...',
                errors: {
                    name: 'Obrigatorio'
                }
            },
            'MongoError': {
                name: 'MongoError',
                message: 'Mongo error ...'
            }
        };
    });

    describe('applyFilters', () => {
        it('rodar uma estratégia que não existe', () => {
            let apply = Mongo.applyFilters(promises, {teste: 'teste'});

            expect(apply).toEqual(promises);
        });

        describe('estratégia find', () => {
            it('deve filtrar pelo nome campos', () => {
                Mongo.applyFilters(promises, {filter: 'name:ven'});

                expect(promises.find).toHaveBeenCalled();
            });

            it('deve filtrar por varios campos', () => {
                Mongo.applyFilters(promises, {filter: 'name:ven,teste:a'});

                expect(promises.find).toHaveBeenCalled();
            });
        });

        describe('estratégia lean', () => {
            it('deve limitar dois campos', () => {
                Mongo.applyFilters(promises, {lean: true});

                expect(promises.lean).toHaveBeenCalled();
            });
        });

        describe('estratégia fields', () => {
            it('deve limitar dois campos', () => {
                Mongo.applyFilters(promises, {fields: 'name,url'});

                expect(promises.select).toHaveBeenCalledWith({name: true, url: true});
            });

            it('deve limitar um campo', () => {
                Mongo.applyFilters(promises, {fields: 'name'});

                expect(promises.select).toHaveBeenCalledWith({name: true});
            });
        });

        describe('estratégia sort', () => {
            it('deve ordernar por nome ASC e url DESC', () => {
                Mongo.applyFilters(promises, {sort: 'name:1,url:-1'});

                expect(promises.sort).toHaveBeenCalledWith({name: 1, url: -1});
            });

            it('deve ordernar somente por nome ASC', () => {
                Mongo.applyFilters(promises, {sort: 'name:1'});

                expect(promises.sort).toHaveBeenCalledWith({name: 1});
            });

            it('deve ignorar o filtro com dados invalidos', () => {
                Mongo.applyFilters(promises, {sort: 'name'});

                expect(promises.sort).toHaveBeenCalledWith({});
            });
        });

        describe('estratégia limit', () => {
            it('deve limitar os registro', () => {
                Mongo.applyFilters(promises, {limit: '10'});

                expect(promises.limit).toHaveBeenCalledWith(10);
            });
        });

        describe('estratégia page', () => {
            it('deve paginar os registros', () => {
                Mongo.applyFilters(promises, {page: '1'});

                expect(promises.skip).toHaveBeenCalledWith(0);
            });
        });
    });

    describe('errorMongo', () => {
        it('deve retornar um erro default, se não passar os parametros necessarios', () => {
            Mongo.errorMongo(response);

            expect(Http.error).toHaveBeenCalledWith(response, 'Ocorreu um erro inesperado', 500, null);
        });

        it('deve formatar erro de authenticationError', () => {
            let strategie = errorsStrategies['AuthenticationError'];
            Mongo.errorMongo(response, strategie);

            expect(Http.error).toHaveBeenCalledWith(response, 'Tente logar novamente', 401, null);
        });

        it('deve formatar erro de castError', () => {
            let strategie = errorsStrategies['CastError'];
            Mongo.errorMongo(response, strategie);

            expect(Http.error).toHaveBeenCalledWith(response, 'Registro não encontrado', 404, null);
        });

        it('deve formatar erro de ValidationError', () => {
            let strategie = errorsStrategies['ValidationError'];
            Mongo.errorMongo(response, strategie);

            expect(Http.error).toHaveBeenCalledWith(response, 'Parâmetros inválidos', 400, {name: 'Obrigatorio'});
        });

        it('deve retornar erro default com código inválido', () => {
            let strategie = errorsStrategies['MongoError'];

            strategie.code = 'teste';

            Mongo.errorMongo(response, strategie);

            expect(Http.error).toHaveBeenCalledWith(response, 'Erro interno', 500, null);
        });

        it('deve formatar erro de MongoError com código 11000', () => {
            let strategie = errorsStrategies['MongoError'];

            strategie.code = 11000;

            Mongo.errorMongo(response, strategie);

            expect(Http.error).toHaveBeenCalledWith(response, 'Já existe, tente outro', 409, null);
        });
    });
});