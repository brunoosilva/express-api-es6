import q from 'q';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import config from './config';

class TestUtils{

    constructor(){
        this.tokens = {
            admin: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsIm5hbWUiOiJVc2VyIEFkbWluIiwiZW1haWwiOiJhZG1pbkB0ZXN0ZS5jb20iLCJwaG90byI6ImFkbWluIiwidHlwZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsiYWRtaW4iXSwiaWF0IjoxNDgxMjI2ODg2fQ.NPFIuKkxY49nCICrtoOcpOGIrPcyqqQOe4aojgITi4A'
        };
    }

    modelSpy(model){
        let methods = this.getAllMethods(model);
        let promises = {};

        methods.map((method) => {
            promises[method] = q.defer();
            spyOn(model, method).and.returnValue(promises[method].promise);
        });

        return promises;
    }

    getAllMethods(classObj){
        let methods = [];

        do {

            const listMethods = Object.getOwnPropertyNames(classObj)
                .concat(Object.getOwnPropertySymbols(classObj).map(method => method.toString()))
                .sort()
                .filter((method, index, list) =>
                    typeof classObj[method] === 'function'      && //only the methods
                    method !== 'constructor'                    && //not the constructor
                    (index === 0 || method !== list[index - 1]) && //not overriding in this prototype
                    methods.indexOf(method) === -1                 //not overridden in a child
                );

            methods = methods.concat(listMethods);

        } while (classObj = Object.getPrototypeOf(classObj) && Object.getPrototypeOf(classObj));

        return methods;
    }

    createToken(user){
        return jwt.sign(user, config.jwt.secret, { expiresIn: config.expiresIn });
    }

    requestApi(path){
        return supertest(`http://localhost:${config.port}/${path}`);
    }

    endTest(done, err){
        if(err){
            done.fail(err);
        } else {
            done();
        }
    }
}

export default new TestUtils();
