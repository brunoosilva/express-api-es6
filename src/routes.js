import CategoryController from './features/category/category-controller';
import userController from './features/user/user-controller';

export default [
    new CategoryController().routes(),
    new userController().routes()
];
