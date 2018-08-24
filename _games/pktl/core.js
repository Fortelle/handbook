import pokemonRawData from './data/pokemon.js';
import { maxPower, megaMap} from './data/misc.js';

let pokemonList = {};
let megaList = {};
let pokemonListByDex = [];

let parsePokemon = function ( raw ) {
  var pkmnID = pmBase.util.getPokemonKey( raw[0], raw[1] );
  let pkmnName = pmBase.util.getPokemonName(pkmnID);
  let pkmnData = {
  	id     : pkmnID,
  	name   : pkmnName.name,
  	form   : pkmnName.form,
  	dex    : String('00' + raw[2]).slice(-3),
  	type   : raw[3],
  	group  : raw[4],
  	skills : raw[5],
  	rml    : raw[6] || 0,
  	rank   : raw[7],
  	icon   : raw[8],
  };
  pkmnData.hasMega = ( pkmnID in megaMap );
  pkmnData.maxLevel = 10 + pkmnData.rml;
  pkmnData.power = getPower( pkmnData.group, 1);
  pkmnData.maxPower = getPower( pkmnData.group, pkmnData.maxLevel);
  
  if ( raw[9] ) {
    pkmnData.isMega = true;
    pkmnData.mb = raw[9][0];
    pkmnData.msu = raw[9][1];
  } else {
    pkmnData.isMega = false;
  }
  
  return pkmnData;
};

let getPower = function ( group, level ) {
  return maxPower[group][level];
};

let init = function () {
  $.each( pokemonRawData, function( index, raw ) {
    if ( raw.length == 0 ) return true;
    var pkmnData = parsePokemon(raw);
    if ( pkmnData.isMega ) {
      megaList[ pkmnData.id ] = pkmnData;
    } else {
      pokemonList[ pkmnData.id ] = pkmnData;
    }
  });
  
  pokemonListByDex = $.map( pokemonList, function(data, pkmnID){ return data; }).sort(function(pkmn1, pkmn2) {
  	return pkmn1.dex - pkmn2.dex;
  });
};

let getPokemonData = function ( pkmnID ) {
  if ( !(pkmnID in pokemonList) ) return false;
  return pokemonList[pkmnID];
};

init();

pmBase.sprite.add( 'pktl-pokemon', {
	url : 'pktl/images/pokemon.png',
	width: 60,
	height:60,
	col: 30
});

pmBase.url.add( 'pktl-pokemon', 'pktl/pokemon/' );


export default {
	getPokemonData,
	pokemonList,
	megaList,
	getPower,
	pokemonListByDex,
}