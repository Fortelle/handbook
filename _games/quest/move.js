import './core.js';
import pokemonData from './data/pokemondata.js';
import moveData from './data/movedata.js';
import enemyData from './data/enemydata.js';

function fillSelector(){
	let html = '';
	$.each( moveData, function( i, data ){
		if ( data.name.length == 0 ) return;
		html += `<option value="${i}">${data.name}</option>`;
	});
	$('.c-moveSelector').html(html);
	
	$('.c-moveSelector').change(function(){
		selectMove( $('.c-moveSelector').val() )
	});
}

function parseHash(){
	let i = pmBase.hash.get();
	if ( i.length == 0 ) i = $('.c-moveSelector option:first').val();
	$('.c-moveSelector').val(i);
	selectMove(i);
}

function selectMove( i ){
	pmBase.hash.set(i);
	showMove( i );
}

function showMove( i ){
	i = parseInt(i,10);
	let mData = moveData[i];
	let html = '';
	$.each( pokemonData, function( pi, pData ) {
		if ( ! pData.skillIDs.includes(i) ) return;
		html += `
				<tr>
					<td>${pmBase.sprite.get('quest-pokemon',pi,48)}</td>
					<td>${pmBase.url.createAnchor('quest-pokemon',pi,pmBase.util.getPokemonName(pi))}</td>
					<td>${pData.hpBasis}</td>
					<td>${pData.attackBasis}</td>
				</tr>
		`;
	});
	$('.c-moveData__pokemon tbody').html( html );
	
	html = '';
	$.each( enemyData, function( key, eData ) {
		let pi = key.split('.')[0];
		if ( ! eData[3].includes(i) ) return;
		html += `
				<tr>
					<td>${pmBase.sprite.get('quest-pokemon',pi,48)}</td>
					<td><a href="enemy/#!/${key}">${pmBase.util.getPokemonName(pi)}</a></td>
					<td>${eData[0]}</td>
					<td>${eData[1]}</td>
				</tr>
		`;
	});
	$('.c-moveData__enemy tbody').html( html );
	
}

pmBase.hook.on( 'init', function(){
	fillSelector();
	parseHash();
	pmBase.hash.popstate( parseHash );
});