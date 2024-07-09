import axios from 'axios';

/**
 * Fetches the best Pokémon by stats in a given location.
 *
 * @param {string} locationName - The name of the location to look up.
 * @returns {Promise<Object>} A promise that resolves to an object containing the best Pokémon for each stat in the location.
 * @throws {Error} Throws an error if fetching data fails.
 */
export default async function getBestPokemonByStatsInLocation(locationName) {
    try {
        // Step 1: Get the location details to find the Pokémon URLs
        const locationResponse = await axios.get(`https://pokeapi.co/api/v2/location/${locationName}`);
        const areas = locationResponse.data.areas;

        const pokemonUrls = [];

        // Step 2: Get the Pokémon encounter details for each area
        for (const area of areas) {
            const areaResponse = await axios.get(area.url);
            areaResponse.data.pokemon_encounters.forEach(encounter => {
                pokemonUrls.push(encounter.pokemon.url);
            });
        }

        // Step 3: Get the Pokémon details
        const pokemonData = await getPokemonData(pokemonUrls);

        // Step 4: Determine the best Pokémon for each stat
        const bestPokemonByStats = getBestPokemonByStats(pokemonData);

        return bestPokemonByStats;
    } catch (error) {
        console.error('error during fetch');
        return {};
    }
}

/**
 * Fetches data for a list of Pokémon URLs.
 *
 * @param {Array<string>} urls - The URLs of the Pokémon to fetch.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of Pokémon data.
 */
async function getPokemonData(urls) {
    const pokemonData = await Promise.all(urls.map(url => axios.get(url).then(response => response.data)));
    return pokemonData;
}

/**
 * Determines the best Pokémon for each stat.
 *
 * @param {Array<Object>} pokemonData - The array of Pokémon data.
 * @returns {Object} - An object containing the best Pokémon for each stat.
 */
function getBestPokemonByStats(pokemonData) {
    const stats = ['attack', 'defense', 'special-attack', 'special-defense', 'speed'];
    const bestPokemon = {};

    stats.forEach(stat => {
        bestPokemon[stat] = pokemonData.reduce((best, current) => {
            const currentStat = current.stats.find(s => s.stat.name === stat).base_stat;
            const bestStat = best.stats.find(s => s.stat.name === stat).base_stat;
            return currentStat > bestStat ? current : best;
        });
    });

    return stats.reduce((result, stat) => {
        result[stat] = {
            name: bestPokemon[stat].name,
            value: bestPokemon[stat].stats.find(s => s.stat.name === stat).base_stat
        };
        return result;
    }, {});
}
