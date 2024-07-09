import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import  getDetailedPokemonData  from '../src/detailledPokemon.js';

const mock = new MockAdapter(axios);

// Mock data
const mockPokemonData = {
    name: 'charmander',
    id: 4,
    height: 6,
    weight: 85,
    species: { url: 'https://pokeapi.co/api/v2/pokemon-species/4/' },
    abilities: [{ ability: { url: 'https://pokeapi.co/api/v2/ability/65/' } }],
    types: [{ type: { name: 'fire' } }],
    stats: [{ base_stat: 39, stat: { name: 'hp' } }],
    moves: [{ move: { url: 'https://pokeapi.co/api/v2/move/52/' } }]
};

const mockSpeciesData = {
    name: 'charmander',
    evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/2/' }
};

const mockAbilityData = {
    name: 'blaze',
    effect_entries: [{ effect: 'Powers up Fire-type moves when the Pokémon is in trouble.', language: { name: 'en' } }]
};

const mockMoveData = {
    name: 'ember',
    power: 40,
    accuracy: 100,
    type: { name: 'fire' },
    damage_class: { name: 'special' }
};

const mockEvolutionChainData = {
    chain: {
        species: { name: 'charmander' },
        evolves_to: [
            {
                species: { name: 'charmeleon' },
                evolution_details: [{ min_level: 16 }],
                evolves_to: [
                    {
                        species: { name: 'charizard' },
                        evolution_details: [{ min_level: 36 }],
                        evolves_to: []
                    }
                ]
            }
        ]
    }
};

describe('getDetailedPokemonData', () => {
    beforeEach(() => {
        mock.reset();
    });

    it('should fetch detailed Pokémon data', async () => {
        // Mock the API responses
        mock.onGet('https://pokeapi.co/api/v2/pokemon/charmander').reply(200, mockPokemonData);
        mock.onGet('https://pokeapi.co/api/v2/pokemon-species/4/').reply(200, mockSpeciesData);
        mock.onGet('https://pokeapi.co/api/v2/ability/65/').reply(200, mockAbilityData);
        mock.onGet('https://pokeapi.co/api/v2/move/52/').reply(200, mockMoveData);
        mock.onGet('https://pokeapi.co/api/v2/evolution-chain/2/').reply(200, mockEvolutionChainData);

        const data = await getDetailedPokemonData('charmander');

        expect(data).toEqual({
            name: 'charmander',
            id: 4,
            height: 6,
            weight: 85,
            species: 'charmander',
            abilities: [{ name: 'blaze', effect: 'Powers up Fire-type moves when the Pokémon is in trouble.' }],
            types: ['fire'],
            base_stats: [{ name: 'hp', base_stat: 39 }],
            moves: [{
                name: 'ember',
                power: 40,
                accuracy: 100,
                type: 'fire',
                damage_class: 'special'
            }],
            evolution_chain: [
                { species_name: 'charmander', min_level: null },
                { species_name: 'charmeleon', min_level: 16 },
                { species_name: 'charizard', min_level: 36 }
            ]
        });
    });

    it('should handle API errors gracefully', async () => {
        mock.onGet('https://pokeapi.co/api/v2/pokemon/charmander').reply(500, { message: "Internal Server Error" }, { status: 500, statusText: "Internal Server Error" });

        await expect(getDetailedPokemonData('charmander')).rejects.toThrow('Error fetching data: Internal Server Error');
    });
});
