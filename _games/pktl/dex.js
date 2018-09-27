// TODO: change to default hash paser.

import poketoru from './core.js';
import skillDataArray from './data/skills.js';
import { typeEffectArray } from './data/misc.js';

let superEffects = [];
let typePokemonCount = [];
let sePokemonCount = [];
let typeNames = pmBase.config.get('typenames');
let sortedSkillList = skillDataArray.slice().sort( (a, b) => a.order - b.order );

function init(){
  
	for(var i=0;i<18;i++ ){
		superEffects[i]=[];
		typePokemonCount[i]=0;
		sePokemonCount[i]=0;
		for(var j=0;j<18;j++ ){
			if( typeEffectArray[j][i]==2 ) superEffects[i].push(j);
		}
	}
	
  let htmlSelect = `
  <div class="form-row">
    <div class="col-6">
      <select class="form-control p-selector p-select-type">
        <option value="-1">-</option>
        ${ typeNames.map( (n,i)=> `<option value="${i}">${n}</option>` ).join('') }
        ${ typeNames.map( (n,i)=> `<option value="${i+100}">克制${n}</option>` ).join('') }
      </select>
    </div>
    <div class="col-6">
      <select class="form-control p-selector p-select-skill">
        <option value="-1">-</option>
        ${ sortedSkillList.map( (v,i)=> `<option value="${v.index}">${v.name}</option>` ).join('') }
      </select>
    </div>
  </div>`;
  
  let htmlHead = `<tr>
    <th style="width:12%;">编号</th>
    <th style="width:12%;">图标</th>
    <th style="width:20%;">宝可梦</th>
    <th style="width:12%;">属性</th>
    <th style="width:12%;">攻击力</th>
    <th style="width:12%;">最大等级提升</th>
    <th style="width:20%;">初始能力</th>
  </tr>`;
  let htmlMain = pmBase.content.create('list', [], htmlHead, 'p-result' );
  /*
  pmBase.content.build({
    pages: 1,
    control1: html,
    content1: filter,
    hashParser: hashParser,
    trigger: '.p-selector'
  });
  */
  pmBase.content.build({
    pages: [
      {
        control: htmlSelect,
        content: htmlMain,
      }
    ],
    hashParser: hashParser,
  });
  
	$('.p-result').tablesorter();
  $('.p-selector').change( filter );
  
}

function hashParser( hashValue ){
  if ( hashValue === '' ) return;
  if ( hashValue.includes('/') ) {
    let [ key, value ] = hashValue.split('/');
    if ( key === 'type' ) $('.p-select-type').val(value);
    if ( key === 'skill' ) $('.p-select-skill').val(value);
    filter()
  }
}

function filter() {
  let sort = ~~$('.p-select-sort').val();
  let selectedType = ~~$('.p-select-type').val();
  let selectedSkill = ~~$('.p-select-skill').val();
  let selectedPower = -1;
  let selectedRml = -1;
  let isSuperEffect = selectedType >= 100;
  if ( isSuperEffect ) {
    selectedType -= 100;
    var se = superEffects[selectedType];
  }
  var tbody = '';
  var result = [];
  Object.keys( poketoru.pokemonList ).forEach( pkmnID => {
    let pkmn = poketoru.getPokemonData(pkmnID);
    if ( isSuperEffect ) {
      if ( !se.includes(pkmn.type) ) return;
    } else {
      if ( selectedType >= 0 && pkmn.type != selectedType ) return;
    }
		if ( selectedSkill > 0 && !pkmn.skills.includes(selectedSkill) ) return;
		
		let maxAttack = poketoru.getAttack( pkmn.group, pkmn.rml + 10 );
		let basicAttack = poketoru.getAttack( pkmn.group, 1 );
    tbody += `
      <tr>
        <td>${pmBase.sprite.get('pokemon',pkmn.icon,48)}</td>
        <td>${pkmn.dex}</td>
        <td><a href="${pmBase.url.getHref( 'pokemon', pkmnID )}">${pkmn.name}</a></td>
        <td data-text="${pkmn.type}">${pmBase.content.create('type',pkmn.type)}</td>
        <td data-text="${maxAttack}">${basicAttack} - ${maxAttack}</td>
        <td>${pkmn.rml}</td>
        <td>${pkmn.skills.filter(x=>x).map( s => skillDataArray[s].name ).join('<br>')}</td>
      </tr>
    `;
  });
  
  if ( result.length > 500 ) return;
  /*
  $.each( poketoru.pokemonList, function( pkmnID, pkmnIndex ) {
    let pkmn=poketoru.getPokemonData(pkmnIndex);
    if ( isSuperEffect ) {
      if ( !se.includes(pkmn.type) ) return;
    } else {
      if ( selectedType >= 0 && pkmn.type != selectedType ) return;
    }
		if ( selectedSkill > 0 && !pkmn.skills.includes(selectedSkill) ) return;
    result.push(pkmn);
  });
  
  
  if ( sort == 1 ) {
    result.sort(function(pkmn1, pkmn2) {
      return pkmn2.maxLevel - pkmn1.maxLevel;
    });
  } else if ( sort == 2 ) {
    result.sort(function(pkmn1, pkmn2) {
      return pkmn2.maxPower - pkmn1.maxPower;
    });
  } else if ( sort == 3 ) {
    result.sort(function(pkmn1, pkmn2) {
      return pkmn1.type - pkmn2.type;
    });
  }
  $.each( result, function( i, pkmn ) {
    let pkmnID = pkmn.id;
    let pkmnNumber = pkmnID.split('.')[0];
    let pkmnSkill = '';
    let maxPower = 0;
    let skills = pkmn.skills.filter(x=>x).map( s => skillDataArray[s].name ).join('<br>');
		let url = pmBase.url.getHref( 'pokemon', pkmnID );
    tbody += `
      <tr>
        <td>${pmBase.sprite.get('pokemon',pkmn.icon,48)}</td>
        <td>${pkmn.dex}</td>
        <td><a href="${url}">${pkmn.name}</a></td>
        <td>${pmBase.content.create('type',pkmn.type)}</td>
        <td>${ poketoru.getAttack( pkmn.group, 1 )} - ${poketoru.getAttack( pkmn.group, pkmn.rml + 10 ) }</td>
        <td>${pkmn.rml}</td>
        <td>${skills}</td>
      </tr>
    `;
  });
  let head = '<tr><th>编号</th><th>图标</th><th>宝可梦</th><th>属性</th><th>攻击力</th><th>最大等级提升</th><th>初始能力</th></tr>';
  let html = pmBase.content.create('list',tbody,head);
  */
  
  
  $('.p-result tbody').html( tbody );
  $('.p-result').trigger("update");
  // return html;
};

pmBase.hook.on( 'load', init );