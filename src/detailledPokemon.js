import axios from 'axios';

/**
 * Fetch data from a given URL
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<Object>} - A promise that resolves to the fetched data
 */
async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching data: ${error.response?.statusText || "Internal Server Error"}`);
    }
}

/**
 * Fetch detailed Pokémon data including species, abilities, types, base stats, and moves
 * @param {string|number} identifier - The name or ID of the Pokémon
 * @returns {Promise<Object>} - A promise that resolves to the detailed Pokémon data
 */
export default async function getDetailedPokemonData(identifier) {
    try {
        const pokemonData = await fetchData(`https://pokeapi.co/api/v2/pokemon/${identifier}`);

        const speciesData = await fetchData(pokemonData.species.url);
        const abilities = await Promise.all(
            pokemonData.abilities.map(async (abilityInfo) => {
                const abilityData = await fetchData(abilityInfo.ability.url);
                return {
                    name: abilityData.name,
                    effect: abilityData.effect_entries.find(entry => entry.language.name === 'en').effect
                };
            })
        );

        const types = pokemonData.types.map(typeInfo => typeInfo.type.name);
        const stats = pokemonData.stats.map(statInfo => ({
            name: statInfo.stat.name,
            base_stat: statInfo.base_stat
        }));

        const moves = await Promise.all(
            pokemonData.moves.map(async (moveInfo) => {
                const moveData = await fetchData(moveInfo.move.url);
                return {
                    name: moveData.name,
                    power: moveData.power,
                    accuracy: moveData.accuracy,
                    type: moveData.type.name,
                    damage_class: moveData.damage_class.name
                };
            })
        );

        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainData = await fetchData(evolutionChainUrl);
        const evolutionChain = parseEvolutionChain(evolutionChainData.chain);

        return {
            name: pokemonData.name,
            id: pokemonData.id,
            height: pokemonData.height,
            weight: pokemonData.weight,
            species: speciesData.name,
            abilities: abilities,
            types: types,
            base_stats: stats,
            moves: moves,
            evolution_chain: evolutionChain
        };
    } catch (error) {
        console.error(`Error fetching detailed Pokémon data: ${error.message}`);
        throw error;
    }
}

/**
 * Parse the evolution chain data
 * @param {Object} chain - The evolution chain data
 * @returns {Array} - An array of evolution stages
 */
function parseEvolutionChain(chain) {
    const evolutions = [];
    let currentStage = chain;

    while (currentStage) {
        evolutions.push({
            species_name: currentStage.species.name,
            min_level: currentStage.evolution_details && currentStage.evolution_details[0]
                ? currentStage.evolution_details[0].min_level
                : null
        });
        currentStage = currentStage.evolves_to.length ? currentStage.evolves_to[0] : null;
    }

    return evolutions;
}
