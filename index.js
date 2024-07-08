import getPokemonsByAbilityGroupedByType from './src/getPokemonsByAbilityGroupedByType.js';

getPokemonsByAbilityGroupedByType('pound')
    .then(result => console.log(result))
    .catch(error => console.error(error));