import axios from 'axios';

/**
 * Fetches the evolution chain for a given Pokémon name, along with the conditions for each evolution.
 *
 * @param {string} pokemonName - The name of the Pokémon to look up.
 * @returns {Promise<Object>} A promise that resolves to an object containing the evolution chain and their conditions.
 * @throws {Error} Throws an error if fetching data fails.
 */
export default async function getEvolutionDetails(pokemonName) {
    try {
        // Step 1: Get the Pokémon details to find the species URL
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const speciesUrl = pokemonResponse.data.species.url;

        // Step 2: Get the Pokémon species details to find the evolution chain URL
        const speciesResponse = await axios.get(speciesUrl);
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

        // Step 3: Get the evolution chain details
        const evolutionResponse = await axios.get(evolutionChainUrl);
        const evolutionChain = evolutionResponse.data.chain;

        // Step 4: Parse the evolution chain to get the evolution details
        const evolutions = [];
        parseEvolutionChain(evolutionChain, null, evolutions);
        return evolutions;
    } catch (error) {
        console.error(error);
        return [];
    }
}

/**
 * Parses the evolution chain recursively to extract evolution details.
 *
 * @param {Object} chain - The evolution chain object.
 * @param {Object} [evolutionDetails] - The evolution details of the previous Pokémon.
 * @param {Array} evolutions - The array to store the evolution details.
 */
function parseEvolutionChain(chain, evolutionDetails, evolutions) {
    const { species, evolves_to } = chain;

    const currentEvolution = evolutionDetails
        ? {
            evolve_to: species.name,
            ...(evolutionDetails.trigger && { trigger: evolutionDetails.trigger.name }),
            ...(evolutionDetails.trigger?.name === 'level-up' && { minLevel: evolutionDetails.min_level }),
            ...(evolutionDetails.trigger?.name === 'use-item' && { item: evolutionDetails.item.name })
        }
        : {
            speciesName: species.name
        };

    evolutions.push(currentEvolution);

    evolves_to.forEach(evolution => {
        parseEvolutionChain(evolution, evolution.evolution_details[0], evolutions);
    });
}

