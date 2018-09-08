import pokemonDataArray from './data/pokemon.js';
import { maxPowerArray, megaEvolutionDict, extendFormNames } from './data/misc.js';

let pokemonList = {};
let megaList = {};
let pokemonListByDex = [];
let formNames = {};

let parsePokemon = function ( raw ) {
  var pkmnID = pmBase.util.getPokemonID( raw[0], raw[1] );
  let pkmnData = {
  	id     : pkmnID,
  	info   : pmBase.util.getPokemonInfo(pkmnID),
  	dex    : raw[2].toString().padStart(3,'0'),
  	type   : raw[3],
  	group  : raw[4],
  	skills : raw[5],
  	rml    : raw[6] || 0,
  	rank   : raw[7],
  	icon   : raw[8],
  };
  pkmnData.maxLevel = 10 + pkmnData.rml;
  pkmnData.power = maxPowerArray[pkmnData.group][1];
  pkmnData.maxPower = maxPowerArray[pkmnData.group][pkmnData.maxLevel];
  
  if ( raw[9] ) {
    pkmnData.isMega = true;
    pkmnData.mb = raw[9][0];
    pkmnData.msu = raw[9][1];
  } else {
    pkmnData.isMega = false;
  }
  return pkmnData;
};


let init = function () {
  $.extend( true, pmBase.data.formnames, extendFormNames );
  
  $.each( pokemonDataArray, function( index, raw ) {
    if ( raw.length == 0 ) return true;
    var pkmnData = parsePokemon(raw);
    if ( pkmnData.isMega ) {
      megaList[ pkmnData.id ] = pkmnData;
    } else {
      pokemonList[ pkmnData.id ] = pkmnData;
    }
  });
  
  $.each( megaEvolutionDict, function( pkmnID, pkmnMegas ) {
    pokemonList[ pkmnID ].hasMega = true;
    $.each( pkmnMegas, function( i, megaID ) {
      megaList[ megaID ].originID = pkmnID;
    });
  });
  
  pokemonListByDex = Object.values(pokemonList).sort(function(pkmn1, pkmn2) {
  	return pkmn1.dex - pkmn2.dex || pkmn1.id - pkmn2.id;
  });
};

let getPokemonData = function ( pkmnID ) {
  let data = pokemonList[pkmnID];
  if ( !data ) data = megaList[pkmnID];
  if ( !data ) return false;
  return data;
  
  //if ( ! ( pkmnID in pokemonList ) ) return false;
  //return pokemonList[pkmnID];
};

let getPokemonDataByIndex = function ( index ) {
  let pkmnID = getPokemonIDByIndex(index);
  return getPokemonData(pkmnID);
  //return pokemonList[getPokemonIDByIndex(index)];
};

let getMegaData = function ( pkmnID ) {
  return megaList[pkmnID];
};

let getPokemonIDByIndex = function ( index ) {
  let raw = pokemonDataArray[index];
  let pkmnID = pmBase.util.getPokemonID( raw[0], raw[1] );
  return pkmnID;
};

const getPokemonIcon = function (pkmnData) {
  if ( typeof pkmnData === 'string' ) pkmnData = getPokemonData(pkmnData);
  let icon = pmBase.sprite.get('pokemon',pkmnData.icon,48);
  return `<div class="p-pkmn" data-pid="${pkmnData.id}">${icon}</div>`;
}

init();

pmBase.sprite.add( 'pokemon', {
	url : '/pktl/images/pokemon.min.png',
	width: 60,
	height:60,
	col: 30
});

pmBase.sprite.add( 'ojama', {
	url : '/pktl/images/ojama.min.png',
	width: 64,
	height:64,
	col: 1
});

pmBase.util.addCSS(`
  .popover {
    max-width: none;
  }
`);

export default {
	getPokemonData,
	getPokemonDataByIndex,
	getMegaData,
	pokemonList,
	megaEvolutionDict,
	pokemonListByDex,
	getPokemonIDByIndex,
	megaList,
	getPokemonIcon
}