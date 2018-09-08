import NBNG from './core.js'
import pokemonDataArray from './data/pokemon.js';
import bushoDataArray from './data/busho.js';
import bushoLinkDataArray from './data/busholinks.js';
import textDict from './data/text.js';
import scenarioDataArray from './data/scenario.js';
import { buildingDataArray, encounterBuildings } from './data/building.js';

const stars = ['','★','★★','★★★','★★★★','★★★★★'];
const rankText = ['','I','II','III'];
const typeText = ['武将首领','武将','自由武将','','稀有武将'];


function getBuilding ( kuniIndex, encIndex ) {
  let buildingIndex = encounterBuildings[kuniIndex][encIndex];
  let buildingData = buildingDataArray[buildingIndex];
  let icon = pmBase.sprite.get( 'building', buildingData.icon1 );
  let name = textDict.buildings[buildingIndex];
  return `${icon}<br><small>${name}</small>`;
}
function init(){
  let html_table = '', html_select = '';
  
  $.each( bushoDataArray, function( bushoIndex, bushoData ) {
    let icon = pmBase.sprite.get('busho_o',bushoData.icon);
    let name = textDict.warriors[bushoIndex];
    let link = pmBase.url.createUrlHash( bushoIndex );
    let types = pmBase.page.create('type',bushoData.types[0], bushoData.types[1] );
    let power = textDict.powers[bushoData.power];
    
    html_table += `<tr>
      <td>${icon}</td>
      <td><a href="${link}">${name}</a> <sup>${rankText[bushoData.rank]}</sup></td>
      <td>${types}</td>
      <td>${power}</td>
      <td>${bushoData.stats[0]}</td>
      <td>${bushoData.stats[1]}</td>
      <td>${bushoData.stats[2]}</td>
      <td>${bushoData.stats[3]}</td>
    </tr>`;
    html_select += `<option value="${bushoIndex}">${name}</option>`;
  });
  $('.p-result tbody').html(html_table);
  $('.p-result').tablesorter();
  $('.p-page--2 .p-page__control').html(`<select class="form-control p-selector">${html_select}</select>`);
}


function showBusho( bushoIndex ){
  let bushoData = bushoDataArray[bushoIndex];
  let icon = pmBase.sprite.get('busho_o',bushoData.icon);
  let name = textDict.warriors[bushoIndex];
  let types = pmBase.page.create('type',bushoData.types[0],bushoData.types[1] );
  let power = textDict.powers[bushoData.power];
  let link = bushoLinkDataArray[bushoIndex];
  
  let html = '';
  
  html += `
    <h3>基本资料</h3>
    <table class="table table-sm">
    <tr><th>名字</th><td>${name}</td></tr>
    <tr><th>性别</th><td>${'男女'[bushoData.gender]}</td></tr>
    <tr><th>属性</th><td>${types}</td></tr>
    <tr><th>武将之力</th><td>${textDict.powers[bushoData.power]}</td></tr>
    <tr><th>力量</th><td>${bushoData.stats[0]}</td></tr>
    <tr><th>智力</th><td>${bushoData.stats[1]}</td></tr>
    <tr><th>魅力</th><td>${bushoData.stats[2]}</td></tr>
    <tr><th>才量</th><td>${bushoData.stats[3]}</td></tr>
    </table>`;
  
  
  
  
  let html_habitat = '';
  scenarioDataArray.forEach( function(scenData, scenIndex){
    let seiryoku = [];
    scenData.busho.forEach( function(bushoInfo){
      if ( bushoInfo.bushoIndex != bushoIndex ) return;
      let kuniIcon = pmBase.sprite.get('kuni', bushoInfo.kuni );
      let kuniName = textDict.kuni[bushoInfo.kuni];
      let pkmnIcon = pmBase.sprite.get('pokemon',bushoInfo.pkmnIndex);
      let pkmnName = textDict.pokemon[bushoInfo.pkmnIndex];
      if ( ! scenData.seiryoku[bushoInfo.seiryoku] ) {
        var bushoIcon = '';
        var bushoName = '无所属';
      } else {
        var seiryokuLeader = NBNG.specialBushoList[scenData.seiryoku[bushoInfo.seiryoku][1]];
        var bushoIcon = pmBase.sprite.get('busho_o',seiryokuLeader);
        var bushoName = textDict.warriors[seiryokuLeader] + '军';
      }
      html_habitat += `<tr>
        <td>${scenIndex}</td>
        <td>${bushoIcon}</td>
        <td>${bushoName}</td>
        <td>${typeText[bushoInfo.type]}</td>
        <td>${kuniIcon}</td>
        <td>${kuniName}</td>
        <td>${pkmnIcon}</td>
        <td>${pkmnName}</td>
        <td>?</td>
      </tr>`;
    });
  });
  
  if ( html_habitat ) html += `
    <h3>栖息地</h3>
    <table class="table table-sm text-center">
      <thead>
        <tr>
          <th>剧本</th>
          <th colspan="2">势力</th>
          <th>类型</th>
          <th colspan="2">城池</th>
          <th colspan="2">搭档宝可梦</th>
          <th>默认连接</th>
        </tr>
      </thead>
      <tbody>${html_habitat}</tbody>
    </table>`;
    
  let sortedPokemonIndex = Array.from(link.keys()).sort((a, b) => link[b] - link[a]);
  
  let link_html = '';
  $.each( sortedPokemonIndex, function( i, pkmnIndex ) {
    let pkmnData = pokemonDataArray[pkmnIndex];
    let linkValue = link[pkmnIndex];
    if ( linkValue == 0 ) return;
    
    let icon = pmBase.sprite.get('pokemon',pkmnIndex);
    let name = textDict.pokemon[pkmnIndex];
    let types = pmBase.page.create('type',pkmnData.types[0],pkmnData.types[1] );
    let abilities = pkmnData.abilities.filter(a=>a>-1).map( a=> textDict.abilities[a] ).join('/');
    let move = textDict.moves[pkmnData.move];
    let movement = pkmnData.movement;
    let linkText = `<span style="color:rgb(${218},${165*linkValue/100},${32*linkValue/100});font-weight:bold;">${linkValue}%</span>`;
    
    link_html += `<tr>
      <td>${icon}</td>
      <td>${name}</td>
      <td>${types}</td>
      <td>${pkmnData.stats[0]}</td>
      <td>${pkmnData.stats[1]}</td>
      <td>${pkmnData.stats[2]}</td>
      <td>${pkmnData.stats[3]}</td>
      <td>${movement}</td>
      <td>${move}</td>
      <td>${abilities}</td>
      <td>${linkText}</td>
    </tr>`;
  });
  
  html += `
    <h3>最大连接</h3>
		<table class="card-body table table-sm table-hover text-center">
		  <thead>
			  <tr>
			    <th>图标</th>
			    <th>宝可梦</th>
			    <th>属性</th>
			    <th>HP</th>
			    <th>攻击力</th>
			    <th>防御力</th>
			    <th>速度</th>
			    <th>移动</th>
			    <th>招式</th>
			    <th>特性</th>
			    <th>最大连接</th>
			  </tr>
			</thead>
			<tbody>${link_html}</tbody>
    </table>
  `;
  
  $('.p-page--2 .p-page__body').html(html);
  $('.p-selector').val(bushoIndex);
  
  return true;
} 

pmBase.hook.on( 'init', function(){
  init();
  pmBase.page.listen( showBusho );
});