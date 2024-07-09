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
        const statusText = error.response?.statusText || 'Internal Server Error';
        throw new Error(`Error fetching data: ${statusText}`);
    }
}

/**
 * Fetch data for a list of Pokémon URLs
 * @param {Array<string>} urls - The URLs of the Pokémon to fetch
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of Pokémon data
 */
async function getPokemonData(urls) {
    const pokemonData = await Promise.all(urls.map(url => fetchData(url)));
    return pokemonData;
}

/**
 * Get top Pokémon by a specific stat
 * @param {Array<Object>} pokemonData - Array of Pokémon data
 * @param {string} stat - The stat to rank by (e.g., 'attack', 'defense')
 * @returns {Array<Object>} - The Pokémon sorted by the specified stat
 */
function getTopPokemonByStat(pokemonData, stat) {
    return pokemonData.sort((a, b) => {
        const statA = a.stats.find(s => s.stat.name === stat).base_stat;
        const statB = b.stats.find(s => s.stat.name === stat).base_stat;
        return statB - statA;
    });
}

/**
 * Get top Pokémon by a specific stat
 * @param {string} stat - The stat to rank by (e.g., 'attack', 'defense')
 * @param {number} topN - The number of top Pokémon to return
 * @returns {Promise<string>} - A promise that resolves to a JSON string of top Pokémon data
 */
export default async function getTopPokemonByStatGrouped(stat, topN) {
    const allPokemonData = await fetchData('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const pokemonUrls = allPokemonData.results.map(pokemon => pokemon.url);
    const pokemonData = await getPokemonData(pokemonUrls);
    const topPokemon = getTopPokemonByStat(pokemonData, stat).slice(0, topN);

    // Formater les résultats en JSON
    const formattedResult = topPokemon.map(pokemon => {
        const pokemonStat = pokemon.stats.find(s => s.stat.name === stat).base_stat;
        return {
            name: pokemon.name,
            statValue: pokemonStat
        };
    });

    return JSON.stringify(formattedResult, null, 2);
}
