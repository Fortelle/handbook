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

function init(){
  let listData = [], html_select = '';
  
  bushoDataArray.forEach( function( bushoData, bushoIndex ) {
    let icon = pmBase.sprite.get('busho_o',bushoData.icon);
    let name = textDict.warriors[bushoIndex];
    let link = pmBase.url.getHref( bushoIndex );
    let types = pmBase.content.create('type',bushoData.types[0], bushoData.types[1] );
    let power = textDict.powers[bushoData.power];
    
    listData.push([
      icon,
      `<a href="${link}">${name}</a> <sup>${rankText[bushoData.rank]}</sup>`,
      types,
      power,
      bushoData.stats[0],
      bushoData.stats[1],
      bushoData.stats[2],
      bushoData.stats[3],
    ]);
    
    html_select += `<option value="${bushoIndex}">${name}</option>`;
  });
  let listHead = [
    '图标',
    '武将',
    '擅长属性',
    '武将之力',
    '力量',
    '智力',
    '魅力',
    '才量',
	];
	
  pmBase.content.build({
    pages: [{
      content: pmBase.content.create('sortlist',listData,listHead),
    },{
      content: showBusho,
      control: html_select
    }],
  });
}


function getBuilding ( kuniIndex, encIndex ) {
  let buildingIndex = encounterBuildings[kuniIndex][encIndex];
  let buildingData = buildingDataArray[buildingIndex];
  let icon = pmBase.sprite.get( 'building', buildingData.icon1 );
  let name = textDict.buildings[buildingIndex];
  return `${icon}<br><small>${name}</small>`;
}

function showBusho( bushoIndex ){
  let bushoData = bushoDataArray[bushoIndex];
  let icon = pmBase.sprite.get('busho_o',bushoData.icon);
  let name = textDict.warriors[bushoIndex];
  let types = pmBase.content.create('type',bushoData.types[0],bushoData.types[1] );
  let power = textDict.powers[bushoData.power];
  let bestPokemon = '';
  
  let listPokemonData = bushoLinkDataArray[bushoIndex].map( (maxLink, pkmnIndex) => {
    let pkmnData = pokemonDataArray[pkmnIndex];
    let pkmnIcon = pmBase.sprite.get('pokemon',pkmnIndex);
    if ( maxLink == 100 ) bestPokemon += pkmnIcon;
    return [
      pkmnIcon,
      `<a href="${pmBase.url.getHref( 'pokemon', pkmnIndex )}">${textDict.pokemon[pkmnIndex]}</a></sup>`,
      pmBase.content.create('type',pkmnData.types[0],pkmnData.types[1] ),
      pkmnData.stats[0],
      pkmnData.stats[1],
      pkmnData.stats[2],
      pkmnData.stats[3],
      pkmnData.movement,
      textDict.moves[pkmnData.move],
      pkmnData.abilities.filter(a=>a>-1).map( a=> textDict.abilities[a] ).join('/'),
      `<span style="color:rgb(${218},${165*maxLink/100},${32*maxLink/100});font-weight:bold;">${maxLink}%</span>`,
    ];
  });
  let listPokemonHead=[
		'图标',
		'宝可梦',
		'属性',
		'HP',
		'攻击力',
		'防御力',
		'速度',
		'移动',
		'招式',
		'特性',
		'最大连接',
  ];
  
  let infoData = [
    [ '名字', name ],
    [ '性别', '男女'[bushoData.gender] ],
    [ '属性', types ],
    [ '武将之力', textDict.powers[bushoData.power] ],
    [ '力量', bushoData.stats[0] ],
    [ '智力', bushoData.stats[1] ],
    [ '魅力', bushoData.stats[2] ],
    [ '才量', bushoData.stats[3] ],
    [ '最佳宝可梦', bestPokemon ],
  ];
  
  let listHabitatData = [];
  scenarioDataArray.forEach( function(scenData, scenIndex){
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
      listHabitatData.push([
        scenIndex,
        bushoIcon,
        bushoName,
        typeText[bushoInfo.type],
        kuniIcon,
        kuniName,
        pkmnIcon,
        pkmnName,
        ''
      ]);
    });
  });
  
  let listHabitatHead=[
		'剧本',
		'',
		'势力',
		'类型',
		'',
		'城池',
		'',
		'搭档宝可梦',
		'默认连接',
  ];
  
  let html = `
<h3>基本资料</h3>
${pmBase.content.create('info', infoData)}
<h3>栖息地</h3>
${pmBase.content.create('list', listHabitatData,listHabitatHead)}
<h3>最大连接的宝可梦</h3>
${pmBase.content.create('sortlist', listPokemonData,listPokemonHead, '[10,1]')}
`;

  return html;
} 

pmBase.hook.on( 'init', init );