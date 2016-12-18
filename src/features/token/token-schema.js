import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

class TokenSchema{
    constructor(){
        this.tokenSchema = new mongoose.Schema({
            email: {
                type: String,
                unique: 'Você já está logado',
                required: 'Informe um email'
            },
            type: {
                type: String,
                required: 'Informe de quem é o token',
                enum: {
                    values: ['admin', 'teacher', 'editor', 'student'],
                    message: 'Tipo inválido'
                }
            },
            token: {
                type: String,
                required: 'Informe o token'
            },
            createdAt: {
                type: Date,
                default: Date.now,
                expires: '8h'
            }
        });

        this.plugins();

        return mongoose.model('token', this.tokenSchema);
    }

    plugins(){
        this.tokenSchema.plugin(mongooseUniqueValidator);
    }
}

export default new TokenSchema();