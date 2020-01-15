import core from './core.js';
import moveDataArray from './data/moves.js';
import textDict from './data/text.js';
import classDataArray from './data/trainer.classes.js';

import partymonDataArray from './data/tree.pokemon.js';
const evsValue = [ 0, 252, 252, 168, 124, 100, 84 ];
let partymonGroup = [];

function init(){
  let htmlSelect='';
  partymonDataArray.forEach( function( data, i ) {
    let num = data.number;
    if ( !( num in partymonGroup) ) partymonGroup[num] = 0;
    partymonGroup[num] += 1;
  });
  partymonGroup.forEach( function( data, i ) {
    let name = pmBase.common.getPokemonName( i );
    htmlSelect += `<option value="${i}">${i}　${name}</option>`;
  });
  
  pmBase.content.build({
    pages: [{
      selector: htmlSelect,
      content: change,
    }]
  });
  
}

function change( hash ) {
  let number = ~~hash.value;
  if ( !(number in partymonGroup ) ) return;
  
  let html = '';
  html += '<table class="table">';
  partymonDataArray
  .filter(x=>x.number===number)
  .forEach( function(data) {
    let pkmnID = pmBase.common.getPokemonID( data.number, data.form );
    let icon = pmBase.sprite.get('pi7',pkmnID );
    let name = pmBase.common.getPokemonName( pkmnID );
    let moves = '';
    data.moves.forEach(function(mi){
      if ( mi ) {
        let moveData = moveDataArray[mi];
        let typeIcon = pmBase.sprite.get('type7',moveData.type, 20 );
        moves += `<td>${typeIcon} ${textDict.moves[mi]}</td>`;
      } else {
        moves += `<td>-</td>`;
      }
    });
    
    let evs = data.evs.toString(2).padStart(6,0).split('').map(Number).reverse();
    let evsum = evs.reduce((x,y) => x + y);
    evs = evs.map( m => m?evsValue[evsum]:'-' ).join(' / ');
    let item = pmBase.sprite.get('item7', data.item );// + textDict.items[data.item];
    html += `<tr>
        <td>#${number}</td>
        <td>${icon}</td>
        <td>${name}</td>
        ${moves}
        <td>${evs}</td>
        <td>${textDict.natures[data.nature]}</td>
        <td>${item}</td>
      </tr>`;
  });
  html += '</table>';
  return html;
}

pmBase.hook.on( 'load', init );