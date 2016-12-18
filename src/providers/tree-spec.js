import Tree from './tree';

describe('Provider: Tree', () => {
    let tree, list;

    beforeEach(() => {
        tree = new Tree();

        list = [
            {
                _id: 1,
                name: 'Teste',
                parent: null,
                order: 3
            },
            {
                _id: 2,
                name: 'Teste 2',
                parent: null,
                order: 2
            },
            {
                _id: 3,
                name: 'Teste 3',
                parent: 1,
                order: 1
            },
            {
                _id: 4,
                name: 'Teste 4',
                parent: 1,
                order: 0
            }
        ];
    });

    it('verifica se retorna da forma correta', () => {
        let result = tree.create(list);

        expect(result).toEqual([
            {
                _id: 1,
                name: 'Teste',
                parent: null,
                order: 3,
                children: [
                    {
                        _id: 3,
                        name: 'Teste 3',
                        parent: 1,
                        order: 1
                    },
                    {
                        _id: 4,
                        name: 'Teste 4',
                        parent: 1,
                        order: 0
                    }
                ]
            },
            {
                _id: 2,
                name: 'Teste 2',
                parent: null,
                order: 2
            }
        ]);
    });

    it('verifica se retorna os valores na ordem correta', () => {
        let result = tree.sort(list, 'order');

        expect(result).toEqual([
            {
                _id: 4,
                name: 'Teste 4',
                parent: 1,
                order: 0
            },
            {
                _id: 3,
                name: 'Teste 3',
                parent: 1,
                order: 1
            },
            {
                _id: 2,
                name: 'Teste 2',
                parent: null,
                order: 2
            },
            {
                _id: 1,
                name: 'Teste',
                parent: null,
                order: 3
            }
        ]);
    });

    it('verifica se retorna os valores na ordem correta com tree', () => {
        let result = tree.create(list);
        let sort = tree.sort(result, 'order', 'children');

        expect(sort).toEqual([
            {
                _id: 2,
                name: 'Teste 2',
                parent: null,
                order: 2
            },
            {
                _id: 1,
                name: 'Teste',
                parent: null,
                order: 3,
                children: [
                    {
                        _id: 4,
                        name: 'Teste 4',
                        parent: 1,
                        order: 0
                    },
                    {
                        _id: 3,
                        name: 'Teste 3',
                        parent: 1,
                        order: 1
                    }
                ]
            }
        ]);
    });
});