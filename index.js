import getDetailedPokemonData from "./src/detailledPokemon.js";

(async () => {
    try {
        const pokemonName = 'charmander'; // You can also use an ID, e.g., 4
        const data = await getDetailedPokemonData(pokemonName);
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Failed to fetch detailed Pokémon data:', error);
    }
})();