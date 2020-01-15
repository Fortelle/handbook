import './core.js';
import pokemonDataArray from './data/pokemondata.js';
import moveDataArray from './data/movedata.js';
import enemyDataArray from './data/enemydata.js';

function init() {
  let htmlSelect = '';
  let listData = [];
  
  moveDataArray.forEach( (moveData, moveIndex) => {
    if ( moveData.name.length == 0 ) return;
    htmlSelect += `<option value="${moveIndex}">${moveData.name}</option>`;
    listData.push([
      pmBase.sprite.get('skill',moveData.icon),
      `<a href="${pmBase.url.getHref(moveIndex)}">${moveData.name}</a>`,
      moveData.desc,
    ]);
  });
  
  let listHead = ['图标','招式','说明'];
  
  pmBase.content.build({
    pages: [{
      content: pmBase.content.create('list',listData, listHead, 'sortable'),
    },{
      content: selectMove,
      control: htmlSelect
    }],
  });
}

function selectMove( moveIndex ){
  moveIndex = ~~moveIndex;
  let moveData = moveDataArray[moveIndex];
  let infoIcon = pmBase.sprite.get('skill',moveData.icon) + '<br>' + moveData.name;
  let infoData = [
    [ '属性', pmBase.content.create('type',moveData.type) ],
    [ '攻击力', moveData.damage ],
    [ '等待时间', moveData.charge ],
    [ '说明', moveData.desc.replace(/。/g,'。<br>') ],
  ];
  
  let listData1 = pokemonDataArray
    .filter( x=>x.skillIDs.includes(moveIndex) )
    .map( pkmnData => [
      pmBase.sprite.get('pokemon',pkmnData.index,32),
      `<a href="${pmBase.url.getHref('pokemon', pkmnData.monsterNo)}">${pmBase.common.getPokemonName(pkmnData.index)}</a>`,
      pkmnData.hpBasis,
      pkmnData.attackBasis,
    ]);
    /*
  let listData2 = enemyDataArray
    .filter( x=>x.skillIDs.includes(moveIndex) )
    .map( pkmnData => [
      pmBase.sprite.get('pokemon',pkmnData.monsterNo,32),
      `<a href="${pmBase.url.getHref('pokemon', pkmnData.monsterNo)}">${pmBase.common.getPokemonName(pkmnData.monsterNo)}</a>`,
      pkmnData.hpBasis,
      pkmnData.attackBasis,
    ]);
    */
  let html = `
  <h3>招式</h3>
  ${pmBase.content.create('info', infoData, infoIcon)}
  <h3>宝可梦</h3>
  ${pmBase.content.create('list', listData1)}
  <h3>敌人</h3>
  `;
  /*
    let pi = key.split('.')[0];
    if ( ! eData[3].includes(i) ) return;
    html += `
        <tr>
          <td>${pmBase.sprite.get('quest-pokemon',pi,48)}</td>
          <td><a href="enemy/#!/${key}">${pmBase.util.getPokemonName(pi)}</a></td>
          <td>${eData[0]}</td>
          <td>${eData[1]}</td>
        </tr>
    `;
  });
  $('.c-moveData__enemy tbody').html( html );
  */
  return html;
}

pmBase.hook.on( 'load', init);