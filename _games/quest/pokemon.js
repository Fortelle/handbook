import quest from './core.js';
import pokemonData from './data/pokemondata.js';
import moveDataArray from './data/movedata.js';

function init(){
	let html = '';
	for ( let i = 1; i<pokemonData.length; i ++ ) {
		let pi = `00${i}`.slice(-3);
		let name = pmBase.common.getPokemonName(i);
		html += `<option value="${i}">#${pi} ${name}</option>`;
	}
	
	pmBase.content.buildLayout({
	  pages: 1,
	  control1: html,
	  content1: selectPokemon,
	});
}

function selectPokemon( pi ){
	let data = pokemonData[pi];
	if ( !data ) return;
	let name = pmBase.common.getPokemonName(pi);
	let html1 = '', html2 = '';
	let icon = pmBase.sprite.get('pokemon',data.monsterNo);
	let infoData = [
	  [ '属性', pmBase.content.create('type',data.type1,data.type2) ],
	  [ 'HP', data.hpBasis ],
	  [ 'Atk', data.attackBasis ],
	  [ '攻击方式', data.isMelee?'近战':'远程' ],
  ];
  
	let listData = data.skillIDs
	  .map( skillIndex => moveDataArray[skillIndex])
	  .map( skillData => [
	    pmBase.sprite.get('skill', skillData.icon, 32),
	    `<a href="${pmBase.url.getHref('move', skillData.index )}">${skillData.name}</a>`,
	    pmBase.content.create('type', skillData.type),
	    Math.round(skillData.damage * 100),
	    skillData.charge,
	    skillData.desc,
	  ]);
	  
	
  let html = `
<h3>宝可梦数据</h3>
${pmBase.content.create('info', infoData, icon)}
<h3>招式</h3>
${pmBase.content.create('list', listData)}
`;

	return html;
}

pmBase.hook.on( 'load', init );