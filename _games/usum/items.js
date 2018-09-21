import core from './core.js';
import itemDataArray from './data/items.js';
//import textDict from './data/text.js';

function init(){
  let list=[];
  itemDataArray.forEach( function( data, i ) {
    let id = i.toString().padStart(3,0);
    list.push( [
      pmBase.sprite.get('item7',i ),
      `#${id}`,
      data.name,
      data.nameja,
      data.nameen,
      data.desc,
    ] );
    /*
      data.price * 10 || '-',
      data.value || '-',
    */
  });
  let header = [
    '图标',
    '编号',
    '名字',
    '日文',
    '英文',
    '说明',
  ];
  pmBase.content.setContent( pmBase.content.create('list',list,header), 0 );
}

pmBase.hook.on( 'init', init );