import pokemonDataDict from './data/pokemon.js';
import { pokemoniconIndex } from './data/misc.js';

const getPokemonData = function( pkmnID ) {
  let pkmnData = pokemonDataDict[pkmnID];
  if ( !pkmnData ) pkmnData = pokemonDataDict[pmBase.util.getPokemonID(pkmnID,0)];
  return pkmnData;
};

let init = function () {
  
};

pmBase.sprite.add( 'pi7', {
	url : '/usum/images/pi.min.png',
	width: 40,
	height:32,
	col: 30,
	toIndex: function(pid){
	  let i = pokemoniconIndex.indexOf( pid );
	  if ( i > -1 ) {
	    return i;
	  } else {
	    return pokemoniconIndex.indexOf( pmBase.util.getPokemonID(pid,0) );
	  }
	}
});

pmBase.sprite.add( 'item7', {
	url : '/usum/images/items.png',
	width: 32,
	height: 32,
	col: 30
});

export default {
  getPokemonData
}