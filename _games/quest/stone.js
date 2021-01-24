import './core.js';
import {stoneData, enemyData, moveData} from './enemy.loader.js';

function init(){
  pmBase.data.load(function() {

    $('.c-searchStone').change(function(){
      let query = $(this).val();
      let html = '';
      $.each( enemyData, function( key, data ){
        $.each( data.skillIDs, function( i, skillID ) {
          if ( skillID == -1 ) return;
          var sData = moveData[skillID];
          let s = '';
          let attrs = [];
          for ( let j=0; j<=2; j++ ){
            let stoneID = data.skillStoneIDs[i*3+j];
            if ( stoneID > -1 ) attrs.push(...stoneData[stoneID].filter(Boolean));
          }
          attrs.sort();
          let y=attrs.join('<br>');
          if ( y.indexOf( query ) > -1 ) {
            html += `<tr>
            <td>${pmBase.sprite.get('quest-pokemon',data.monsterNo)}</td>
            <td><a href="/p-quest/enemy/#!/${key}">${pmBase.util.getPokemonName(data.monsterNo)}</a></td>
            <td>${sData.name}</td>
            <td>${sData.desc}</td>
            <td class="small">${y}</td>
            </tr>`;
          }
        });
      });
      
      $('.c-result tbody').html( html );
    });
    
    $('.c-searchMove').change(function(){
      let query = $(this).val();
      let html = '';
      $.each( enemyData, function( key, data ){
        $.each( data.skillIDs, function( i, skillID ) {
          if ( skillID == -1 ) return;
          var sData = moveData[skillID];
          if ( sData.name.indexOf(query) > -1 ) {
            let attrs = [];
            for ( let j=0; j<=2; j++ ){
              let stoneID = data.skillStoneIDs[i*3+j];
              if ( stoneID > -1 ) attrs.push(...stoneData[stoneID].filter(Boolean));
            }
            attrs.sort();
            let y=attrs.join('<br>');
            
            html += `<tr>
            <td>${pmBase.sprite.get('quest-pokemon',data.monsterNo)}</td>
            <td><a href="${pmBase.url.get('quest-enemy',key)}">${pmBase.util.getPokemonName(data.monsterNo)}</a></td>
            <td>${sData.name}</td>
            <td>${sData.desc}</td>
            <td class="small">${y}</td>
            </tr>`;
          }
        });
      });
      
      $('.c-result tbody').html( html );
    });

  });
}

pmBase.hook.on( 'init', init);