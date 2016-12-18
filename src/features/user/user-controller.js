import {Router} from 'express';
import Permissions from '../../permissions';
import Http from '../../providers/http';
import Mongo from '../../providers/mongo';
import Authentication from '../../providers/authentication';
import UserModel from './user-model';

export default class UserController {

    constructor() {
        this.router = Router();
        this.baseUrl = '/users';
        this.userModel = new UserModel();
    }

    routes(){
        this.router.get(
            `${this.baseUrl}`,
            Authentication.checkAuthAndPermission.bind(
                Authentication, [Permissions.admin]
            ),
            this.list.bind(this)
        );

        this.router.get(
            `${this.baseUrl}/:id`,
            Authentication.checkAuthAndPermission.bind(
                Authentication, [Permissions.admin]
            ),
            this.load.bind(this)
        );

        this.router.post(
            `${this.baseUrl}`,
            Authentication.checkAuthAndPermission.bind(
                Authentication, [Permissions.admin]
            ),
            this.create.bind(this)
        );

        this.router.put(
            `${this.baseUrl}/:id`,
            Authentication.checkAuthAndPermission.bind(
                Authentication, [Permissions.admin]
            ),
            this.update.bind(this)
        );

        this.router.delete(
            `${this.baseUrl}/:id`,
            Authentication.checkAuthAndPermission.bind(
                Authentication, [Permissions.admin]
            ),
            this.delete.bind(this)
        );

        this.router.post(
            `${this.baseUrl}/loginGoogle`,
            this.loginGoogle.bind(this)
        );

        this.router.post(
            `${this.baseUrl}/logout`,
            Authentication.checkAuthAndPermission.bind(
                Authentication, [Permissions.all]
            ),
            this.logout.bind(this)
        );

        return this.router;
    }

    list(request, response) {
        this.userModel.list(request.query).then(
            data => Http.success(response, data),
            error => Mongo.errorMongo(response, error)
        );
    }

    load(request, response) {
        const userId = request.params.id;

        this.userModel.load(userId).then(
            data => Http.success(response, data),
            error => Mongo.errorMongo(response, error)
        );
    }

    create(request, response) {
        const userForm = request.body;

        this.userModel.create(userForm).then(
            () => Http.success(response, null, 201),
            error => Mongo.errorMongo(response, error)
        );
    }

    update(request, response) {
        const userId = request.params.id;
        const userForm = request.body;

        this.userModel.update(userId, userForm).then(
            () => Http.success(response, null, 204),
            error => Mongo.errorMongo(response, error)
        );
    }

    delete(request, response) {
        const userId = request.params.id;

        this.userModel.delete(userId).then(
            () => Http.success(response, null, 204),
            error => Mongo.errorMongo(response, error)
        );
    }

    loginGoogle(request, response){
        const userFormLogin = request.body;

        if(!userFormLogin.email){
            return Http.error(response, 'Tente se logar novamente');
        }

        this.userModel.loginGoogle(userFormLogin).then(
            data => Http.success(response, data),
            error => Mongo.errorMongo(response, error)
        );
    }

    logout(request, response){
        this.userModel.logout(request.token).then(
            () => Http.success(response, null, 204),
            error => Mongo.errorMongo(response, error)
        );
    }
}
