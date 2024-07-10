# API Pokémon

Ce projet fournit plusieurs fonctions pour interagir avec l'API Pokémon. Ces fonctions permettent aux utilisateurs de récupérer des données détaillées sur les Pokémon, y compris leurs capacités, statistiques, chaînes d'évolution, et plus encore.

## Table des Matières

- [Installation](#installation)
- [Utilisation](#utilisation)
  - [getPokemonsByAbilityGroupedByType](#getpokemonsbyabilitygroupedbytype)
  - [getDetailedPokemonData](#getdetailedpokemondetail)
  - [getTopPokemonByStatGrouped](#gettoppokemonbystatgrouped)
  - [getPokemonsByEvolutionChain](#getpokemonsbyevolutionchain)
  - [getBestPokemonByStatsInLocation](#getbestpokemonbystatsinlocation)
- [Contribution](#contribution)
- [Licence](#licence)

## Installation

```bash
npm install
```
# Pour utiliser ces fonctions, vous devez avoir Node.js installé. Ensuite, installez les dépendances nécessaires :

## Utilisation

### getPokemonsByAbilityGroupedByType
Récupère les Pokémon qui peuvent apprendre une capacité spécifique et les regroupe par type.
```javascript
import getPokemonsByAbilityGroupedByType from './src/getPokemonsByAbilityGroupedByType.js';

getPokemonsByAbilityGroupedByType('pound')
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

### getDetailedPokemonData
Récupère des données détaillées sur un Pokémon spécifique, y compris les espèces, capacités, types, statistiques de base et mouvements.

```javascript
import getDetailedPokemonData from "./src/detailledPokemon.js";

getDetailedPokemonData('charmander')
    .then(result => {
        console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données détaillées du Pokémon:', error.message);
    });
```


### getTopPokemonByStatGrouped
Récupère les meilleurs Pokémon en fonction d'une statistique spécifique.

```javascript
import getTopPokemonByStatGrouped from "./src/pokemonStatRanking.js";

getTopPokemonByStatGrouped('attack', 10)
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error(JSON.stringify({ error: error.message }, null, 2));
    });
```

### getPokemonsByEvolutionChain
Récupère la chaîne d'évolution d'un Pokémon donné, ainsi que les conditions pour chaque évolution.

```javascript
import getPokemonsByEvolutionChain from "./src/getPokemonsByEvolutionChain.js";

getPokemonsByEvolutionChain('abra')
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

### getBestPokemonByStatsInLocation
Récupère les meilleurs Pokémon par statistiques dans un emplacement donné.

```javascript
import getBestPokemonByStatsInLocation from "./src/getBestPokemonByStatsInLocation.js";

getBestPokemonByStatsInLocation('celadon-city')
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

# Contribution
Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir un ticket pour discuter des modifications proposées.

# Licence
Ce projet est sous licence MIT.