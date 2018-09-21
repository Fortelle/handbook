import poketoru from './core.js';
import popover from './popover.js';

function init() {
	let tbody = '';
  let list = '';
  let sumMSU = 0;
  
  Object.keys( poketoru.megaList )
    .map( megaID => poketoru.getMegaData(megaID) )
    .sort(function(pkmn1, pkmn2) {
      return pkmn1.dex - pkmn2.dex || pkmn1.form - pkmn2.form;
    })
    .forEach( megaData => {
      let pkmnData = poketoru.getPokemonData(megaData.originID);
      sumMSU += megaData.msu;
      list += `<tr>
  		  <td>${ poketoru.getPokemonIcon( pkmnData ) + '=>' + poketoru.getPokemonIcon( megaData ) }</td>
        <td>${ megaData.dex.toString().padStart(3,0) }</td>
        <td><a href="${pmBase.url.getHref( 'pokemon', megaData.id )}">${megaData.name}</a></td>
        <td>${ pmBase.content.create('type',megaData.type) }</td>
        <td>${ poketoru.getAttack( pkmnData.group, 1 )} - ${poketoru.getAttack( pkmnData.group, pkmnData.rml + 10 ) }</td>
        <td class="text-left">${ poketoru.getMegaEffect(megaData) }</td>
        <td data-text="${megaData.ms - megaData.msu}">${megaData.ms} - ${megaData.msu} = ${megaData.ms - megaData.msu}</td>
      </tr>`;
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
  pmBase.content.build({
    pages: 1,
    content1: pmBase.content.create('sortlist',list,header)
  });
	popover.apply();
};


pmBase.hook.on( 'load', init );