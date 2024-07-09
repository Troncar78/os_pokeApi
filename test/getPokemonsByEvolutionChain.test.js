import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import getEvolutionDetails from '../src/getPokemonsByEvolutionChain';

const mock = new MockAdapter(axios);

describe('getEvolutionDetails()', () => {
    afterEach(() => {
        mock.reset();
    });

    it('should return an empty array if the Pokémon is not found', async () => {
        mock.onGet('https://pokeapi.co/api/v2/pokemon/unknownPokemon').reply(404);

        const result = await getEvolutionDetails('unknownPokemon');
        expect(result).toEqual([]);
    });

    it('should return the evolution details for a valid Pokémon', async () => {
        const mockPokemonData = {
            species: { url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
        };

        const mockSpeciesData = {
            evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
        };

        const mockEvolutionChainData = {
            chain: {
                species: { name: 'bulbasaur' },
                evolves_to: [
                    {
                        species: { name: 'ivysaur' },
                        evolution_details: [{ trigger: { name: 'level-up' }, min_level: 16 }],
                        evolves_to: [
                            {
                                species: { name: 'venusaur' },
                                evolution_details: [{ trigger: { name: 'level-up' }, min_level: 32 }],
                                evolves_to: [],
                            },
                        ],
                    },
                ],
            },
        };

        mock.onGet('https://pokeapi.co/api/v2/pokemon/bulbasaur').reply(200, mockPokemonData);
        mock.onGet('https://pokeapi.co/api/v2/pokemon-species/1/').reply(200, mockSpeciesData);
        mock.onGet('https://pokeapi.co/api/v2/evolution-chain/1/').reply(200, mockEvolutionChainData);

        const result = await getEvolutionDetails('bulbasaur');
        expect(result).toEqual([
            { speciesName: 'bulbasaur' },
            { evolve_to: 'ivysaur', trigger: 'level-up', minLevel: 16 },
            { evolve_to: 'venusaur', trigger: 'level-up', minLevel: 32 },
        ]);
    });

    it('should handle missing min_level with min_happiness and time_of_day', async () => {
        const mockPokemonData = {
            species: { url: 'https://pokeapi.co/api/v2/pokemon-species/133/' },
        };

        const mockSpeciesData = {
            evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/133/' },
        };

        const mockEvolutionChainData = {
            chain: {
                species: { name: 'eevee' },
                evolves_to: [
                    {
                        species: { name: 'espeon' },
                        evolution_details: [{ trigger: { name: 'level-up' }, min_happiness: 220, time_of_day: 'day' }],
                        evolves_to: [],
                    },
                ],
            },
        };

        mock.onGet('https://pokeapi.co/api/v2/pokemon/eevee').reply(200, mockPokemonData);
        mock.onGet('https://pokeapi.co/api/v2/pokemon-species/133/').reply(200, mockSpeciesData);
        mock.onGet('https://pokeapi.co/api/v2/evolution-chain/133/').reply(200, mockEvolutionChainData);

        const result = await getEvolutionDetails('eevee');
        expect(result).toEqual([
            { speciesName: 'eevee' },
            { evolve_to: 'espeon', trigger: 'level-up', minHappiness: 220, timeOfDay: 'day' },
        ]);
    });

    it('should handle errors during fetch', async () => {
        console.error = jest.fn(); // Mock console.error to suppress error output during test

        mock.onGet('https://pokeapi.co/api/v2/pokemon/pikachu').networkError();

        const result = await getEvolutionDetails('pikachu');
        expect(result).toEqual([]);
        expect(console.error).toHaveBeenCalledWith(expect.any(Error));

        console.error.mockRestore(); // Restore console.error after test
    });
});
