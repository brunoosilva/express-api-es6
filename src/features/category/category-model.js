import Mongo from '../../providers/mongo';
import Tree from '../../providers/tree';
import CategorySchema from './category-schema';

export default class CategoryModel {

    list(query){
        return Mongo.applyFilters(CategorySchema, query, ['_id', 'name', 'order', 'parent']);
    }

    tree(query){
        query.lean = true;
        let tree = new Tree();

        return this.list(query)
            .then((data) => tree.create(data))
            .then((data) => tree.sort(data, 'order', 'children'));
    }

    load(id){
        return CategorySchema.findOne({_id: id}).then(
            (data) => !data ? Promise.reject({name: 'CastError'}) : data);
    }

    create(categoryForm){
        return new CategorySchema(categoryForm).save();
    }

    update(id, categoryForm){
        return CategorySchema.findOneAndUpdate({_id: id}, {$set: categoryForm});
    }

    /* jshint ignore:start */
    async delete(id){
        const exist = await CategorySchema.findOne({_id: id});

        if(!exist){
            return Promise.reject({name: 'CastError'});
        } else {
            const count = await CategorySchema.find({parent: id}).count();

            if(count > 0){
                return Promise.reject({name: 'MongoError', code: 22000});
            }
        }

        return CategorySchema.findOneAndRemove({_id: id});
    }
    /* jshint ignore:end */
}