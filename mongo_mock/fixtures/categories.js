var id = require('pow-mongodb-fixtures').createObjectId;

exports.categories = [
    {
        _id: id('200000000000000000000001'),
        name: 'Financeiro',
        url: 'financeiro',
        order: 1,
        parent: null
    },
    {
        _id: id('200000000000000000000002'),
        name: 'Vendas',
        url: 'vendas',
        order: 2,
        parent: null
    }
];
