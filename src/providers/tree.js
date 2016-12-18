export default class Tree{

    create(data, keyParent = 'parent', keyReference = '_id', parent = null) {
        let tree = [];

        if(!parent){
            parent = {[keyReference]: null};
        }

        let children = data.filter((child) => String(child[keyParent]) === String(parent[keyReference]));

        if(children.length > 0){
            if(parent[keyReference] === null){
                tree = children;
            } else {
                parent.children = children;
            }

            children.map((child) => this.create(data, keyParent, keyReference, child));
        }

        return tree;
    }

    sort(data, key, keyChildren = null) {
        let sort = data.sort((previous, next) => previous[key] < next[key] ? -1: 1);

        if(keyChildren){
            sort.map((item) => (item[keyChildren]) ? item[keyChildren] = this.sort(item[keyChildren], key, keyChildren) : null);
        }

        return sort;
    }
}