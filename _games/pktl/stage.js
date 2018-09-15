import poketoru from './core.js';
import actionDataArray from './data/stage.action.js';
import pokemonSetDataArray from './data/pokemonset.js';
import { typeStatusArray } from './data/misc.js';
//import stageDataArray from './data/stage.event.js';

let selfIndex = 0;
let statusNameArray = ['灼伤','恐惧','睡眠','冰冻','麻痹','中毒'];
let stageDataArray;
let spriteNameArray = [ 'main', 'extra', 'event', 'event' ];
let uxHP = 0;
let mode = '';
function init(){
  mode = ~~$('.p-mode').data('mode');

  pmBase.loader.using([
    `./data/stage.${spriteNameArray[mode]}.js`,
  ], function( arr ) {
    [stageDataArray] = arr;
    if ( mode == 0 ) {
      initMain();
    } else if ( mode == 1 ) {
      initExtra();
    } else {
      initEvent();
    }
    pmBase.url.listen( change );
  });

}

function initMain(){
  let html = '';
  
  html = '';
  html += `<option value="-1">-</option>`;
  stageDataArray.forEach( function( stageData, i ) {
      let pkmn = poketoru.getPokemonData( stageData.pokemon );
      html += `<option value="${i}">${i} ${poketoru.getPokemonFullname(pkmn)}</option>`;
  });
  pmBase.content.setControl(html);
}


function initExtra(){
  let html = '';
  
  html = '';
  html += `<option value="-1">-</option>`;
  stageDataArray.forEach( function( stageData, i ) {
      let pkmn = poketoru.getPokemonData( stageData.pokemon );
      let index = (i+1).toString().padStart(2,0);
      html += `<option value="${i}">EX${index} ${poketoru.getPokemonFullname(pkmn)}</option>`;
  });
  pmBase.content.setControl(html);
}

function initEvent(){
  let html = '';
  
  html = '';
  html += `<option value="-1">-</option>`;
  stageDataArray.forEach( function( stageData, i ) {
      let pkmn = poketoru.getPokemonData( stageData.pokemon );
      html += `<option value="${i}">${i} ${poketoru.getPokemonFullname(pkmn)}</option>`;
  });
  pmBase.content.setControl(html);
}


function change( key ) {
  let stageData = stageDataArray[key];
  selfIndex = stageData.pokemon;
  let pkmnData = poketoru.getPokemonData( stageData.pokemon );
  let skyfallIcons = pokemonSetDataArray[stageData.pkmnSet].slice(0,stageData.skyfallCount).map(x=>getBlock(x,24)).join('');
  let html = '';
  let stageHP = stageData.hp?stageData.hp.toLocaleString():'无限';
  uxHP = stageData.hpLock ? stageData.hp : stageData.hp * 3;
  if ( mode === 0 ) stageHP += `（UX：${(uxHP).toLocaleString()}）`;
  let avgDamage = '';
  if ( stageData.hp && stageData.moves ) {
     avgDamage += parseInt(stageData.hp/stageData.moves);
    if ( mode === 0 ) avgDamage += `（UX：${parseInt(uxHP/stageData.moves)}）`;
    if ( stageData.ranks[0] > 0 ) {
      avgDamage += ' / S：' + parseInt(stageData.hp/(stageData.moves-stageData.ranks[0]));
      if ( mode === 0 ) avgDamage += `（UX：${parseInt(uxHP/(stageData.moves-stageData.ranks[0]))}）`;
    }
  }
  let rankText = '';
  rankText += `<span style="color:goldenrod;font-weight:bold;">S：${stageData.ranks[0]}</span>`;
  if ( stageData.ranks[0] ) rankText += ` / <span style="color:blue;font-weight:bold;">A：${stageData.ranks[1]}</span>`;
  if ( stageData.ranks[1] ) rankText += ` / <span style="color:green;font-weight:bold;">B：${stageData.ranks[2]}</span>`;
  if ( stageData.ranks[2] ) rankText += ` / <span style="color:red;font-weight:bold;">C：0</span>`;
  let statusText = typeStatusArray[pkmnData.type].map( (x,i) => x ? `<i class="fas fa-check"></i> ${statusNameArray[i]}` : `<span style="color:gray;"><i class="fas fa-times"></i> ${ statusNameArray[i]}</span>` ).join('&nbsp;&nbsp;&nbsp;');
  


  html += `
  <div class="row"><div class="col-6">
  <h3>关卡数据</h3>
  <table class="table table-sm">
    <tr><th style="width:30%">宝可梦</th><td>${poketoru.getPokemonFullname(pkmnData)}</td></tr>
    <tr><th>属性</th><td>${pmBase.content.create('type', pkmnData.type )}</td></tr>
    <tr><th>HP</th><td>${stageHP}</td></tr>
    <tr><th>步数</th><td>${stageData.moves || stageData.times}</td></tr>
    <tr><th>默认落下</th><td>${skyfallIcons}</td></tr>
    <tr><th>评价</th><td>${rankText}</td></tr>
  </table>
  <h3>初始布局</h3>
  ${stageData.layout ? drawLayout(stageData.layout) : '随机'}
  <h3>参考参数</h3>
  <table class="table table-sm">
    <tr><th style="width:30%">异常状态</th><td>${statusText}</td></tr>
    ${avgDamage?`<tr><th>平均每步伤害</th><td>${avgDamage}</td></tr>`:''}
  </table>
  
  </div>
  <div class="col-6">
  ${createOjama(stageData)}
  </div>
  </div>
  `;
  
  $('.p-main-content').html(html);
  return true;
}

let layoutIconIndexes = {
  1:5,
  2:4,
  3:3,
  5:3,
  4:4,
  2000:-1,
  
  1990:10,
  1991:11,
  1992:12,
  1993:13,
  1994:14,
  1995:10,
  1996:11,
  1997:12,
  1998:13,
  1999:14,
  2100:10,
  2101:11,
  2102:12,
  2103:13,
  2104:14,
  2105:15,
  
  1152:0,
  1153:1,
  1154:2,
  
  2200:0,
  2201:1,
  2202:2,
  2203:4,
  2204:3,
  
  2205:5, //trick
  9000:6,
};

let layoutIconNames = {
  1990:'支援宝可梦A1',
  1991:'支援宝可梦A2',
  1992:'支援宝可梦A3',
  1993:'支援宝可梦A4',
  1994:'支援宝可梦A5',
  1995:'支援宝可梦B1',
  1996:'支援宝可梦B2',
  1997:'支援宝可梦B3',
  1998:'支援宝可梦B4',
  1999:'支援宝可梦B5',
  2100:'支援宝可梦1',
  2101:'支援宝可梦2',
  2102:'支援宝可梦3',
  2103:'支援宝可梦4',
  2104:'支援宝可梦5',
  2105:'支援宝可梦6',
  1152:'岩石',
  1153:'铁块',
  1154:'硬币',
  2000:'自己',
  2200:'岩石',
  2201:'铁块',
  2202:'硬币',
  2203:'黑云',
  2204:'屏障',
};

function getCover( value, size ) {
  //if ( value == 3) return '';
  return pmBase.sprite.get('ojama', layoutIconIndexes[value],size);
}
function getBlock( value, size ) {
  if ( value == 2000 ) value = selfIndex;
  if ( value in layoutIconIndexes ) {
    return pmBase.sprite.get('ojama', layoutIconIndexes[value],size);
  } else {
    let pkmn = poketoru.getPokemonData( value );
    return pmBase.sprite.get('pokemon',pkmn.icon,size);
  }
}
function getBlockName( value ) {
  if ( value == 2000 ) value = selfIndex;
  if ( value in layoutIconNames ) {
    return pmBase.sprite.get('ojama',layoutIconIndexes[value],24) + layoutIconNames[value];
  } else {
    let pkmn = poketoru.getPokemonData( value );
    return pmBase.sprite.get('pokemon',pkmn.icon,24) + pkmn.name;
  }
}

function drawLayout( layoutArray ) {
  let html = '', html2='';
  let size=32;
  for ( let i=layoutArray.length/6-1;i>=0;i-- ){
    html2 += '<tbody>';
    for ( let j=0;j<6;j++ ) {
      html2 += '<tr>';
      for ( let k=0;k<6;k++ ) {
        let layoutRow = layoutArray[i*6+j];
        html2 += '<td>';
        if ( layoutRow[k+6] > 0 ) html2 += getBlock(layoutRow[k+6],size);
        if ( layoutRow[k] > 0 ) html2 += getCover(layoutRow[k]==3?0:layoutRow[k],size);
        html2 += '</td>';
      }
      html2 += '</tr>';
    }
    html2 += '</tbody>';
  }
  html = `<table class="p-layout ${size==16?'p-layout--figure':''}" ><tbody>${html2}</tbody></table>`;
  return html;
}

function drawPattern( layoutArray ) {
  let html = '', html2='';
  let row = layoutArray.length;
  let col = layoutArray[0].length > 6 ? 6 : layoutArray[0].length;
  let size = 12;
    for ( let j=0;j<row;j++ ) {
      html2 += '<tr>';
      for ( let k=0;k<col;k++ ) {
        let layoutRow = layoutArray[j];
        html2 += '<td>';
        if ( layoutRow[k+6] > 0 ) html2 += getBlock(layoutRow[k+6],size);
        if ( layoutRow[k] > 0 ) html2 += getCover(layoutRow[k],size);
        html2 += '</td>';
      }
      html2 += '</tr>';
    }
  html = `<table class="p-layout p-layout--figure" style="display:inline-block; vertical-align: middle;"><tbody>${html2}</tbody></table>`;
  return html;
}

let emptyPattern = new Array(6).fill(null).map(x=>new Array(12).fill(0));

function createOjama( stageData ) {
  let html = '';
  stageData.ojama.forEach(function(row,index){
    let [ switchValue, moveCountdown, timeCountdown, instantFlag, useType, value2, useOrder, actIndexes, switchType] = row;
    html += `<h3>干扰${index+1}</h3>`;
    if ( !switchValue && !actIndexes ) {
      html += `无。`;
      return;
    }
    let a = '';
    switch( useType ) {
      case 0:
        if ( timeCountdown > 0 ) {
          a=`每移动${timeCountdown}步`;
        } else {
          a=`每倒数${moveCountdown}步`;
        }
        if ( instantFlag ) a += '（第一次使用时0步）';
        a += '后，';
        break;
      case 1:
        if ( instantFlag ) a += '第一次直接使用，之后';
        a += `每步移动后，如果第1击＝${value2}消，`;
        break;
      case 3:
        if ( instantFlag ) a += '第一次直接使用，之后';
        a += `每步移动后，如果连锁≤${value2}，`;
        break;
      case 4:
        if ( instantFlag ) a += '第一次直接使用，之后';
        a += `每步移动后，如果连锁≥${value2}，`;
        break;
    }
    a += `${useOrder?'按顺序':'随机'}使用一项干扰。<br>`;
    if ( switchValue ) {
      switch( switchType ) {
        case 0:
          a += `如果剩余HP≤${switchValue}（分数＞${stageData.hp-switchValue}${mode==0?`，UX：＞${Math.floor(uxHP*0.9)}`:''}），`;
          break;
        case 1:
          a += `使用${switchValue}次后，`;
          break;
        case 3:
          a += `如果剩余步数≤${switchValue}，`;
          break;
        case 4:
          a += `经过${switchValue}回合后，`;
          break;
      }
      let nextIndex = [ [1,2,0], [1,2,1 ] ][stageData.ojamaFlag][index];
      a += `切换到干扰${nextIndex+1}。`;
    }
  
    if(actIndexes){
      a += '<table>';
      actIndexes.forEach(actIndex => {
        if ( actIndex===0 ) return;
        let actData= actionDataArray[actIndex];
        debug(actData);
        
        let s2='';
        let startPos = '';
        let area = '';
        let blockText = '';
        let x=actData.x, y=actData.y;
        let x2=x==6?0:x, y2=y==6?0:y;
        let w=actData.width, h=actData.height;
        let count = actData.count == 25
          ? 36
          : actData.count >= 13
            ? actData.count - 12
            : actData.count == 0
              ? 1
              : actData.count == 1
                ? w * h
                : actData.count  ;
        let pattern = '';
        let ojamaText = '';
        
        if ( x == 6 && y==6 ) {
          startPos = `将随机${w}×${h}`;
        } else if ( actData.x == 6 ) {
          startPos = `将第${actData.y + 1}行随机一列起${w}×${h}`;
        } else if ( actData.y == 6 ) {
          startPos = `将第${actData.x + 1}列随机一行起${w}×${h}`;
        } else if ( w == 1 && h == 1) {
          startPos = `将${"ABCDEF"[actData.x]}${actData.y+1}`;
        } else {
          startPos = `将${"ABCDEF"[actData.x]}${actData.y+1}:${"ABCDEF"[actData.x+w-1]}${actData.y+h}`;
        }
        
        if ( x == 6 || y==6 ){
          if (y < 6){ s2 = "第" + (y + 1) + "行任意一列起"}
          else if (x < 6 ){s2 = "第" + (x + 1) + "列任意一行起" }
          else { s2 = "随机" }
          s2 += w + "×" + h + "区域的"
        }
        
        if (actData.count==25 ) {
          let figure = actData.blocks;
          pattern = drawPattern(figure);
            
          let ojamaGroups = {};
          for( let i=0;i<6;i++ ){
            for( let j=0;j<12;j++ ){
              let ojamaIndex = actData.blocks[i][j];
              if ( ojamaIndex <= 6 ) ojamaIndex = [0,2205,2203,2204,2203,2204][ojamaIndex];
              if ( ojamaIndex == 0 ) continue;
              if ( ojamaIndex in ojamaGroups ) {
                ojamaGroups[ojamaIndex] +=1;
              } else {
                ojamaGroups[ojamaIndex] = 1
              }
            }
          }
          ojamaText = Object.keys(ojamaGroups).map(ojamaIndex=>`${ojamaGroups[ojamaIndex]}个${getBlockName(ojamaIndex)}`).join('、');
          
        } else if (actData.count==1){
          let figure = new Array(6).fill(null).map(x=>new Array(12).fill(0));
          for( let j=0;j<h;j++ ) {
            for( let i=0;i<w;i++ ) {
              figure[j+y2][i+x2+6] = actData.blocks[j * w + i];
            }
          }
          pattern = drawPattern(figure);
          
          let ojamaGroups = {};
          for( let i=0;i<count;i++ ){
            let ojamaIndex = actData.blocks[i];
            if ( ojamaIndex == 0 ) continue;
            if ( ojamaIndex in ojamaGroups ) {
              ojamaGroups[ojamaIndex] +=1;
            } else {
              ojamaGroups[ojamaIndex] = 1
            }
          }
          ojamaText = Object.keys(ojamaGroups).map(ojamaIndex=>`${ojamaGroups[ojamaIndex]}个${getBlockName(ojamaIndex)}`).join('、');
        } else {
          let figure;
          if ( actData.count >= 13 ) {
            figure = new Array(6).fill(null).map(x=>new Array(12).fill(0));
            for( let i=x;i<x+w;i++ ){
              for( let j=y;j<y+h;j++ ){
                figure[j][i] = 9000;
              }
            }
          } else {
            figure = new Array(6).fill(null).map(x=>new Array(12).fill(9000));
          }
          pattern = drawPattern(figure);
          
          let ojamaGroups = {};
          for( let i=0;i<count;i++ ){
            let ojamaIndex = actData.blocks[i] || actData.blocks[0];
            if ( ojamaIndex in ojamaGroups ) {
              ojamaGroups[ojamaIndex] +=1;
            } else {
              ojamaGroups[ojamaIndex] = 1
            }
          }
          ojamaText = Object.keys(ojamaGroups).map(ojamaIndex=>`${ojamaGroups[ojamaIndex]}个${getBlockName(ojamaIndex)}`).join('、');
        }
        
        
        
        a += `<tr><td style="width:120px;text-align:center;margin-left:30px;">${pattern}</td><td>`;
        if ( actData.count == 25 ) { // whole area.
          a += `将盘面变成${ojamaText}。`;
        } else if ( actData.count >= 13 ) { // fixed range(w,h) at fixed start position(x,y) with random blocks.
          a += `${startPos}的${count}个随机方块变成${ojamaText}。`;
        } else if ( actData.count == 1 ) { // fixed range(w,h) at random position and fill blocks(x,y is unused.)
          a += `${startPos}的方块变成${ojamaText}。`;
        } else if ( count > 0) { // fixed range(w,h) at fixed start position(x,y) with presetted pattern.
          a += `将随机${w}×${h}区域内的${count}个方块变成${ojamaText}。`;
        };
        
      });
      a += '</table>';
      a = a.replace(/(\d+)个(随机)*方块变成\1个/g,'$1个$2方块变成');
      a = a.replace(/随机6×6区域内的/g,'随机');
    }
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
  
  .p-layout--figure td {
    width:12px;
    height:12px;
  }
  
  .p-layout tbody:not(:last-child) {
    display: none;
  }
  .p-layout:hover tbody {
    display: block;
  }
`);
