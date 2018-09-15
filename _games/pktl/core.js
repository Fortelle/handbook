import pokemonDataArray from './data/pokemon.js';
import textDict from './data/text.js';
import { maxPowerArray, megaEvolutionDict } from './data/misc.js';

pmBase.loader.load('common');

let pokemonList = {};
let megaList = {};
let pokemonListByDex = [];
let formNames = {};

let init = function () {
  pokemonDataArray.forEach( ( data, index ) => {
    if ( data.dex === 0 || data.dex === 999 ) return;
    let pkmnID = pmBase.common.getPokemonID( data.number, data.form );
    pokemonDataArray[index].id = pkmnID;
    if ( data.ms ) {
      megaList[ pkmnID ] = index;
    } else {
      pokemonList[ pkmnID ] = index;
    }
  });
  
  $.each( megaEvolutionDict, function( pkmnID, pkmnMegas ) {
    //pokemonDataArray[ pokemonList[ pkmnID ] ].hasMega = true;
    $.each( pkmnMegas, function( i, megaID ) {
      pokemonDataArray[ megaList[ megaID ] ].originID = pkmnID;
    });
  });
  /*
  pokemonListByDex = Object.values(pokemonList).sort(function(pkmn1, pkmn2) {
  	return pkmn1.dex - pkmn2.dex || pkmn1.id - pkmn2.id;
  });
  */
};

const getPokemonData = function ( pkmnID ) {
  if ( typeof pkmnID === 'string' && pkmnID in pokemonList ) {
    return pokemonDataArray[pokemonList[pkmnID]];
  } else {
    return pokemonDataArray[pkmnID];
  }
};

const getMegaData = function ( megaID ) {
  if ( megaID in megaList ) return pokemonDataArray[megaList[megaID]];
};

const getMegaEffect = function ( megaData ) {
  let text = textDict.megaeffects[megaData.skills[0]];
  text = text.replace( '$1', megaData.name );
  return text;
};

const getPokemonIcon = function (pkmnData) {
  if ( typeof pkmnData === 'string' ) pkmnData = getPokemonData(pkmnData);
  let icon = pmBase.sprite.get('pokemon',pkmnData.icon,48);
  return `<div class="p-pkmn d-inline-block align-middle" data-pid="${pkmnData.id}">${icon}</div>`;
};

const getPokemonFullname = function (pkmnData) {
  if ( typeof pkmnData === 'string' ) pkmnData = getPokemonData(pkmnData);
  let namePart = pkmnData.name;
  let formPart = pkmnData.formname;
  if ( formPart ) formPart = `～${formPart}～`;
  return namePart + formPart;
};

const getAttack = function ( group, level ) {
  return maxPowerArray[group][level];
};

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

pmBase.sprite.add( 'item', {
	url : '/pktl/images/items.min.png',
	width: 64,
	height:64,
	col: 1
});

pmBase.util.addCSS(`
  .popover {
    max-width: none;
  }
`);

pmBase.config.set('typenames',["一般","格斗","毒","地面","飞行","虫","岩石","幽灵","钢","火","水","电","草","冰","超能力","龙","恶","妖精"]);

pmBase.hook.on('load',init);

export default {
	getPokemonData,
	getMegaData,
	pokemonList,
	megaList,
	getPokemonIcon,
	getAttack,
	getMegaEffect,
	getPokemonFullname,
}