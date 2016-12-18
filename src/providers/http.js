class Http{

    success(response, data, statusCode = 200) {
        if(typeof data === 'object'){
            return response.status(statusCode).json(data);
        } else {
            return response.status(statusCode).send(data);
        }
    }

    error(response, message, statusCode = 400, fields = undefined){
        const errorObject = this._createErrorObject(statusCode, message, fields);
        return response.status(errorObject.status).json(errorObject);
    }

    _createErrorObject(status, message, fields){
        return {
            status: status || 500,
            message: message || 'Ocorreu um erro inesperado',
            fields: fields
        };
    }
}

export default new Http();