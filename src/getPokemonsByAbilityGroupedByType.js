import axios from 'axios';

/**
 * Fetches Pokémon that can learn a specific move and groups them by their type.
 *
 * @param {string} ability - The name of the move to look up.
 * @returns {Promise<Object>} A promise that resolves to an object where keys are Pokémon types and values are arrays of Pokémon names.
 * @throws {Error} Throws an error if fetching data fails.
 */
export default async function getPokemonsByAbilityGroupedByType(ability) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/move/${ability}`);
        const pokemons = response.data.learned_by_pokemon;
        const typeGroups = {};

        let limit = 0;
        for (const pokemon of pokemons) {
            if (limit < 30) {
                const pokeResponse = await axios.get(pokemon.url);
                const pokeDetails = pokeResponse.data;

                const types = pokeDetails.types.map(t => t.type.name);

                types.forEach(type => {
                    if (!typeGroups[type]) {
                        typeGroups[type] = [];
                    }
                    typeGroups[type].push(pokeDetails.name);
                });
                limit++;
            }
        }

        return typeGroups;
    } catch (error) {
        console.error(error);
        return {};
    }
}