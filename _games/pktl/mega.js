import poketoru from './core.js';
import popover from './popover.js';

function init() {
	let tbody = '';
  let list = [];
  
  Object.keys( poketoru.megaList )
    .map( megaID => poketoru.getMegaData(megaID) )
    .sort(function(pkmn1, pkmn2) {
      return pkmn1.dex - pkmn2.dex || pkmn1.form - pkmn2.form;
    })
    .forEach( megaData => {
      let pkmnData = poketoru.getPokemonData(megaData.originID);
      list.push( [
  		  poketoru.getPokemonIcon( pkmnData ) + '=>' + poketoru.getPokemonIcon( megaData ),
        megaData.dex.toString().padStart(3,0),
        `<a href="${pmBase.url.getHref( 'pokemon', megaData.id )}">${megaData.name}</a>`,
        pmBase.content.create('type',megaData.type),
        `${poketoru.getAttack( pkmnData.group, 1 )} - ${poketoru.getAttack( pkmnData.group, pkmnData.rml + 10 )}`,
        poketoru.getMegaEffect(megaData),
        `${megaData.ms} - ${megaData.msu} = ${megaData.ms - megaData.msu}`,
      ]);
    });
  
  let header = [
    '图标',
    '编号',
    '宝可梦',
    '属性',
    '攻击力',
    '超级效果',
    '进化速度',
  ];
  pmBase.content.setContent( pmBase.content.create('list',list,header), 0 );
	popover.apply();
};


pmBase.hook.on( 'load', function(){
	init();
});