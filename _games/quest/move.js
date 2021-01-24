import './core.js';
import pokemonDataArray from './data/pokemondata.js';
import moveDataArray from './data/movedata.js';

function init(){
  pmBase.data.add('monsname', '../../swsh/text/monsname.json');
  pmBase.data.add('typename', '../../swsh/text/typename.json');

  pmBase.data.load(function() {

    let selector = {};
    let listData = [];
    
    moveDataArray.forEach( (moveData, moveIndex) => {
      if ( moveData.name.length == 0 ) return;
      selector[moveIndex] = moveData.name;
      listData.push([
        pmBase.sprite.get('skill',moveData.icon),
        `<a href="${pmBase.url.getHref(moveIndex)}">${moveData.name}</a>`,
        moveData.desc,
      ]);
    });
    
    let list = pmBase.content.create({
      type: 'list',
      column: ['图标','招式','说明'],
      list: listData,
      sortable: true,
      card: true,
    });
    pmBase.content.build({
      pages: [{
        content: list,
      },{
        selector: selector,
        content: selectMove
      }],
    });

  });
}




function selectMove( hash ){
  let moveIndex = ~~hash.value;
  let moveData = moveDataArray[moveIndex];
  
  let info = pmBase.content.create({
    type: 'info',
    image: pmBase.sprite.get('skill',moveData.icon),
    list: [
      [ '属性', pmBase.data.get("typename",moveData.type) ],
      [ '攻击力', moveData.damage ],
      [ '等待时间', moveData.charge ],
      [ '说明', moveData.desc.replace(/。/g,'。<br>') ],
    ],
    card: true,
  });



  let listData1 = pokemonDataArray
    .filter( x=>x.skillIDs.includes(moveIndex) )
    .map( pkmnData => [
      pmBase.sprite.get('pokemon',pkmnData.index,32),
      `<a href="${pmBase.url.getHref('pokemon', pkmnData.monsterNo)}">${pmBase.data.get("monsname",pkmnData.index)}</a>`,
      pkmnData.hpBasis,
      pkmnData.attackBasis,
    ]);
  let list1 = pmBase.content.create({
    type: 'list',
    list: listData1,
    card: true,
  });


  let html = `
  <h3>招式</h3>
  ${info}
  <h3>宝可梦</h3>
  ${list1}
  `;
  return {
    content: html,
  };
}

pmBase.hook.on( 'load', init);