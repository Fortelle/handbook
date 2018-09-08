import NBNG from './core.js'
import pokemonDataArray from './data/pokemon.js';
import scenarioDataArray from './data/scenario.js';
import { buildingDataArray, encounterBuildings } from './data/building.js';
import bushoLinkDataArray from './data/busholinks.js';
import bushoDataArray from './data/busho.js';
import textDict from './data/text.js';

const stars = ['','★','★★','★★★','★★★★','★★★★'];
const scenarioText = ['⓪',' ① ','② ','③',' ④',' ⑤',' ⑥',' ⑦',' ⑧ ','⑨ ','⑩'];
const rankText = ['','I','II','III'];

function init(){
  let html_table = '', html_select = '';
  
  $.each( pokemonDataArray, function( pkmnIndex, pkmnData ) {
    let icon = pmBase.sprite.get('pokemon',pkmnIndex);
    let name = textDict.pokemon[pkmnIndex];
    let href = pmBase.url.createUrlHash( pkmnIndex );
    let types = pmBase.page.create( 'type', pkmnData.types[0], pkmnData.types[1] );
    let abilities = pkmnData.abilities.map( a=> textDict.abilities[a] ).join('/');
    let move = textDict.moves[pkmnData.move];
    let movement = pkmnData.movement;
    
    html_table += `<tr>
      <td>${icon}</td>
      <td><a href="${href}">${name}</a></td>
      <td>${pkmnData.stats[0]}</td>
      <td>${movement}</td>
      <td>${pkmnData.stats[1]}</td>
      <td>${pkmnData.stats[2]}</td>
      <td>${pkmnData.stats[3]}</td>
      <td>${types}</td>
      <td>${move}</td>
      <td>${abilities}</td>
    </tr>`;
    
    html_select += `<option value="${pkmnIndex}">${name}</option>`;
  });
  $('.p-result tbody').html(html_table);
  $('.p-result').tablesorter();
  
  $('.p-page--2 .p-page__control').html(`<select class="form-control p-pokemon-selector">${html_select}</select>`);
  
  $('.p-pokemon-selector').change(function(){ pmBase.url.setHash(this.value); });
}

function getBuilding ( kuniIndex, encIndex ) {
  let buildingIndex = encounterBuildings[kuniIndex][encIndex];
  let buildingData = buildingDataArray[buildingIndex];
  let icon = pmBase.sprite.get( 'building', buildingData.icon1 );
  let name = textDict.buildings[buildingIndex];
  return `${icon}<br><small>${name}</small>`;
}

function showPokemon( pkmnIndex ){
  let pkmnData = pokemonDataArray[pkmnIndex];
  if ( !pkmnData ) return;
  
  let html = '';
  
  let habitat = NBNG.hex2bln( pkmnData.habitat,17*2 ).reverse();
  let html_habitat = '';
  for ( let i=0;i<=16;i++ ) {
    let s1 = habitat[i*2], s2 = habitat[i*2+1];
    if ( s1 + s2 === 0 ) continue;
    let b1 = s1 ? getBuilding( i, 0 ) : '';
    let b2 = s2 ? getBuilding( i, 1 ) : '';
    let icon = pmBase.sprite.get( 'kuni', i );
    html_habitat += `<tr><td>${icon}</td><td>${textDict.kuni[i]}</td><td>${b1}</td><td>${b2}</td>`;
    for ( let j=0;j<=10;j++ ) {
      html_habitat += `<td>${scenarioDataArray[j].appearPokemon[pkmnIndex]?scenarioText[j]:''}</td>`; //\u2713
    }
    html_habitat += `</tr>`;
  }
  if ( html_habitat ) html += `
    <h3>栖息地</h3>
    <table class="table table-sm text-center">
      <thead>
        <tr>
          <th>图标</th>
          <th>国</th>
          <th colspan="2">设施</th>
          <th colspan="11" style="width: 50%;">剧本</th>
        </tr>
      </thead>
      <tbody>${html_habitat}</tbody>
    </table>`;
  
  html +='<h3>最大连接的武将</h3>';
  html += '<div class="row text-center">';
  $.each( bushoLinkDataArray, function( bushoIndex, v ) {
    let bushoData = bushoDataArray[bushoIndex];
    if ( bushoData.rank == 0 ) return;
    let icon = pmBase.sprite.get('busho_o',bushoData.icon);
    let href = pmBase.url.createUrlHash( 'busho', bushoIndex );
    let link = v[pkmnIndex];
    link = link == 0 ? '--' : `<span style="color:rgb(${218},${165*link/100},${32*link/100});">${link}%</span>`;
    let name = textDict.warriors[bushoIndex];
    
    html += `<div class="col-3 col-md-2 col-lg-1 m-1">
      <div>${icon}</div>
      <div><a href="${href}">${name}</a> <sup>${rankText[bushoData.rank]}</sup></div>
      <div>${link}</div>
    </div>`;
  });
  html += '</div>';
  
  $('.p-page--2 .p-page__body').html(html);
  $('.p-pokemon-selector').val(pkmnIndex);
  
  return true;
} 

pmBase.hook.on( 'init', function(){
  init();
  pmBase.page.listen( showPokemon );
});
