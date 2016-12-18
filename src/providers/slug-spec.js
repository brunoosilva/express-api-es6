import Slug from './slug';

describe('Provider: Slug', () => {

    it('deve criar o slug a partir da url', () => {
        let slug = new Slug();
        let url = slug.create('Teste de slug');

        expect(url).toEqual('teste-de-slug');
    });

    it('deve retornar null se passar parametro null', () => {
        let slug = new Slug();
        let url = slug.create(null);

        expect(url).toBe(null);
    });
});