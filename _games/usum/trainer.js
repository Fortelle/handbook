import core from './core.js';
import classDataArray from './data/trainer.class.js';
import trainerDataArray from './data/trainer.data.js';
import trainerPokemonDataArray from './data/trainer.pokemon.js';

import moveDataArray from './data/moves.js';
import textDict from './data/text.js';
import textDict2 from './data/text2.js';
import {ballIndexArray} from './data/misc.js';

const genderText = ['<i class="fas fa-genderless"></i>','<i class="fas fa-mars"></i>','<i class="fas fa-venus"></i>'];

function init(){
  let html = trainerDataArray
    .map( function( data, i ) {
      let name = textDict2.trainernames[i];
      if ( name ) return `<option value="${i}">${i} ${textDict2.trainerclasses[data.class]} ${textDict2.trainernames[i]||i}</option>`;
    })
    .join('');
  pmBase.page.setControl( html );
  pmBase.page.listen( parseHash );
}

function parseHash( hash ) {
  if ( hash in trainerDataArray ) {
    change(hash);
    return true;
  }
}

function change( trIndex ) {
  let trData = trainerDataArray[trIndex];
  let pmList = trainerPokemonDataArray[trIndex];
  let clData = classDataArray[trData.class];
  
  let html = '';
  let gold = trData.bonus * pmList[pmList.length-1].level * 4;
  let clName = textDict2.trainerclasses[trData.class];
  let trName = textDict2.trainernames[trIndex];
  let trItems = trData.items ? trData.items.filter(x=>x>0).map(x=>pmBase.sprite.get('item7',x)).join(''):'';
  let trGender = genderText[clData.gender+1];
  let trBall = pmBase.sprite.get('item7',ballIndexArray[clData.ball]);
  
  let infoData =[
    ['训练家类型', clName],
    ['名字', trName],
    ['性别', trGender],
    ['零花钱', gold],
    ['精灵球', trBall],
    ['道具', trItems],
  ];
  
  html += '<h3>训练家</h3>';
  html += pmBase.page.create('info', infoData);
  

  html += '<h3>宝可梦</h3><table class="table">';
  pmList.forEach( function(bmData){
    let pmID = pmBase.util.getPokemonID( bmData.number, bmData.form );
    let pmInfo = pmBase.util.getPokemonInfo( bmData.number, bmData.form );
    let pmData = core.getPokemonData(pmID);
    let moves = bmData.moves ? bmData.moves.map( x => x == 0 ? '-' : textDict.moves[x] ).join('/') : '';
    let ability = bmData.ability
      ? textDict.abilities[pmData.abilities[bmData.ability-1]]
      : pmData.abilities[0] === pmData.abilities[1]
        ? textDict.abilities[pmData.abilities[0]]
        : textDict.abilities[pmData.abilities[0]] + '/' + textDict.abilities[pmData.abilities[1]];
      
    html += `<tr>
      <td>${pmBase.sprite.get('pi7',pmID )}</td>
      <td>#${bmData.number.toString().padStart(3,0)}</td>
      <td>${pmInfo.name}</td>
      <td>${bmData.level}</td>
      <td>${genderText[bmData.gender]}</td>
      <td>${ability}</td>
      <td>${textDict.natures[bmData.nature]}</td>
      <td>${bmData.evs?bmData.evs.join('/'):''}</td>
      <td>${bmData.ivs?bmData.ivs.join('/'):''}</td>
      <td>${moves}</td>
      <td>${bmData.item?pmBase.sprite.get('item7',bmData.item ):''}</td>
    </tr>`;
  });
  html += '</table>';
  
  pmBase.page.setContent( html );
}

pmBase.hook.on( 'init', init );