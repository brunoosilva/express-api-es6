import Http from './http';
import Log from './log';

class Mongo {

    constructor(){
        this.log = new Log();
        const mongo = this;

        this.strategies = {
            filter: {
                create: function(promise, query){
                    return promise.find(this._parameter(query));
                },
                _parameter: function(query, rulesFilter){
                    const filter = query.filter;

                    if(filter === true){
                        return {};
                    }

                    let fields = filter.indexOf(',') > -1 ? filter.split(',') : [ filter ];

                    let listFilters = {};
                    fields.map((field) => {
                        if(field.indexOf(':') > -1){
                            const [key, value] = field.split(':');

                            if(rulesFilter && rulesFilter.indexOf(key) > -1){
                                listFilters[key] = !isNaN(value) ? value : { $regex: `.*${value}.*`, $options: 'i'};
                            }
                        }
                    });

                    return listFilters;
                }
            },
            lean: {
                create: function (promise) {
                    return promise.lean();
                }
            },
            fields: {
                create: function (promise, query) {
                    return promise.select(this._parameter(query));
                },
                _parameter: function(query) {
                    const fields = query.fields;
                    let select = fields.indexOf(',') > -1 ? fields.split(',') : [ fields ];

                    let listSelect = {};
                    select.map((item) => {
                        listSelect[item] = true;
                    });

                    return listSelect;
                }
            },
            sort: {
                create: function (promise, query) {
                    return promise.sort(this._parameter(query));
                },
                _parameter: function(query) {
                    const sort = query.sort;
                    let fields = sort.indexOf(',') > -1 ? sort.split(',') : [ sort ];

                    let listFields = {};
                    fields.map((field) => {
                        if(field.indexOf(':') > -1){
                            let aux = field.split(':');
                            listFields[aux[0]] = parseInt(aux[1]);
                        }
                    });

                    return listFields;
                }
            },
            limit: {
                create: function (promise, query) {
                    return promise.limit(this._parameter(query));
                },
                _parameter: function(query) {
                    return parseInt(query.limit) || 100;
                }
            },
            page: {
                create: function (promise, query) {
                    return promise.skip(this._parameter(query));
                },
                _parameter: function(query) {
                    const limit = mongo.strategies.limit._parameter(query);
                    const page = parseInt(query.page) - 1;
                    return limit * page;
                }
            }
        };

        this.errorsStrategies = {
            'AuthenticationError': function(error){
                return mongo._createErrorObject(401, 'Tente logar novamente', error.message, null, error);
            },
            'CastError': function(error){
                return mongo._createErrorObject(404, 'Registro não encontrado', error.message, null, error);
            },
            'ValidationError': function(error){
                return mongo._createErrorObject(400, 'Parâmetros inválidos', error.message, error.errors, error);
            },
            'MongoError': function(error){
                const errorCode = {
                    '11000': {
                        status: 409,
                        message: 'Já existe, tente outro'
                    },
                    '22000': {
                        status: 409,
                        message: 'Existe registro vinculado, desvincule primeiro'
                    }
                };

                let status = 500;
                let message = 'Erro interno';
                const errorDetail = errorCode[error.code];
                if(errorDetail){
                    status = errorDetail.status;
                    message = errorDetail.message;
                }

                return mongo._createErrorObject(status, message, error.message, null, error);
            }
        };
    }

    applyFilters(promise, query, rulesFilter) {
        if(!query.hasOwnProperty('filter') || !query.filter){
            query.filter = true;
        }

        Object.keys(query)
            .sort(key => (key === 'filter') ? 0 : 1 )
            .map(key => {
                let strategie = this.strategies[key];

                if(strategie && query[key]){
                    promise = strategie.create(promise, query, rulesFilter);
                }
            });

        return promise;
    }

    errorMongo(response, error){
        let errorStrategie = this._createErrorObject();

        if(error){
            if(this.errorsStrategies[error.name]){
                errorStrategie = this.errorsStrategies[error.name](error);

                if(/^(5)/.test(errorStrategie.status) || errorStrategie.trace){
                    this.log.error(errorStrategie);
                }
            } else {
                this.log.error(error);
            }
        }

        return Http.error(response, errorStrategie.message, errorStrategie.status, errorStrategie.fields);
    }

    _createErrorObject(status, message, messageOriginal, fields, trace){
        return {
            status: status || 500,
            message: message || 'Ocorreu um erro inesperado',
            messageOriginal: messageOriginal || null,
            fields: fields || null,
            trace: trace || null
        };
    }
}

export default new Mongo();