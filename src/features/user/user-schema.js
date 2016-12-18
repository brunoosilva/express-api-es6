import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import config from '../../config';

class UserSchema{
    constructor(){
        this.userSchema = new mongoose.Schema({
            name: {
                type: String,
                required: 'Informe o nome'
            },
            email: {
                type: String,
                trim: true,
                lowercase: true,
                required: 'Informe o email',
                unique: 'Email já utilizado',
                validate: [(email) => config.matchs.email.test(email), 'Email inválido'],
                match: [config.matchs.email, 'Email inválido']
            },
            photo: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                required: 'Informe o tipo de usuário',
                default: 'admin',
                enum: {
                    values: ['admin', 'user'],
                    message: 'Tipos inválidos'
                }
            },
            status: {
                type: String,
                default: 'waiting',
                required: 'Informe o status',
                enum: {
                    values: ['disable', 'waiting', 'enable'],
                    message: 'Status inválido'
                }
            },
            office: {
                type: String,
                required: 'Informe o cargo'
            },
            description: {
                type: String
            },
            facebookUrl: {
                type: String
            },
            twitterUrl: {
                type: String
            },
            googlePlusUrl: {
                type: String
            },
            linkedInUrl: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        });

        this.plugins();

        return mongoose.model('user', this.userSchema);
    }

    plugins(){
        this.userSchema.plugin(mongooseUniqueValidator);
    }
}

export default new UserSchema();
