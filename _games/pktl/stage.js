import poketoru from './core.js';
import { pokemonSetArray,stageDataArray } from './data/stages.js';

let mode = '';
function init(){
  mode = ~~$('.p-mode').data('mode');
  
  if ( mode == 0 ) {
    initMain()
  }
  
  pmBase.page.listen( change );
}

function initMain(){
  let html = '';
  
  html = '';
  html += `<option value="-1">-</option>`;
  stageDataArray.forEach( function( stageData, i ) {
    if ( stageData.type === 0 ) {
      let pkmn = poketoru.getPokemonDataByIndex( stageData.pkmnIndex );
      html += `<option value="${i}">${i+1} ${pkmn.info.name}</option>`;
    }
  });
  pmBase.page.createSelector(html);
}


function change( key ) {
  let stageData = stageDataArray[key];
  let pkmnData = poketoru.getPokemonDataByIndex( stageData.pkmnIndex );
  
  let html = '';
  
  html += `
  <h3>关卡数据</h3>
  <table class="table table-sm">
    <tr><th style="width:30%">宝可梦</th><td>${pkmnData.info.fullname}</td></tr>
    <tr><th>属性</th><td>${pmBase.page.create('type', pkmnData.type )}</td></tr>
    <tr><th>HP</th><td>${stageData.hp}</td></tr>
    <tr><th>步数</th><td>${stageData.moves || stageData.times}</td></tr>
  </table>
  <h3>初始布局</h3>
  ${drawLayout(stageData.layout)}
  <h3>干扰</h3>
  ${createOjama(stageData.ojama)}
  `;
  
  $('.p-main-content').html(html);
  return true;
	//["pkmnIndex","skyfallCount","supportCount","baseCatchRate","extraCatchRate","dropItems","difficult","items","extraHp","pkmnSets"
}


let OjamaArray = {
  0:'',
  1990:'A',
  1991:'B',
  1992:'C',
  1993:'D',
  1994:'E',
  1995:'A',
  1996:'B',
  1997:'C',
  1998:'D',
  1999:'E',
  4:'Cloud',
  5:'Barrier',
  1152:'Rock',
  1153:'Block',
  1154:'Coin',
  2000:'Self',
  2200:'Rock',
  2201:'Block',
  2202:'Coin',
  2203:'Cloud',
  2204:'Barrier',
};
OjamaArray = {
  0:'-1',
  1990:'5',
  1991:'6',
  1992:'7',
  1993:'8',
  1994:'9',
  1995:'5',
  1996:'6',
  1997:'7',
  1998:'8',
  1999:'9',
  1152:'0',
  1153:'1',
  1154:'2',
  2000:'-1',
  2200:'0',
  2201:'1',
  2202:'2',
};
let CoverArray = {
  4:'4',
  5:'3',
  2203:'3',
  2204:'4',
};

function getCover( value ) {
    return pmBase.sprite.get('ojama',CoverArray[value],32);
}
function getBlock( value ) {
  if ( value in OjamaArray ) {
    return pmBase.sprite.get('ojama',OjamaArray[value],32);
  } else {
    let pkmn = poketoru.getPokemonDataByIndex( value );
    return pmBase.sprite.get('pokemon',pkmn.icon,32);
  }
}

function drawLayout( layoutArray ) {
  if ( !layoutArray ) return '';
  let html = '', html2='';
  for ( let i=0;i<layoutArray.length/6;i++ ){
    html2 += '<tbody>';
    for ( let j=5;j>=0;j-- ) {
      html2 += '<tr>';
      for ( let k=0;k<6;k++ ) {
        let layoutRow = layoutArray[i*6+j];
        html2 += '<td>';
        if ( layoutRow[k+6] > 0 ) html2 += getBlock(layoutRow[k+6]);
        if ( layoutRow[k] == 4 || layoutRow[k] == 5 ) html2 += getCover(layoutRow[k]);
        html2 += '</td>';
      }
      html2 += '</tr>';
    }
    html2 += '</tbody>';
  }
  html = `<table class="p-layout"><tbody>${html2}</tbody></table>`;
  return html;
}

function createOjama( data ) {
  let html = '';
  data.forEach(function(row,index){
    html += `<h4>干扰${index+1}</h4>`;
    let [ moveCountdown, timeCountdown, chain, type, instantFlag, hp, mode ] = row;
    
    let a = '';
    switch( type ) {
      case 0:
        if ( moveCountdown>0 ) a=`每倒数${moveCountdown}步`;
        if ( timeCountdown>0 ) a=`每移动${timeCountdown}步`;
        if ( instantFlag ) a += '（第一次使用时0步）';
        a += '后，';
        break;
      case 1:
        if ( instantFlag ) a += '第一次直接使用，之后';
        a += `每步移动后，如果第1击＝${chain}消，`;
        break;
      case 3:
        if ( instantFlag ) a += '第一次直接使用，之后';
        a += `每步移动后，如果连锁≤${chain}，`;
        break;
      case 4:
        if ( instantFlag ) a += '第一次直接使用，之后';
        a += `每步移动后，如果连锁≥${chain}消，`;
        break;
      }
      a += `${mode?'按顺序':'随机'}使用一项干扰。`;
      html+=a;
  });
  return html;
}

pmBase.hook.on( 'init', init);
pmBase.util.addCSS(`
  .p-layout td {
    border-collapse: separate;
  }
  .p-layout tbody + tbody:before {
    content: '';
    display: block;
    height: 10px;
  }
  
  .p-layout{
    position:relative;
  }
  .p-layout td{
    width:32px;
    height:32px;
    padding:0;
    position:relative;
    border: 1px solid #ccc;
  }
  .p-layout div{
    position:absolute;
    top:0;
    left:0;
  }
`);
