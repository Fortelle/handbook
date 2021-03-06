import poketoru from './core.js';
import popover from './popover.js';
import layout from './layout.js';
import actionDataArray from './data/stage.action.js';
import pokemonSetDataArray from './data/pokemonset.js';
import { typeStatusArray, itemPatternArray, dropItemArray } from './data/misc.js';
//import stageDataArray from './data/stage.event.js';

let statusNameArray = ['灼伤','恐惧','睡眠','冰冻','麻痹','中毒'];
let spriteNameArray = [ 'main', 'extra', 'event', 'event' ];
let rankTextArray   = 'SABC';
let rankColorArray  = [ 'goldenrod', 'blue', 'green', 'red'];
let weekTextArray   = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
let itemDataArray   = [0,1,2,3,4,5,6,7,1,2,3,4,5,6,7];
let dropRateArray   = [0,1,2,3,4,5,6,7,8].map( x=> x?1/Math.pow(2,x-1):0 );

let stageDataArray, eventDataArray;

let uxHP = 0;
let mode = '';
function init(){
  mode = ~~$('.p-mode').data('mode');

  if ( mode < 3 ) {
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
    });
  } else {
    pmBase.loader.using([
      `./data/stage.event.js`,
      `./data/events.js`,
    ], function( arr ) {
      [stageDataArray,eventDataArray] = arr;
      initEventSchedule();
    });
  }

}

function initMain(){
  let html = '';
  
  html = '';
  stageDataArray.forEach( function( stageData, i ) {
      let pkmn = poketoru.getPokemonData( stageData.pokemon );
      html += `<option value="${i}">${i} ${poketoru.getPokemonFullname(pkmn)}</option>`;
  });
  
  pmBase.content.build({
    pages: [{
      control: html,
      content: change
    }],
  });
}

function initExtra(){
  let html = '';
  
  html = '';
  stageDataArray.forEach( function( stageData, i ) {
      let pkmn = poketoru.getPokemonData( stageData.pokemon );
      let index = (i+1).toString().padStart(2,0);
      html += `<option value="${i}">EX${index} ${poketoru.getPokemonFullname(pkmn)}</option>`;
  });
  pmBase.content.build({
    pages: [{
      control: html,
      content: change
    }],
  });
}

function initEvent(){
  let html = '';
  
  html = '';
  stageDataArray.forEach( function( stageData, i ) {
      let pkmn = poketoru.getPokemonData( stageData.pokemon );
      html += `<option value="${i}">${i} ${poketoru.getPokemonFullname(pkmn)}</option>`;
  });
  pmBase.content.build({
    pages: [{
      control: html,
      content: change
    }],
  });
}

function initEventSchedule(){
  let htmlSelect = '', htmlTable = '';
  eventDataArray.forEach( (eventData,eventIndex) => {
    if ( eventData.type == 6 || eventData.type == 7 || eventData.type == 9 ) {
      eventDataArray[eventIndex].extend = eventData.stages.slice();
      eventDataArray[eventIndex].stages = eventData.stages.map( row => row[0] );
    }
  });
  eventDataArray.forEach( (eventData,eventIndex) => {
    let pkmnNames = [...new Set(eventData.stages.map( stageIndex => {
      let stageData = stageDataArray[stageIndex];
      let pkmn = poketoru.getPokemonData( stageData.pokemon );
      return poketoru.getPokemonFullname(pkmn);
    }))].join(', ');
    htmlSelect += `<option value="${eventIndex}">${eventIndex} ${pkmnNames}</option>`;
  });
  htmlTable = '<table class="table table-bordered text-center">';
  for ( let week = 0; week <=23; week ++ ) {
    let trArray = ['','','','','',''];
    
    eventDataArray.forEach( (eventData,eventIndex) => {
      if ( eventData.cycleType !=1 || eventData.cycleValue != week ) return;
      let tdIndex;
      if ( eventData.type == 5 && trArray[0] ) { return; }
      else if ( eventData.type == 5 ) { tdIndex = 0; }
      else if ( eventData.type2 == 6 ) { tdIndex = 3; }
      else if ( eventData.type2 == 15 ) { tdIndex = 2; }
      else if ( eventData.type == 1 ) { tdIndex = 1; }
      else if ( eventData.type == 6 ) { tdIndex = 4; }
      else if ( eventData.type == 2 ) { tdIndex = 5; }
      else { return; }
      let stageData = stageDataArray[eventData.stages[0]];
      let pkmnData = poketoru.getPokemonData( stageData.pokemon );
      let pkmnName = poketoru.getPokemonFullname(pkmnData);
      let pkmnIcon = poketoru.getPokemonIcon( pkmnData );
      trArray[tdIndex] += `<td class="small">${pkmnIcon}<br><a href="${pmBase.url.getHref( eventIndex )}">${pkmnData.name}</a></td>`;
    });
    htmlTable += `<tr>
      <th>第${week+1}周</th>
      ${trArray.map(x=>x||'<td></td>').join('')}
    </tr>`;
  }
  htmlTable += '</table>';
  
  pmBase.content.build({
    pages: [{
      content: htmlTable,
    },{
      control: htmlSelect,
      content: change2,
    }],
  });
  popover.apply();
}


function change( key ) {
  let stageIndex = ~~key;
  let html = createStageTable(stageIndex);
  return html;
}

function change2( key ) {
  let eventIndex = ~~key;
  let eventData = eventDataArray[eventIndex];
  let stageNames, stageTabs;
  if ( eventData.type == 2 ) {
    stageNames = eventData.stages.map ( (stageIndex,i) => weekTextArray[i] );
  } else if ( eventData.type == 6 ) {
    stageNames = eventData.extend.map ( (row,i) => {
      let stageIndex = row[0];
      let stageLevelBegin = row[1];
      let stageLevelEnd = eventData.extend[i+1] ? eventData.extend[i+1][1]-1 : -1;
      return ( stageLevelBegin == stageLevelEnd )
        ? stageLevelBegin
        : (stageLevelEnd == -1)
          ? `${stageLevelBegin}+`
          : `${stageLevelBegin}-${stageLevelEnd}`;
    });
  } else if ( eventData.type == 7 || eventData.type == 9 ) {
    let total = eventData.extend.reduce( (x,row) => x+row[1], 0 );
    stageNames = eventData.extend.map ( row => {
      let stageIndex = row[0];
      let stageData = stageDataArray[stageIndex];
      let pkmnData = poketoru.getPokemonData( stageData.pokemon );
      return `${poketoru.getPokemonFullname(pkmnData)}（${row[1]}/${total}）`;
    });
  } else {
    stageNames = eventData.stages.map( stageIndex => poketoru.getPokemonFullname(poketoru.getPokemonData( stageDataArray[stageIndex].pokemon )) );
  }
  
  if ( eventData.type == 6 ) {
    stageTabs = eventData.extend.map ( (row,i) => {
      let stageIndex = row[0];
      let stageLevelBegin = row[1];
      let stageLevelEnd = eventData.extend[i+1] ? eventData.extend[i+1][1]-1 : -1;
      return createStageTable(stageIndex, stageLevelEnd-stageLevelBegin+1);
    });
  } else {
    stageTabs = eventData.stages.map( stageIndex => createStageTable(stageIndex) );
  }
  
  let html = pmBase.content.create('tabs', stageNames,stageTabs );
  
  return html;
}

function createStageTable( stageIndex, level = 1 ) {
  let stageData = stageDataArray[stageIndex];
  pmBase.config.set('selfIndex', stageData.pokemon);
  let pkmnData = poketoru.getPokemonData( stageData.pokemon );
  let pkmnIcon = poketoru.getPokemonIcon( pkmnData );
  let skyfallIcons = pokemonSetDataArray[stageData.pokemonSetIndex].slice(0,stageData.skyfallCount).map(x=>layout.getBlock(layout.blockType.pokemonset,x,24)).join('');
  let html = '';
  uxHP = stageData.hpLock ? stageData.hp : stageData.hp * 3;

  let hpText = (stageData.hp == 1)
    ? '无限'
    : ( mode === 0 && !stageData.hpLock )
      ? `${stageData.hp.toLocaleString()}（UX：${(stageData.hp * 3).toLocaleString()}）`
      : ( level > 1 && stageData.hpIncrease )
        ? `${stageData.hp.toLocaleString()} - ${(stageData.hp+stageData.hpIncrease*(level-1)).toLocaleString()}（+${stageData.hpIncrease}/级）`
        : stageData.hp.toLocaleString()
          ;
  
  let avgDamage = false;
  if ( stageData.hp > 1 && stageData.moves ) {
    avgDamage = parseInt(stageData.hp/stageData.moves) + '/步';
    if ( mode === 0 && !stageData.hpLock ) avgDamage += `（UX：${parseInt(uxHP/stageData.moves)}/步）`;
  }
  
  let nameText = `<a href="${pmBase.url.getHref( 'pokemon', pkmnData.id )}">${poketoru.getPokemonFullname(pkmnData)}</a>`;
  let rankText = stageData.stageType <=1 
    ? [...new Set(stageData.ranks)].map( (v,i)=> `<span style="color:${rankColorArray[i]};font-weight:bold;">${rankTextArray[i]}：${v}</span>` ).join(' / ')
    : false;
  let statusText = typeStatusArray[pkmnData.type].map( (x,i) => x ? `<i class="fas fa-check"></i> ${statusNameArray[i]}` : `<span style="color:gray;"><i class="fas fa-times"></i> ${ statusNameArray[i]}</span>` ).join('&nbsp;&nbsp;&nbsp;');
  let itemText = itemPatternArray[stageData.items].filter(x=>x>0).map( (x,i)=>poketoru.getItem(4,itemDataArray[x]) ).join('');
  let costText = `${pmBase.sprite.get('item',[23,24][stageData.costType],24)}×${stageData.cost}`;
  let catchText = stageData.stageType == 0
    ? `${stageData.catchRate}%+${stageData.catchRate2}%/${stageData.isTime?'3秒':'步'}`
    : stageData.stageType == 4
      ? '1%+1%/级'
      : false;
  let dropText = '';
  if ( stageData.drops[0] || stageData.drops[2] || stageData.drops[4] ) {
    let sum = 0;
    for (let i=0;i<3;i++) {
      let dropIndex = stageData.drops[i*2+0];
      let dropRate = stageData.drops[i*2+1];
      if ( dropIndex ) {
        let dropItemData = dropItemArray[dropIndex];
        sum += dropRateArray[dropRate];
        dropText += `${poketoru.getItem( dropItemData[0], dropItemData[1], dropItemData[2] )} (${(dropRateArray[dropRate] * 100).toFixed(2)}%)<br>`;
      }
    }
    dropText += `平均每局掉落${sum.toFixed(1)}个道具。`;
  } else {
    dropText = false;
  }
  
  let infoData = [
    ['宝可梦', nameText],
    ['属性',pmBase.content.create('type', pkmnData.type )],
    ['HP',hpText],
    stageData.isTime ? ['限时',stageData.times + '秒'] : ['步数',stageData.moves + '步'],
    ['道具',itemText],
    ['默认落下',skyfallIcons],
    stageData.stageType <=1 ? ['评价',rankText] : null,
    ['消耗',costText],
    ['捕捉率',catchText],
    ['掉落道具',dropText],
  ];
  
  let extendData = [
    ['异常状态', statusText ],
    ['平均伤害', avgDamage ],
  ];
  
  html += `
  <div class="row"><div class="col-12">
  </div>
  <div class="col-12 col-lg-6">
  <h3>关卡数据</h3>
  ${pmBase.content.create('info',infoData,pkmnIcon)}
  <h3>初始布局</h3>
  ${stageData.layout.length>0 ? layout.createLayout(stageData.layout) : '随机'}
  <h3>参考参数</h3>
  ${pmBase.content.create('info',extendData)}
  
  </div>
  <div class="col-12 col-lg-6">
  ${createOjama(stageData)}
  </div>
  </div>
  `;
  return html;
}

let emptyPattern = new Array(6).fill(null).map(x=>new Array(12).fill(0));

function createOjama( stageData ) {
  let html = '';
  debug(stageData.moves);
  stageData.ojama.forEach(function(row,index){
    let [ switchValue, moveCountdown, timeCountdown, instantFlag, useType, value2, useOrder, switchType, actIndexes] = row;
    html += `<h3>干扰${index+1}</h3>`;
    if ( !switchValue && (!actIndexes || actIndexes.length == 0 ) ) {
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
        if ( !actData ) return;
        let s2='';
        let startPos = '';
        let area = '';
        let blockText = '';
        let x=actData.x, y=actData.y;
        let x2=x==6?0:x, y2=y==6?0:y;
        let w=actData.width, h=actData.height;
        if ( 6-x2 < w ) x2 = 6 - w;
        if ( 6-y2 < h ) y2 = 6 - h;
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
          pattern = layout.createPattern(figure);
            
          let ojamaGroups = {};
          for( let i=0;i<6;i++ ){
            for( let j=0;j<12;j++ ){
              let ojamaIndex = actData.blocks[i][j];
              if ( ojamaIndex == 0 ) continue;
              let ojamaKey = layout.getBlockKey( layout.blockType.pattern, ojamaIndex, j<6 );
              if ( ojamaKey in ojamaGroups ) {
                ojamaGroups[ojamaKey] +=1;
              } else {
                ojamaGroups[ojamaKey] = 1
              }
            }
          }
          ojamaText = Object.keys(ojamaGroups).map(ojamaKey=>`${ojamaGroups[ojamaKey]}个${layout.getBlockByKey(ojamaKey,24,true)}`).join('、');
          debug(ojamaGroups);
        } else if (actData.count==1){
          let figure = new Array(6).fill(null).map(x=>new Array(12).fill(0));
          for( let j=0;j<h;j++ ) {
            for( let i=0;i<w;i++ ) {
              figure[j+y2][i+x2+6] = actData.blocks[j * w + i];
            }
          }
          pattern = layout.createPattern(figure);
          
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
          ojamaText = Object.keys(ojamaGroups).map(ojamaIndex=>`${ojamaGroups[ojamaIndex]}个${layout.getBlock(layout.blockType.pattern,ojamaIndex,24,true)}`).join('、');
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
          pattern = layout.createPattern(figure);
          
          let ojamaGroups = {};
          for( let i=0;i<count;i++ ){
            let ojamaIndex = actData.blocks[i] || actData.blocks[0];
            if ( ojamaIndex in ojamaGroups ) {
              ojamaGroups[ojamaIndex] +=1;
            } else {
              ojamaGroups[ojamaIndex] = 1
            }
          }
          ojamaText = Object.keys(ojamaGroups).map(ojamaIndex=>`${ojamaGroups[ojamaIndex]}个${layout.getBlock(layout.blockType.pattern,ojamaIndex,24,true)}`).join('、');
        }
        
        
        
        a += `<tr>
          <td><i class="fas fa-${useOrder?'arrow-down':'random'}"></i></td>
          <td style="width:120px;text-align:center;margin-left:30px;">${pattern}</td>
          <td>`;
        if ( actData.count == 25 ) { // whole area.
          a += `将盘面变成${ojamaText}。`;
        } else if ( actData.count >= 13 ) { // fixed range(w,h) at fixed start position(x,y) with random blocks.
          a += `${startPos}的${count}个随机方块变成${ojamaText}。`;
        } else if ( actData.count == 1 ) { // fixed range(w,h) at random position and fill blocks(x,y is unused.)
          a += `${startPos}的方块变成${ojamaText}。`;
        } else if ( count > 0) { // fixed range(w,h) at fixed start position(x,y) with presetted pattern.
          a += `将随机${w}×${h}区域内的${count}个方块变成${ojamaText}。`;
        };
        a += `</tr>`;
        
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