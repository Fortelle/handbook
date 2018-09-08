import NBNG from './core.js'
import pokemonDataArray from './data/pokemon.js';
import scenarioDataArray from './data/scenario.js';
import { buildingDataArray, encounterBuildings } from './data/building.js';
import bushoLinkDataArray from './data/busholinks.js';
import bushoDataArray from './data/busho.js';
import textDict from './data/text.js';

function init(){
  let html_table = '', html_select = '';
  
  scenarioDataArray.forEach( function( scenData, scenIndex ) {
    let name = '剧本' + scenIndex;
    let href = pmBase.url.createUrlHash( scenIndex );
    
    html_table += `<tr>
      <td><a href="${href}">${name}</a></td>
    </tr>`;
    
    html_select += `<option value="${scenIndex}">${name}</option>`;
  });
  $('.p-home tbody').html(html_table);
  
  $('.p-page--2 .p-page__control').html(`<select class="form-control p-selector">${html_select}</select>`);
  
}

function subpage( scenIndex ){
  let scenData = scenarioDataArray[scenIndex];
  if ( !scenData ) return;
  
  let html = '';
  
  let html_seiryoku = '';
  let seiryoku = [];
  scenData.seiryoku.forEach( function( data, seiryokuIndex){
    seiryoku[seiryokuIndex] = {
      kuniIndex: data[0],
      leaderID: data[1],
    };
  });
  let kuniBusho = new Array(17).fill('');
  
  scenData.busho.forEach( function( data ) {
    let bushoData = bushoDataArray[data.bushoIndex];
    if ( data.type > 1 ) return;
    let bushoIcon = pmBase.sprite.get('busho_s',bushoData.icon);
    let bushoName = textDict.warriors[data.bushoIndex];
    let pkmnIcon = pmBase.sprite.get('pokemon',data.pkmnIndex);
    let pkmnName = textDict.pokemon[data.pkmnIndex];
    
    kuniBusho[data.kuni] += `<div class="row">
      <div class="col-1">${bushoIcon}</div>
      <div class="col-2">${bushoName}</div>
      <div class="col-1">${pkmnIcon}</div>
      <div class="col-3">${pkmnName}</div>
     </div>`;
  });
  
  scenData.kuni.forEach( function( seiryokuIndex, kuniIndex ){
    if  ( seiryokuIndex === -1 ||! seiryoku[seiryokuIndex] ) return;
    let bushoIndex = NBNG.specialBushoList[seiryoku[seiryokuIndex].leaderID];
    let kuniIcon = pmBase.sprite.get('kuni', kuniIndex );
    let kuniName = textDict.kuni[kuniIndex];
    let bushoIcon = pmBase.sprite.get('busho_o',bushoIndex);
    let bushoName = textDict.warriors[bushoIndex];
    
    html_seiryoku += `<tr>
      <td>${kuniIcon}</td>
      <td>${kuniName}</td>
      <td>${bushoIcon}</td>
      <td>${bushoName}军</td>
      <td><div class="container-fluid">${kuniBusho[kuniIndex]}</div></td>
    </tr>`;
  });
  
  html += `
    <h3>势力</h3>
    <table class="table table-sm text-center">
      <thead>
        <tr>
          <th colspan="2">城池</th>
          <th colspan="2">势力</th>
          <th colspan="11" style="width: 50%;">武将</th>
        </tr>
      </thead>
      <tbody>${html_seiryoku}</tbody>
    </table>
  `;
  
  $('.p-page--2 .p-page__body').html(html);
  return true;
} 

pmBase.hook.on( 'init', function(){
  init();
  pmBase.page.listen( subpage );
});
