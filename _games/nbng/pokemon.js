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
  let listData = [], html_select = '';
  
  pokemonDataArray.forEach( (pkmnData,pkmnIndex) => {
    let pkmnIcon = pmBase.sprite.get('pokemon',pkmnIndex);
    let pkmnName = textDict.pokemon[pkmnIndex];
    
    listData.push([
      pkmnIcon,
      `<a href="${pmBase.url.getHref( pkmnIndex )}">${pkmnName}</a>`,
      pmBase.content.create('type',pkmnData.types[0],pkmnData.types[1] ),
      pkmnData.stats[0],
      pkmnData.stats[1],
      pkmnData.stats[2],
      pkmnData.stats[3],
      pkmnData.movement,
      textDict.moves[pkmnData.move],
      pkmnData.abilities.filter(a=>a>-1).map( a=> textDict.abilities[a] ).join('/'),
    ]);
    
    html_select += `<option value="${pkmnIndex}">${pkmnName}</option>`;
  });
    let listHead = [
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
    ];
  
  pmBase.content.build({
    pages: 2,
    content1: pmBase.content.create('sortlist',listData,listHead),
    control2: html_select,
    content2: showPokemon,
  });
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
  let habitat = NBNG.hex2bln( pkmnData.habitat,17*2 ).reverse();
  
  let listHabitatData = [];
  for ( let i=0;i<=16;i++ ) {
    let s1 = habitat[i*2], s2 = habitat[i*2+1];
    if ( s1 + s2 === 0 ) continue;
    let b1 = s1 ? getBuilding( i, 0 ) : '';
    let b2 = s2 ? getBuilding( i, 1 ) : '';
    listHabitatData.push([
      pmBase.sprite.get( 'kuni', i ),
      textDict.kuni[i],
      b1,
      b2,
      ...scenarioDataArray.map((x,j)=>x.appearPokemon[pkmnIndex]?scenarioText[j]:'')
    ]);
  }
  
  let listBushoData = bushoLinkDataArray.map( (linkArray, bushoIndex) => {
    let bushoData = bushoDataArray[bushoIndex];
    let icon = pmBase.sprite.get('busho_o',bushoData.icon);
    let name = textDict.warriors[bushoIndex];
    let link = pmBase.url.getHref( 'busho', bushoIndex );
    let types = pmBase.content.create('type',bushoData.types[0], bushoData.types[1] );
    let power = textDict.powers[bushoData.power];
    return [
      icon,
      `<a href="${link}">${name}</a> <sup>${rankText[bushoData.rank]}</sup>`,
      types,
      power,
      bushoData.stats[0],
      bushoData.stats[1],
      bushoData.stats[2],
      bushoData.stats[3],
      linkArray[pkmnIndex]
    ];
  });
  let listBushoHead = [
    '图标',
    '武将',
    '擅长属性',
    '武将之力',
    '力量',
    '智力',
    '魅力',
    '才量',
		'最大连接',
	];
	
  let listHabitatHead=[
		'图标',
		'城池',
		'设施1',
		'设施2',
		...Array.from({length: 11}, (v, i) => `剧本${i}`),
		//...[...Array(11)].map((x,i)=>`剧本${i}`)
  ];
  
  let html = `
<h3>栖息地</h3>
${pmBase.content.create('list', listHabitatData,listHabitatHead)}
<h3>最大连接的武将</h3>
${pmBase.content.create('sortlist', listBushoData,listBushoHead,"[8,1]")}
  `;
  return html;
} 

pmBase.hook.on( 'init', init);
