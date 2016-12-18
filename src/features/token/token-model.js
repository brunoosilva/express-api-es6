import TokenSchema from './token-schema';

export default class TokenModel {

    load(token){
        return TokenSchema.findOne({token: token});
    }

    create(tokenForm){
        return new TokenSchema(tokenForm).save();
    }

    delete(token){
        return TokenSchema.findOneAndRemove({token: token});
    }
}