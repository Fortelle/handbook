import './core.js';
import {stoneData, enemyData, moveData, enemyPack} from './enemy.loader.js';
import {enemyPackNames,stageData} from './data/stagedata.js';

let mode = 0;

function init(){
  if ( mode == 0 ) {
    
    let html = '';
    $.each( stageData, function( key, data ){
      let a = key.split('-');
      if ( a[0] == '12' ) return;
      html += `<option value="${key}">${key} ${enemyPackNames[key]}</option>`;
    });
    pmBase.page.createSelector(html);
    
  } else {
    
    let html = '';
    html += '<select class="p-selector btn-group form-control col-6">';
    $.each( enemyPackNames, function( key, name ){
      let a = key.split('-');
      if ( a[0] != 12 ) return;
      html += `<option value="${key}">#${key} ${name}</option>`;
    });
    html += '</select>';
    html += '<select class="p-selector2 btn-group form-control col-6">';
    $.each( stageData, function( key, data ){
      let a = key.split('-');
      if ( a[0] != 12 ) return;
      html += `<option value="${key}">${key} ${data[0]}</option>`;
    });
    html += '</select>';
    $('.p-page__control').html(html);
  }
}

function detectHash(key){
  if (mode == 0 ) {
    showStage( key, key );
  } else {
    showStage( $('.p-selector2').val(), key );
  }
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
        <table class="c-spawnData" style="width: 100%;">
        <caption>第${spawnIndex+1}组（${pCount}只）${isBoss}</caption>
        <tr>
      `;
      let sum =0;
      $.each( spawnData[3], function( pkmnId, weight ) {
        sum += weight;
      });
      
      $.each( spawnData[3], function( pkmnId, weight ) {
        let eData = enemyData[pkmnId];
        let icon = pmBase.sprite.get('pokemon',eData.monsterNo);
        let rate = Math.round(weight/sum*100);
        let href = pmBase.url.createUrlHash('enemy', pkmnId);
        html += `
          <td class="border" style="width:${weight/sum*100}%;">
            <a href="${href}">${icon}</a>
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
  $('.p-stageData').html( html );
  return true;
}

pmBase.hook.on( 'init', function(){
  mode = parseInt($('.js-config').data('mode'),10);
  
  init();
  pmBase.page.listen( detectHash );
});