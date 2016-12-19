import jwt from 'jsonwebtoken';
import config from '../config';
import Http from './http';
import TokenModel from '../features/token/token-model';
import Permissions from '../permissions';

export class Authentication{

    constructor(){
        this.config = config;
        this.jwt = jwt;
        this.tokenModel = new TokenModel();
    }

    /* jshint ignore:start */
    async createToken(user){
        let userForm = {
            id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            type: user.type
        };

        const token = this.jwt.sign(userForm, config.jwt.secret, {expiresIn: config.jwt.expiresIn});

        const tokenForm = {
            email: user.email,
            type: user.type,
            token: token
        };

        const saveToken = await this.tokenModel.create(tokenForm);

        if(!saveToken){
            return Promise.reject({name: 'AuthenticationError'});
        }

        Object.assign(userForm, tokenForm);

        return Promise.resolve(userForm);
    }
    /* jshint ignore:end */

    deleteToken(token){
        return this.tokenModel.delete(token);
    }

    /* jshint ignore:start */
    async checkAuthAndPermission(permissions, request, response, next){
        try{
            await this._validToken(request);
        } catch (e){
            return Http.error(response, 'Precisa está logado', 401);
        }

        const userType = request.user.type;

        if(!this._checkPermissions(userType, permissions)){
            return Http.error(response, 'Acesso negado', 403);
        }

        next();
    }
    /* jshint ignore:end */

    _checkPermissions(userType, needPermissions){

        if(!userType && needPermissions){
            return false;
        }

        if(needPermissions.indexOf(Permissions.all) > -1){
            return true;
        }

        return needPermissions.indexOf(userType) > -1;
    }

    /* jshint ignore:start */
    async _validToken(request){
        const bearerToken = this._getToken(request.headers);

        if(!bearerToken){
            return Promise.reject(false);
        }

        const userInfo = await this.jwt.verify(bearerToken, this.config.jwt.secret);
        const hasToken = await this.tokenModel.load(bearerToken);

        if(!userInfo || !hasToken){
            return Promise.reject(false);
        }

        Object.assign(request, {
            user: userInfo,
            token: bearerToken
        });

        return Promise.resolve(true);
    }
    /* jshint ignore:end */

    _getToken(headers){
        const bearerHeader = headers.authorization;
        return bearerHeader && bearerHeader.indexOf(' ') > -1 ? bearerHeader.split(' ')[1] : null;
    }
}

export default new Authentication();
