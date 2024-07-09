import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import getTopPokemonByStatGrouped from '../src/pokemonStatRanking.js';

const mock = new MockAdapter(axios);

// Mock data
const mockAllPokemonData = {
    results: [
        { url: 'https://pokeapi.co/api/v2/pokemon/4/' },  // Charmander
        { url: 'https://pokeapi.co/api/v2/pokemon/7/' }   // Squirtle
        // Add more Pokémon URLs as needed
    ]
};

const mockPokemonDataCharmander = {
    name: 'charmander',
    stats: [
        { base_stat: 39, stat: { name: 'hp' } },
        { base_stat: 52, stat: { name: 'attack' } },
        { base_stat: 43, stat: { name: 'defense' } },
        { base_stat: 60, stat: { name: 'special-attack' } },
        { base_stat: 50, stat: { name: 'special-defense' } },
        { base_stat: 65, stat: { name: 'speed' } }
    ]
};

const mockPokemonDataSquirtle = {
    name: 'squirtle',
    stats: [
        { base_stat: 44, stat: { name: 'hp' } },
        { base_stat: 48, stat: { name: 'attack' } },
        { base_stat: 65, stat: { name: 'defense' } },
        { base_stat: 50, stat: { name: 'special-attack' } },
        { base_stat: 64, stat: { name: 'special-defense' } },
        { base_stat: 43, stat: { name: 'speed' } }
    ]
};

describe('getTopPokemonByStatGrouped', () => {
    beforeEach(() => {
        mock.reset();
    });

    it('should return top Pokémon by attack stat in JSON format', async () => {
        // Mock API responses
        mock.onGet('https://pokeapi.co/api/v2/pokemon?limit=1000').reply(200, mockAllPokemonData);
        mock.onGet('https://pokeapi.co/api/v2/pokemon/4/').reply(200, mockPokemonDataCharmander);
        mock.onGet('https://pokeapi.co/api/v2/pokemon/7/').reply(200, mockPokemonDataSquirtle);

        const stat = 'attack';
        const topN = 2;

        const result = await getTopPokemonByStatGrouped(stat, topN);

        const expectedOutput = JSON.stringify([
            { name: 'charmander', statValue: 52 },
            { name: 'squirtle', statValue: 48 }
        ], null, 2);

        expect(result).toBe(expectedOutput);
    });

    it('should handle API errors gracefully', async () => {
        // Mock API error response with statusText
        mock.onGet('https://pokeapi.co/api/v2/pokemon?limit=1000').reply(500, { message: "Internal Server Error" }, { statusText: "Internal Server Error" });

        const stat = 'attack';
        const topN = 2;

        await expect(getTopPokemonByStatGrouped(stat, topN)).rejects.toThrow('Error fetching data: Internal Server Error');
    });
});
