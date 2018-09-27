import poketoru from './core.js';

const blockType = {
  layout: 0,
  action: 1,
  pattern: 2,
  pokemonset: 3,
};

const coverDict = {
  0: {
    0: null,
    3: null,
    4: 'cloud',
    5: 'barrier',
  },
  2: {
    0: null,
    1: 'clear',
    2: 'cloud',
    3: 'barrier',
  },
};

const blockDict = {
  0: {
    1152: 'rock',
    1153: 'block',
    1154: 'coin',
    
    1990: 'a',
    1991: 'b',
    1992: 'c',
    1993: 'd',
    1994: 'e',
    1995: 'a2',
    1996: 'b2',
    1997: 'c2',
    1998: 'd2',
    1999: 'e2',
  },
  1: {
    1152: 'rock',
    1153: 'block',
    1154: 'coin',
    
    2200: 'rock',
    2201: 'block',
    2202: 'coin',
    2203: 'cloud',
    2204: 'barrier',
  },
  2: {
    1152: 'rock',
    1153: 'block',
    1154: 'coin',
    
    2000: 'self',
    
    2100: 'a',
    2101: 'b',
    2102: 'c',
    2103: 'd',
    2104: 'e',
    
    // tricks( copy from 1 )
    2200: 'rock',
    2201: 'block',
    2202: 'coin',
    2203: 'cloud',
    2204: 'barrier',
    
    9000: 'area',
  },
  3: {
    1152: 'rock',
    1153: 'block',
    1154: 'coin',
  }
};


const blockIndexDict = {
  'barrier' : '3',
  'block'   : '1',
  'cloud'   : '4',
  'clear'   : '5',
  'coin'    : '2',
  'rock'    : '0',
  'area'    : '6',
  'a'       : '9',
  'b'       : '10',
  'c'       : '11',
  'd'       : '12',
  'e'       : '13',
  'a2'       : '14',
  'b2'       : '15',
  'c2'       : '16',
  'd2'       : '17',
  'e2'       : '18',
};

const blockNameDict = {
  'barrier' : '屏障',
  'block'   : '铁块',
  'cloud'   : '黑云',
  'clear'   : '消除',
  'coin'    : '硬币',
  'rock'    : '岩石',
  'self'    : '自己',
  'a'       : '支援宝可梦A',
  'b'       : '支援宝可梦B',
  'c'       : '支援宝可梦C',
  'd'       : '支援宝可梦D',
  'e'       : '支援宝可梦E',
};

function getCover( type, value, size ) {
  let blockKey = coverDict[type][value];
  return blockKey
    ? pmBase.sprite.get('ojama', blockIndexDict[blockKey], size)
    : '';
}

function getBlock( type, value, size, withName = false ) {
  if ( !value ) return '';
  let blockKey = blockDict[type][value];
  if ( blockKey === 'self' ) blockKey = pmBase.config.get('selfIndex');
  if ( !blockKey ) blockKey = value;
  
  if ( blockKey in blockIndexDict ) {
    return pmBase.sprite.get('ojama', blockIndexDict[blockKey], size)
      + ( withName ? blockNameDict[blockKey] : '' );
  } else {
    let pkmn = poketoru.getPokemonData( blockKey );
    return pmBase.sprite.get('pokemon', pkmn.icon, size)
      + ( withName ? pkmn.name : '' );
  }
}

function createLayout( layoutArray, size=32 ) {
  let html = '', html2='';
  if ( layoutArray.length > 6 ) {
    html2 += `<tbody class="p-layout__expand"><tr><th colspan="6">+</th></tr></tbody>`;
  }
  for ( let i=layoutArray.length/6-1;i>=0;i-- ){
    html2 += '<tbody>';
    for ( let j=0;j<6;j++ ) {
      html2 += '<tr>';
      for ( let k=0;k<6;k++ ) {
        let layoutRow = layoutArray[i*6+j];
        html2 += '<td>';
        if ( layoutRow[k+6] > 0 ) html2 += getBlock(blockType.layout,layoutRow[k+6],size);
        if ( layoutRow[k] > 0 ) html2 += getCover(blockType.layout,layoutRow[k],size);
        html2 += '</td>';
      }
      html2 += '</tr>';
    }
    html2 += '</tbody>';
  }
  html = `<table class="p-layout ${size==12?'p-layout--figure':''}" >${html2}</table>`;
  return html;
}

function createPattern( layoutArray, size=12 ) {
  let html = '', html2='';
  let row = layoutArray.length;
  let col = layoutArray[0].length > 6 ? 6 : layoutArray[0].length;
  for ( let j=0;j<row;j++ ) {
    html2 += '<tr>';
    for ( let k=0;k<col;k++ ) {
      let layoutRow = layoutArray[j];
      html2 += '<td>';
      if ( layoutRow[k+6] > 0 ) html2 += getBlock(blockType.pattern,layoutRow[k+6],size);
      if ( layoutRow[k] > 0 ) html2 += getCover(blockType.pattern,layoutRow[k],size);
      html2 += '</td>';
    }
    html2 += '</tr>';
  }
  html = `<table class="p-layout p-layout--figure" style="display:inline-block; vertical-align: middle;"><tbody>${html2}</tbody></table>`;
  return html;
}

function init () {
    
  pmBase.util.addCSS(`
    .p-layout td {
      border-collapse: separate;
    }
    .p-layout{
      position:relative;
    }
    .p-layout td {
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
    
    .p-layout__expand ~ tbody:before {
      content:" ";
      height: 3px;
      display: block;
    }
    
    .p-layout__expand ~ tbody:not(:last-child) {
      display: none;
    }
    .p-layout:hover tbody {
      display: table-row-group;
    }
    
    .p-layout__expand th {
      text-align: center;
      height: 10px;
      border: 1px dashed #ccc;
    }
  `);

}
pmBase.hook.on( 'init', init);


export default {
  blockType,
  getBlock,
  createLayout,
  createPattern,
}