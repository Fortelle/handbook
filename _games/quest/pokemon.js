import quest from './core.js';
import pokemonData from './data/pokemondata.js';
import moveDataArray from './data/movedata.js';

function init(){
  pmBase.data.add('monsname', '../../swsh/text/monsname.json');
  pmBase.data.add('typename', '../../swsh/text/typename.json');

  pmBase.data.load(function() {

    let selector = {};
    for ( let i = 1; i<pokemonData.length; i ++ ) {
      let pi = `00${i}`.slice(-3);
      let name = pmBase.data.get("monsname",i);
      selector[pi] = `#${pi} ${name}`;
    }
    
    pmBase.content.build({
      pages: [{
        selector: selector,
        content: selectPokemon,
      }],
    });

  });
}

function selectPokemon( hash ){
  let pi = parseInt(hash.value, 10);
  let data = pokemonData[pi];
  if ( !data ) return;
  let name = pmBase.common.getPokemonName(pi);
  
  let info = pmBase.content.create({
    type: 'info',
    image: pmBase.sprite.get('pokemon',data.monsterNo),
    columns: ['天气', '等级' ],
    list: [
      [ '属性', pmBase.data.get("typename",data.type1) + '+' + pmBase.data.get("typename",data.type2) ],
      [ 'HP', data.hpBasis ],
      [ 'Atk', data.attackBasis ],
      [ '攻击方式', data.isMelee?'近战':'远程' ],
    ],
    card: true,
  });

  let listData = data.skillIDs
    .map( skillIndex => moveDataArray[skillIndex])
    .map( skillData => [
      pmBase.sprite.get('skill', skillData.icon, 32),
      `<a href="${pmBase.url.getHref('move', skillData.index )}">${skillData.name}</a>`,
      pmBase.data.get("typename",skillData.type),
      Math.round(skillData.damage * 100),
      skillData.charge,
      skillData.desc,
    ]);
    

  let list = pmBase.content.create({
    type: 'list',
    list: listData,
    card: true,
  });
  
  let html = `
<h3>宝可梦数据</h3>
${info}
<h3>招式</h3>
${list}
`;

  return {
    content: html,
  };
}

pmBase.hook.on( 'load', init );