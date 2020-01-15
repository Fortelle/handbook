import pokemonDataArray from './data/pokemon.js';
import textDict from './data/text.js';
import { maxPowerArray, megaEvolutionDict } from './data/misc.js';

pmBase.loader.load('pmcommon');

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

const getPokemonIcon = function (pkmnData,size=48) {
  if ( typeof pkmnData === 'string' ) pkmnData = getPokemonData(pkmnData);
  let icon = pmBase.sprite.get('pokemon',pkmnData.icon,size);
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

const itemDataArray = [
[,""],
[0,"步数＋5"],
[1,"限制时间＋10秒"],
[2,"经验值1.5倍"],
[3,"超级开局"],
[4,"盘面宝可梦－1"],
[5,"干扰防御"],
[6,"攻击强化"],
[7,"超级进化加速"],
[,""],
[,""],
[,""],
[,""],
[10,"最大等级提升"],
[9,"等级提升"],
[8,"经验值提升S"],
[16,"经验值提升M"],
[17,"经验值提升L"],
[11,"能力强化S"],
[18,"能力强化M"],
[19,"能力强化L"],
[12,"能力变换"],
];

const getItem = function ( type, value, count = 0 ) {
  let icon = '', text = '';
  
  if ( type == 1 ) {
    text = '宝石';
  } else if ( type == 2 ) {
    text = '体力';
  } else if ( type == 3 ) {
    text = '硬币';
  } else if ( type == 4 ) {
    icon = pmBase.sprite.get( 'item', itemDataArray[value][0], 24 );
    text = itemDataArray[value][1];
  } else if ( type == 5 ) {
    text = '超级进化石';
  } else if ( type == 6 ) {
    text = '宝可梦！';
  } else if ( type == 7 ) {
    icon = pmBase.sprite.get( 'item', 13, 24 );
    text = '能力强化';
  }
  if ( count ) {
    return icon + text + '×' + count;
  } else {
    return icon;
  }
};

pmBase.sprite.add( 'pokemon', {
  url : '/pktl/images/pokemon.min.png',
  width: 60,
  height:60,
  col: 30
});

pmBase.sprite.add( 'ojama', {
  url : '/pktl/images/ojama.png',
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
  getItem,
}