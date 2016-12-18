import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

class CategorySchema{
    constructor(){
        this.categorySchema = new mongoose.Schema({
            name: {
                type: String,
                required: 'Informe um nome para a categoria'
            },
            url: {
                type: String,
                lowercase: true,
                required: 'Informe uma url para a categoria',
                unique: 'Categoria já cadastrada'
            },
            parent: {
                type: String,
                lowercase: true,
                default: null
            },
            order: {
                type: Number,
                default: 0
            }
        });

        this.plugins();

        return mongoose.model('category', this.categorySchema);
    }

    plugins(){
        this.categorySchema.plugin(mongooseUniqueValidator);
    }
}

export default new CategorySchema();