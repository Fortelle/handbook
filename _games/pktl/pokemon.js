import poketoru from './core.js';
import skillData from './data/skills.js';
import { maxPower, maxExp } from './data/misc.js';

function fillSelector(){
  let html = '';
  $.each( poketoru.pokemonListByDex, function( i, data ) {
    html += `<option value="${data.id}">${data.name}</option>`;
  });
  
  $('.c-pktl-pokemon').html( html );
  $('.c-pktl-pokemon').change( function(){ changePokemon(this.value)} );
}

function parseHash(){
  let key = pmBase.hash.get();
  if ( key.length > 0 ) {
    $('.c-pktl-pokemon').val(key);
    $('.c-pktl-pokemon').trigger('change');
  }
}

function changePokemon( pkmnID ) {
  let pkmnData = poketoru.getPokemonData(pkmnID);
  let html = '';
  
  html = '';
  $.each( pkmnData.skills,function( i, skillID ) {
    let sData = skillData[skillID];
    let rates = sData.rate.map( x => x + '%' ).join(' / ');
    let growthRate   = '<td></td><td></td><td></td><td></td>',
        growthDamage = '<td></td><td></td><td></td><td></td>';
    if ( sData.type == 1 ) {
      growthRate = sData.growth.map( x => `<td>+${x}%</td>` );
    } else {
      growthDamage = sData.growth.map( x => `<td>×${x}</td>` );
    };
    html += `<table class="table text-center">
      <thead>
        <th>${sData.name}</th>
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
  $('.c-pktl-skills').html( html );
  
  html = '';
  for( let i = 1; i<= pkmnData.maxLevel; i++ ) {
    html += `<tr>
      <td>${i}</td>
      <td>${maxPower[pkmnData.group][i]}</td>
      <td>${maxExp[pkmnData.group][i] || ''}</td>
    </tr>`;
  }
  $('.c-pktl-levels tbody').html( html );
}


pmBase.hook.on( 'init', function(){
  fillSelector();
  parseHash();
});