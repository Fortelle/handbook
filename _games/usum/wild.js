import core from './core.js';
import textDict from './data/text.js';

let mapDataArray;
let encSlotText = [
  '常规',
  '呼唤伙伴(1%)',
  '呼唤伙伴(1%)',
  '呼唤伙伴(1%)',
  '呼唤伙伴(10%)',
  '呼唤伙伴(10%)',
  '呼唤伙伴(10%)',
  '呼唤伙伴(67%)',
  '呼唤伙伴(下雨)',
  '呼唤伙伴(冰雹)',
  '呼唤伙伴(沙暴)',
];
let timeText = [ '白天', '夜晚' ];

function init(){
  pmBase.loader.using([
    `./data/encounter.us.js`,
  ], function( arr ) {
    [mapDataArray] = arr;
    let list=[],select={};
    
    mapDataArray.forEach( function( data, i ) {
      let locName = Array.from(new Set(data[0].map( x=>getLocName(x) ))).join('，');
      if ( !data[1] ) return;
      //htmlSelect += `<option value="${i}">#${i.toString().padStart(3,0)}　${locName}</option>`;
      select[i] = `#${i.toString().padStart(3,0)}　${locName}`;
    });

    pmBase.content.build({
      pages: [{
        selector: select,
        content: change,
      }]
    });
    
  });
}

function getLocName(locIndex) {
  let locName = textDict.locations[locIndex];
  let subName = textDict.locations[locIndex+1];
  if ( subName ) locName += `（${subName}）`;
  return locName;
}

function change( hash ) {
  if ( ! (~~hash.value in mapDataArray) ) return false;
  let mapData = mapDataArray[~~hash.value];
  let tableCount = ( mapData.length -1 );
  
  let html = '';
  
  for ( let i=0;i<tableCount;i++ ) {
    let tableData = mapData[i+1];
    let headerData = tableData[0];
    
    html += `
      <h3>区域${~~(i/2)+1}（${timeText[i%2]}）</h3>
      <table class="table table-sm" style="table-layout:fixed;">
      <thead>
        <tr>
        <th style="width:20%;"></th>`;
    for ( let  j=2;j<headerData.length;j++ ) {
      html+='<th>' + (headerData[j]? headerData[j] + '%':'') + '</th>';
    }
    html += `
        </tr>
      </thead>
      <tbody>
    `;
    for ( let j=1;j<tableData.length-1;j++ ) {
      let encData = tableData[j];
      html += `<tr><td>${encSlotText[j-1]}</td>`;
      for ( let k=0;k<encData.length;k++ ){
        html +='<td>' + ( encData[k] ? pmBase.sprite.get('pi7',encData[k]) : '' ) + '</td>';
      }
      html += '</tr>';
      if ( j==1 ) html += '</tbody></tbody>';
    }
    html += '</tbody>';
    let encData = tableData[tableData.length-1];
    if ( encData[0] ) {
      html += `<tbody><tr>`;
      for ( let j=0;j<=2;j++) {
        html += `<td>${encSlotText[8+j]}</td>`;
        for ( let k=0;k<=1;k++ ){
          html +='<td>' + pmBase.sprite.get('pi7',encData[j*2+k]) + '</td>';
        }
        html += '<td colspan="8"></td></tr>';
      }
      html += '</tbody>';
    }
    html += '</table>';
  }
    
  return html;
}

pmBase.hook.on( 'load', init );