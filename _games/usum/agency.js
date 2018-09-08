import core from './core.js';
import agencyPokemonDataArray from './data/agency.pokemon.js';
import agencyTrainerDataArray from './data/agency.trainers.js';
import moveDataArray from './data/moves.js';
import textDict from './data/text.js';
import textDict2 from './data/text2.js';

function init(){
  let html = agencyTrainerDataArray.map( function( data, i ) {
    return `<option value="${i}">${i} ${data[0]}</option>`;
  }).join('');
  pmBase.page.setControl( html );
  pmBase.page.listen( change );
}

function change( trIndex ) {
  let trPokemonList = agencyTrainerDataArray[trIndex][2];
  
  let html = '';
  html += '<h3>宝可梦</h3><table class="table">';
  $.each( trPokemonList, function( i, p ) {
    let data = agencyPokemonDataArray[p];
    
    let pkmnID = pmBase.util.getPokemonID( data.num, data.form );
    let icon = pmBase.sprite.get('pi7',pkmnID );
    let name = pmBase.util.getPokemonName( pkmnID );
    let moves = data.moves.map( m => `<td>${textDict.moves[m]}</td>` ).join('');
    
    let evs = data.evs.toString(2).padStart(6,0).split('').map(Number).reverse();
    let evsum = evs.reduce((x,y) => x + y);
    evs = evs.map( m => m * 504 / evsum ).join(' / ');
    let item = pmBase.sprite.get('item7', data.item ) + textDict.items[data.item];
    html += `<tr>
        <td>#${p}</td>
        <td>${icon}</td>
        <td>${name}</td>
        ${moves}
        <td>${item}</td>
        <td>${evs}</td>
        <td>${data.nature}</td>
      </tr>`;
  });
  html += '</table>';
  pmBase.page.setContent( html );
}

pmBase.hook.on( 'init', init );