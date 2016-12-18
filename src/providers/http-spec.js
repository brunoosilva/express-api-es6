import Http from './http';

describe('Provider: Http', () => {
    let response, errorObj;

    beforeEach(() => {
        response = {
            status: function(){ return this; },
            json: function(){ return this; },
            send: function(){ return this; }
        };

        errorObj = {
            status: 500,
            message: 'Ocorreu um erro inesperado',
            fields: undefined
        };

        spyOn(response, 'status').and.callFake(function(){ return this; });
        spyOn(response, 'json').and.callFake(function(){ return this; });
        spyOn(response, 'send').and.callFake(function(){ return this; });
    });

    describe('success', () => {
        it('deve retornar successo com json', () => {
            let json = {name: 'teste'};
            Http.success(response, json);

            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(json);
        });

        it('deve retornar successo sem json', () => {
            Http.success(response, 'teste');

            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.send).toHaveBeenCalledWith('teste');
        });

        it('deve retornar successo status diferente', () => {
            Http.success(response, 'teste', 204);

            expect(response.status).toHaveBeenCalledWith(204);
            expect(response.send).toHaveBeenCalledWith('teste');
        });
    });

    describe('error', () => {
        it('deve retornar um erro default', () => {
            Http.error(response);

            errorObj.status = 400;

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith(errorObj);
        });

        it('deve retornar um erro default passando tudo null', () => {
            Http.error(response, null, null);

            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith(errorObj);
        });

        it('deve retornar um erro 404', () => {
            Http.error(response, 'Nada encontrado', 404);

            errorObj.status = 404;
            errorObj.message = 'Nada encontrado';

            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith(errorObj);
        });
    });


});