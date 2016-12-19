import q from 'q';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import config from './config';

class TestUtils{

    constructor(){
        this.tokens = {
            admin: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCIsIm5hbWUiOiJCcnVubyIsImVtYWlsIjoiYnJ1bm8uc2lsdmFAdGVzdGUuY29tLmJyIiwicGhvdG8iOiJodHRwczovL3MzLmFtYXpvbmF3cy5jb20vIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNDgyMTQzOTk2LCJleHAiOjE1MTM2Nzk5OTZ9.GNG9bPY-vOHqTPbM4GAjt7-MdrZr9oY_ePWK4x3wm0A'
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
