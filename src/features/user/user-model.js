import Mongo from '../../providers/mongo';
import Authentication from '../../providers/authentication';
import UserSchema from './user-schema';

export default class UserModel {

    list(query){
        return Mongo.applyFilters(UserSchema.find(), query);
    }

    load(id){
        return UserSchema.findOne({_id: id}).then(
            (data) => !data ? Promise.reject({name: 'CastError'}) : data);
    }

    create(userForm){
        return new UserSchema(userForm).save();
    }

    update(id, userForm){
        return UserSchema.findOneAndUpdate({_id: id}, {$set: userForm});
    }

    /* jshint ignore:start */
    async delete(id){
        const exist = await UserSchema.findOne({_id: id});

        if(!exist){
            return Promise.reject({name: 'CastError'});
        }

        return UserSchema.findOneAndRemove({_id: id});
    }

    async loginGoogle(userFormLogin){
        const userInfo = await UserSchema.findOneAndUpdate(
            {email: userFormLogin.email },
            {$set: userFormLogin},
            {upsert: true, 'new': true}
        );


        if(!userInfo){
            return Promise.reject({name: 'CastError'});
        }

        return Authentication.createToken(userInfo);
    }
    /* jshint ignore:end */

    logout(token){
        return Authentication.deleteToken(token);
    }
}
