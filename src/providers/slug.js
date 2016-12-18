import urlSlug from 'url-slug';

export default class Slug{

    create(url){
        return url ? urlSlug(url) : null;
    }
}