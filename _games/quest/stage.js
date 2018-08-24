import './core.js';
import {stoneData, enemyData, moveData, enemyPack} from './enemy.loader.js';
import {enemyPackNames,stageData} from './data/stagedata.js';

let mode = 0;

function fillSelector(){
	if ( mode == 0 ) {
		
		let htmlStage = '';
		$.each( stageData, function( key, data ){
			let a = key.split('-');
			if ( a[0] == '12' ) return;
			htmlStage += `<option value="${key}">${key} ${enemyPackNames[key]}</option>`;
		});
		$('.c-stageSelector').html(htmlStage);
		
		$('.c-stageSelector').change(function(){
			selectStage( $('.c-stageSelector').val() )
		});
	} else {
		
		let htmlStage = '';
		$.each( stageData, function( key, data ){
			let a = key.split('-');
			if ( a[0] != 12 ) return;
			htmlStage += `<option value="${key}">${key} ${data[0]}</option>`;
		});
		$('.c-stageSelector').html(htmlStage);
		
		let htmlPack = '';
		$.each( enemyPackNames, function( key, name ){
			let a = key.split('-');
			if ( a[0] != 12 ) return;
			htmlPack += `<option value="${key}">#${key} ${name}</option>`;
		});
		$('.c-packSelector').html(htmlPack);
		
		$('.c-packSelector, .c-stageSelector').change(function(){
			selectStage( $('.c-stageSelector').val(), $('.c-packSelector').val() )
		});
	}
}

function parseHash(){
	let key = pmBase.hash.get();
	if ( mode == 0 ) {
		if ( key.length > 0 ) {
			$('.c-stageSelector').val(key);
			showStage( $('.c-stageSelector').val(), $('.c-stageSelector').val() );
		} else {
			$('.c-stageSelector').val( $('.c-stageSelector option:first').val() );
			showStage( $('.c-stageSelector').val(), $('.c-stageSelector').val() );
		}
	} else {
		if ( key.length > 0 ) {
			$('.c-packSelector').val(key);
			showStage( $('.c-stageSelector').val(), $('.c-packSelector').val() );
		} else {
			$('.c-packSelector').val( $('.c-packSelector option:first').val() );
			showStage( $('.c-stageSelector').val(), $('.c-packSelector').val() );
		}
	}
}

function selectStage( mapKey, packKey ){
	packKey = packKey || mapKey;
	pmBase.hash.set(packKey);
	showStage( mapKey, packKey );
}

function showStage( mapKey, packKey ){
	let pData = enemyPack[packKey];
	let sData = stageData[mapKey];
	let waveCount = pData.length;
	let enemyRate = sData[1];
	
	let html = '<div class="row">';
	$.each( pData, function( waveIndex, waveData ) {
		html += `
			<div class=" col-12 col-md-3">
	    <div class="card card-primary c-waveData">
	      <div class="card-header with-border">第${waveIndex + 1}波</div>
	      <div class="card-body card-profile text-center">
		`;
			
		$.each( waveData, function( spawnIndex, spawnData ) {
			let pCount = spawnData[0] == spawnData[1] ? spawnData[0] : spawnData[0] + '-' + spawnData[1];
			let isBoss = spawnData[2] == 1 ? '（BOSS）' : '';

			html += `
		    <table class="c-spawnData">
		    <caption>第${spawnIndex+1}组（${pCount}只）${isBoss}</caption>
		    <tr>
			`;
			let sum =0;
			$.each( spawnData[3], function( pkmnId, weight ) {
				sum += weight;
			});
			
			$.each( spawnData[3], function( pkmnId, weight ) {
				let eData = enemyData[pkmnId];
				let icon = pmBase.sprite.get('quest-pokemon',eData.monsterNo);
				let rate = Math.round(weight/sum*100);
				icon = pmBase.url.createAnchor('quest-enemy', pkmnId, icon);
				html += `
			    <td style="width:${weight/sum*100}%;">
			    	${icon}
			    	<br>
			    	<small>HP ${(eData.hpBasis*enemyRate).toLocaleString('en')}</small>
			    	<br>
			    	${rate}%
			    </td>
				`;
			});
			html += '</tr></table>';
			
		});
		
		html += '</div></div></div>';
	});
		html += '</div>';
	$('.c-stageData').html( html );
	
}

pmBase.hook.on( 'init', function(){
	mode = parseInt($('.js-config').data('mode'),10);
	
	fillSelector();
	parseHash();
	pmBase.hash.popstate( parseHash );
});