
import getPokemonsByAbilityGroupedByType from './src/getPokemonsByAbilityGroupedByType.js';
import getDetailedPokemonData from "./src/detailledPokemon.js";
import getTopPokemonByStatGrouped from "./src/pokemonStatRanking.js";
import getPokemonsByEvolutionChain from "./src/getPokemonsByEvolutionChain.js";

getPokemonsByAbilityGroupedByType('pound')
    .then(result => console.log(result))
    .catch(error => console.error(error));

getDetailedPokemonData('charmander')
    .then(result => {
        console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
        console.error('Failed to get detailed Pokémon data:', error.message);
    });

getPokemonsByEvolutionChain('abra')
    .then(result => console.log(result))
    .catch(error => console.error(error));

getTopPokemonByStatGrouped('attack', 10)
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error(JSON.stringify({ error: error.message }, null, 2));
    });
