import poketoru from './core.js';
import skillDataArray from './data/skills.js';
import { maxPowerArray, maxExpArray,megaEvolutionDict } from './data/misc.js';

function init(){
  let htmlSelect='';
  Object.keys( poketoru.pokemonList )
    .map( pkmnID => poketoru.getPokemonData( pkmnID ) )
    .sort(function(pkmn1, pkmn2) {
      return pkmn1.dex - pkmn2.dex || pkmn1.form - pkmn2.form;
    })
    .forEach( pkmnData => {
      let dex = pkmnData.dex.toString().padStart(3,0);
      let name = poketoru.getPokemonFullname(pkmnData);
      htmlSelect += `<option value="${pkmnData.id}">#${dex} ${name}</option>`;
    });

  pmBase.content.build({
    pages: [{
        control: htmlSelect,
        content: onHash,
    }],
  });
}

function onHash( pkmnId ) {
  let pkmnData = poketoru.getPokemonData(pkmnId);
  if ( !pkmnData ) {
    let megaData = poketoru.getMegaData(pkmnId);
    if ( !megaData ) return;
    pkmnId = megaData.originID;
    pkmnData = poketoru.getPokemonData(pkmnId);
  }
  let html = '';
  
  let info = [
    ['宝可梦', poketoru.getPokemonFullname(pkmnData) ],
    ['属性', pmBase.content.create('type',pkmnData.type) ],
    ['最大等级提升', pmBase.sprite.get( 'item', 10, 20 ) + pkmnData.rml ],
    ['攻击力', maxPowerArray[pkmnData.group][1] + ' - ' + maxPowerArray[pkmnData.group][pkmnData.rml+10] ],
  ];
  html+='<h3>属性</h3>';
  html+=pmBase.content.create('info', info);
  
  if ( pkmnId in megaEvolutionDict ) {
    html+='<h3>超级进化</h3>';
    megaEvolutionDict[pkmnData.id].forEach( function( megaID ) {
      let megaData = poketoru.getMegaData(megaID);
      let info2 = [
        ['宝可梦', poketoru.getPokemonFullname(megaData) ],
        ['属性', pmBase.content.create('type',megaData.type) ],
        ['超级进化效果', poketoru.getMegaEffect(megaData) ],
      ];
        
      html+=pmBase.content.create('info', info2);
    });
  }
  
  
  html+='<h3>能力</h3>';
  pkmnData.skills.filter(x=>x>0).forEach( skillID=>{
    let sData = skillDataArray[skillID];
    let rates = sData.rate.map( x => x + '%' ).join(' / ');
    let growthRate   = '<td></td><td></td><td></td><td></td>',
        growthDamage = '<td></td><td></td><td></td><td></td>';
    if ( sData.type == 1 ) {
      growthRate = sData.growth.map( x => `<td>+${x}%</td>` ).join('');
    } else {
      growthDamage = sData.growth.map( x => `<td>×${x}</td>` ).join('');
    };
		let url = pmBase.url.getHref( 'dex', { skill: skillID } );
    html += `<table class="table  table-sm  text-center" style="table-layout:fixed;">
      <thead>
        <th style="width:30%;"><a href="${url}">${sData.name}</a></th>
        <th colspan="5">${sData.desc}</th>
      </thead>
      <tbody>
        <tr>
          <td>发动几率</td>
          <td>${rates}</td>
          ${growthRate}
        </tr>
        <tr>
          <td>伤害倍率</td>
          <td>${sData.damage}</td>
          ${growthDamage}
        </tr>
        <tr>
          <td>升级经验</td>
          <td>-</td>
          <td>${sData.exp[0]}</td>
          <td>${sData.exp[1]}</td>
          <td>${sData.exp[2]}</td>
          <td>${sData.exp[3]}</td>
        </tr>
      </tbody>
    </table>`;
  });
  
  let listHeader = '<tr><th>等级</th><th>攻击力</th><th>下一级经验值</th><th>总计经验值</th></tr>';
  let listBody = '';
  let sum = 0;
  for( let i = 1; i<= pkmnData.rml+10; i++ ) {
    listBody += `<tr>
      <td>${i}</td>
      <td>${maxPowerArray[pkmnData.group][i]}</td>
      <td>${i==pkmnData.rml+10?'-':maxExpArray[pkmnData.group][i]}</td>
      <td>${i==1?'-':sum}</td>
    </tr>`;
    sum+=maxExpArray[pkmnData.group][i];
  }
  html+='<h3>升级</h3>';
  html+=pmBase.content.create('list', listBody, listHeader);
  
  return html;
}


pmBase.hook.on( 'load', init );