import core from './core.js';
import moveDataArray from './data/moves.js';
import textDict from './data/text.js';
import classDataArray from './data/trainer.classes.js';

let partymonDataArray, npcDataArray;
const evsValue = [ 0, 252, 252, 168, 124, 100, 84 ];

function init(){
  let type = $('.js-config').data('type');
  pmBase.loader.using([
    `./data/${type}.pokemon.js`,
    `./data/${type}.trainers.js`,
  ], function( arr ) {
    [partymonDataArray, npcDataArray] = arr;
    
    let listData=[],htmlSelect='';
    npcDataArray.forEach( function( data, i ) {
      let clData = classDataArray[data.class];
      let id = i.toString().padStart(3,0);
      htmlSelect += `<option value="${i}">${id}　${clData.name.padEnd(7,'　')} ${data.name}</option>`;
      
      listData.push( [
        pmBase.sprite.get('class',clData.icon,32 ),
        `#${id}`,
        clData.name,
        `<a href="${pmBase.url.getHref(i)}">${data.name}</a>`,
        data.nameja,
        data.nameen,
        data.pokemon.length,
      ] );
    });
      
  	pmBase.content.build({
  	  pages: [{
  	    content: pmBase.content.create('list',listData),
  	  },{
  	    control: htmlSelect,
  	    content: change,
  	  }]
  	});
	
  	
  });
}

function change( trIndex ) {
  if ( ! (trIndex in npcDataArray) ) return false;
  let trPokemonList = npcDataArray[trIndex].pokemon;
  
  let html = '';
  html += '<h3>宝可梦</h3><table class="table">';
  $.each( trPokemonList, function( i, p ) {
    let data = partymonDataArray[p];
    
    let pkmnID = pmBase.common.getPokemonID( data.number, data.form );
    let icon = pmBase.sprite.get('pi7',pkmnID );
    let name = pmBase.common.getPokemonName( pkmnID );
    let moves = '';
    data.moves.forEach(function(mi){
      let moveData = moveDataArray[mi];
      let typeIcon = pmBase.sprite.get('type7',moveData.type, 20 );
      moves += `<td>${typeIcon} ${textDict.moves[mi]}</td>`;
    });
    
    let evs = data.evs.toString(2).padStart(6,0).split('').map(Number).reverse();
    let evsum = evs.reduce((x,y) => x + y);
    evs = evs.map( m => evsValue[m] ).join(' / ');
    let item = pmBase.sprite.get('item7', data.item );// + textDict.items[data.item];
    html += `<tr>
        <td>#${p}</td>
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