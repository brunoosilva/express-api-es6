import {Router} from 'express';
import Permissions from '../../permissions';
import Http from '../../providers/http';
import Mongo from '../../providers/mongo';
import Authentication from '../../providers/authentication';
import Slug from '../../providers/slug';
import CategoryModel from './category-model';

export default class CategoryController {

    constructor() {
        this.router = Router();
        this.baseUrl = '/categories';
        this.categoryModel = new CategoryModel();
    }

    routes(){
        this.router.get(
            `${this.baseUrl}`,
            this.list.bind(this)
        );

        this.router.get(
            `${this.baseUrl}/tree`,
            Authentication.checkAuthAndPermission.bind(
                Authentication, [Permissions.all]
            ),
            this.tree.bind(this)
        );

        this.router.get(
            `${this.baseUrl}/:id`,
            Authentication.checkAuthAndPermission.bind(
                Authentication, [Permissions.all]
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

        return this.router;
    }

    list(request, response) {
        this.categoryModel.list(request.query).then(
            data => Http.success(response, data),
            error => Mongo.errorMongo(response, error)
        );
    }

    tree(request, response){
        this.categoryModel.tree(request.query).then(
            data => Http.success(response, data),
            error => Mongo.errorMongo(response, error)
        );
    }

    load(request, response) {
        const categoryId = request.params.id;

        this.categoryModel.load(categoryId).then(
            data => Http.success(response, data),
            error => Mongo.errorMongo(response, error)
        );
    }

    create(request, response) {
        const categoryForm = this._convertToCategory(request.body);

        this.categoryModel.create(categoryForm).then(
            () => Http.success(response, null, 201),
            error => Mongo.errorMongo(response, error)
        );
    }

    update(request, response) {
        const categoryId = request.params.id;
        const categoryForm = this._convertToCategory(request.body);

        this.categoryModel.update(categoryId, categoryForm).then(
            () => Http.success(response, null, 204),
            error => Mongo.errorMongo(response, error)
        );
    }

    delete(request, response) {
        const categoryId = request.params.id;

        this.categoryModel.delete(categoryId).then(
            () => Http.success(response, null, 204),
            error => Mongo.errorMongo(response, error)
        );
    }

    _convertToCategory(categoryForm){
        if(!categoryForm){
            return;
        }

        if(!categoryForm.url){
            categoryForm.url = categoryForm.name;
        }

        categoryForm.url = new Slug().create(categoryForm.url);

        return categoryForm;
    }
}
