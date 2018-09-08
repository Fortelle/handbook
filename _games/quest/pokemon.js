import quest from './core.js';
import pokemonData from './data/pokemondata.js';
import moveData from './data/movedata.js';

function init(){
	let html = '';
	for ( let i = 1; i<pokemonData.length; i ++ ) {
		let pi = `00${i}`.slice(-3);
		let name = pmBase.util.getPokemonName(pi);
		html += `<option value="${i}">#${pi} ${name}</option>`;
	}
	pmBase.page.createSelector(html);
}

function selectPokemon( pi ){
	let data = pokemonData[pi];
	let name = pmBase.util.getPokemonName(pi);
	let html = '';
	
	
	$.each( data.skillIDs, function( i, skillID ) {
		let sData = moveData[skillID];
		html += `
				<tr>
					<td>${pmBase.sprite.get('skill',sData.icon)}</td>
					<td><a href="${pmBase.url.createUrlHash('move', skillID )}">${sData.name}</a></td>
					<td>${sData.desc}</td>
					<td>${Math.round(sData.damage * 100)}</td>
					<td>${sData.charge}</td>
				</tr>
		`;
	});
	$('.c-pkmnData__skills tbody').html( html );
	
	let types = pmBase.page.create('type',data.type1,data.type2);

	html = `
    <table class="table table-sm">
    <tr><th>图标</th><td>${pmBase.sprite.get('pokemon',data.monsterNo)}</td></tr>
    <tr><th>属性</th><td>${types}</td></tr>
    <tr><th>HP</th><td>${data.hpBasis}</td></tr>
    <tr><th>Atk</th><td>${data.attackBasis}</td></tr>
    <tr><th>攻击方式</th><td>${data.isMelee?'近战':'远程'}</td></tr>
    </table>`;
	$('.p-pkmnData__info').html( html );
  
	return true;
}

pmBase.hook.on( 'init', function(){
	init();
	pmBase.page.listen( selectPokemon );
});