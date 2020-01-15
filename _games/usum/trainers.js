import core from './core.js';
import classDataArray from './data/trainer.classes.js';
import trainerDataArray from './data/trainer.data.js';
import trainerPokemonDataArray from './data/trainer.pokemon.js';

import moveDataArray from './data/moves.js';
import textDict from './data/text.js';
import {ballIndexArray} from './data/misc.js';

const genderText = ['<i class="fas fa-genderless"></i>','<i class="fas fa-mars"></i>','<i class="fas fa-venus"></i>'];

function init(){
  let listData=[],htmlSelect='';
  trainerDataArray.forEach( function( data, i ) {
    if ( data.name.length === 0 ) return;
    let clData = classDataArray[data.class];
    let id = i.toString().padStart(3,0);
    let pokemon = trainerPokemonDataArray[i].map( bmData=>pmBase.sprite.get('pi7',pmBase.common.getPokemonID( bmData.number, bmData.form ) )).join('');
    htmlSelect += `<option value="${i}">${id}　${clData.name.padEnd(7,'　')} ${data.name}</option>`;
    listData.push( [
      pmBase.sprite.get('class',clData.icon,32 ),
      `#${id}`,
      clData.name,
      `<a href="${pmBase.url.getHref(i)}">${data.name}</a>`,
      data.nameja,
      data.nameen,
      pokemon,
    ] );
  })
  
  pmBase.content.build({
    pages: [{
      content: pmBase.content.create('list',{list:listData}),
    },{
      selector: htmlSelect,
      content: change,
    }]
  });
  
}

function change( hash ) {
  let trIndex = ~~hash.value;
  if ( !(trIndex in trainerDataArray) ) return;
  let trData = trainerDataArray[trIndex];
  let pmList = trainerPokemonDataArray[trIndex];
  let clData = classDataArray[trData.class];
  
  let html = '';
  let gold = trData.bonus * pmList[pmList.length-1].level * 4;
  let clName = clData.name;
  let trName = `${trData.name}（${trData.nameja}，${trData.nameen}）`;
  let trItems = trData.items ? trData.items.filter(x=>x>0).map(x=>pmBase.sprite.get('item7',x)).join(''):'';
  let trGender = genderText[clData.gender+1];
  let trBall = pmBase.sprite.get('item7',ballIndexArray[clData.ball]);
  
  let infoData =[
    ['训练家类型', clName],
    ['名字', `${trName}`],
    ['性别', trGender],
    ['零花钱', gold],
    ['精灵球', trBall],
    ['道具', trItems],
  ];
  
  html += '<h3>训练家</h3>';
  html += pmBase.content.create('info', {list:infoData});
  

  html += '<h3>宝可梦</h3><table class="table">';
  pmList.forEach( function(bmData){
    let pmID = pmBase.common.getPokemonID( bmData.number, bmData.form );
    let pmInfo = pmBase.common.getNameInfo( bmData.number, bmData.form );
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
  
  return html;
}

pmBase.hook.on( 'load', init );