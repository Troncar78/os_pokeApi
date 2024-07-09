import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import getBestPokemonByStatsInLocation from '../src/getBestPokemonByStatsInLocation';

const mock = new MockAdapter(axios);

describe('getBestPokemonByStatsInLocation()', () => {
    afterEach(() => {
        mock.reset();
    });

    it('should return an empty object if the location is not found', async () => {
        mock.onGet('https://pokeapi.co/api/v2/location/unknownLocation').reply(404);

        const result = await getBestPokemonByStatsInLocation('unknownLocation');
        expect(result).toEqual({});
    });

    it('should return the best Pokémon by stats for a valid location', async () => {
        const mockLocationData = {
            areas: [
                { url: 'https://pokeapi.co/api/v2/location-area/1/' },
                { url: 'https://pokeapi.co/api/v2/location-area/2/' }
            ]
        };

        const mockAreaData1 = {
            pokemon_encounters: [
                { pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/1/' } },
                { pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/2/' } }
            ]
        };

        const mockAreaData2 = {
            pokemon_encounters: [
                { pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/3/' } }
            ]
        };

        const mockPokemonData1 = {
            name: 'bulbasaur',
            stats: [
                { stat: { name: 'attack' }, base_stat: 49 },
                { stat: { name: 'defense' }, base_stat: 49 },
                { stat: { name: 'special-attack' }, base_stat: 65 },
                { stat: { name: 'special-defense' }, base_stat: 65 },
                { stat: { name: 'speed' }, base_stat: 45 }
            ]
        };

        const mockPokemonData2 = {
            name: 'ivysaur',
            stats: [
                { stat: { name: 'attack' }, base_stat: 62 },
                { stat: { name: 'defense' }, base_stat: 63 },
                { stat: { name: 'special-attack' }, base_stat: 80 },
                { stat: { name: 'special-defense' }, base_stat: 80 },
                { stat: { name: 'speed' }, base_stat: 60 }
            ]
        };

        const mockPokemonData3 = {
            name: 'venusaur',
            stats: [
                { stat: { name: 'attack' }, base_stat: 82 },
                { stat: { name: 'defense' }, base_stat: 83 },
                { stat: { name: 'special-attack' }, base_stat: 100 },
                { stat: { name: 'special-defense' }, base_stat: 100 },
                { stat: { name: 'speed' }, base_stat: 80 }
            ]
        };

        mock.onGet('https://pokeapi.co/api/v2/location/viridian-forest').reply(200, mockLocationData);
        mock.onGet('https://pokeapi.co/api/v2/location-area/1/').reply(200, mockAreaData1);
        mock.onGet('https://pokeapi.co/api/v2/location-area/2/').reply(200, mockAreaData2);
        mock.onGet('https://pokeapi.co/api/v2/pokemon/1/').reply(200, mockPokemonData1);
        mock.onGet('https://pokeapi.co/api/v2/pokemon/2/').reply(200, mockPokemonData2);
        mock.onGet('https://pokeapi.co/api/v2/pokemon/3/').reply(200, mockPokemonData3);

        const result = await getBestPokemonByStatsInLocation('viridian-forest');
        expect(result).toEqual({
            attack: { name: 'venusaur', value: 82 },
            defense: { name: 'venusaur', value: 83 },
            'special-attack': { name: 'venusaur', value: 100 },
            'special-defense': { name: 'venusaur', value: 100 },
            speed: { name: 'venusaur', value: 80 }
        });
    });

    it('should handle errors during fetch', async () => {
        console.error = jest.fn(); // Mock console.error to suppress error output during test

        mock.onGet('https://pokeapi.co/api/v2/location/pewter-city').networkError();

        const result = await getBestPokemonByStatsInLocation('pewter-city');
        expect(result).toEqual({});

        console.error.mockRestore(); // Restore console.error after test
    });
});
