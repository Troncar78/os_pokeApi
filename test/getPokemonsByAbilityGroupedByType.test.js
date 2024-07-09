import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import getPokemonsByAbilityGroupedByType from '../src/getPokemonsByAbilityGroupedByType';

const mock = new MockAdapter(axios);

describe('getPokemonsByAbilityGroupedByType()', () => {
    afterEach(() => {
        mock.reset();
    });

    it('should return an empty object if the ability is not found', async () => {
        mock.onGet('https://pokeapi.co/api/v2/move/unknownAbility').reply(404);

        const result = await getPokemonsByAbilityGroupedByType('unknownAbility');
        expect(result).toEqual({});
    });

    it('should group Pokémon by type for a valid ability', async () => {
        const mockAbilityData = {
            learned_by_pokemon: [
                { url: 'https://pokeapi.co/api/v2/pokemon/1/' },
                { url: 'https://pokeapi.co/api/v2/pokemon/2/' }
            ]
        };

        const mockPokemonData1 = {
            name: 'bulbasaur',
            types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }]
        };

        const mockPokemonData2 = {
            name: 'ivysaur',
            types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }]
        };

        mock.onGet('https://pokeapi.co/api/v2/move/someAbility').reply(200, mockAbilityData);
        mock.onGet('https://pokeapi.co/api/v2/pokemon/1/').reply(200, mockPokemonData1);
        mock.onGet('https://pokeapi.co/api/v2/pokemon/2/').reply(200, mockPokemonData2);

        const result = await getPokemonsByAbilityGroupedByType('someAbility');
        expect(result).toEqual({
            grass: ['bulbasaur', 'ivysaur'],
            poison: ['bulbasaur', 'ivysaur'],
        });
    });

    it('should handle errors during fetch', async () => {
        console.error = jest.fn(); // Mock console.error to suppress error output during test

        mock.onGet('https://pokeapi.co/api/v2/move/thunder').networkError();

        const result = await getPokemonsByAbilityGroupedByType('thunder');
        expect(result).toEqual({});

        console.error.mockRestore(); // Restore console.error after test
    });
});
