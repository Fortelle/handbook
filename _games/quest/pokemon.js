import quest from './core.js';
import pokemonData from './data/pokemondata.js';
import moveData from './data/movedata.js';

function fillSelector(){
	let html = '';
	for ( let i = 1; i<pokemonData.length; i ++ ) {
		let pi = `00${i}`.slice(-3);
		let name = pmBase.util.getPokemonName(pi);
		html += `<option value="${i}">#${pi} ${name}</option>`;
	}
	$('.c-pkmnSelector').html(html);
	$('.c-pkmnSelector').change(function(){
		selectPokemon( $(this).val() )
	});
}

function parseHash(){
	let key = pmBase.hash.get();
	if ( key.length > 0 ) {
		$('.c-pkmnSelector').val(key);
		$('.c-pkmnSelector').trigger('change');
	}
}

function selectPokemon( pi ){
	pmBase.hash.set(pi);
	let data = pokemonData[pi];
	let name = pmBase.util.getPokemonName(pi);
	let html = '';
	$.each( data.skillIDs, function( i, skillID ) {
		let sData = moveData[skillID];
		html += `
				<tr>
					<td>${pmBase.sprite.get('quest-skill',sData.icon)}</td>
					<td>${pmBase.url.createAnchor('quest-move', skillID, sData.name)}</td>
					<td>${sData.desc}</td>
					<td>${Math.round(sData.damage * 100)}</td>
					<td>${sData.charge}</td>
				</tr>
		`;
	});
	$('.c-pkmnData__skills tbody').html( html );
	
}

pmBase.hook.on( 'init', function(){
	fillSelector();
	parseHash();
	pmBase.hash.popstate( parseHash );
});