import core from './core.js';
import itemDataArray from './data/items.js';

function init(){
  let list = pmBase.content.create({
    type: 'list',
    columns: [
      '图标',
      '编号',
      '名字',
      '日文',
      '英文',
      '说明',
    ],
    list: itemDataArray.map( (data,i)=>[
      pmBase.sprite.get('item7',i ),
      `#${i.toString().padStart(3,0)}`,
      data.name,
      data.nameja,
      data.nameen,
      data.desc,
    ]),
  });
  
  pmBase.content.build({
    pages: [{
      content: list,
    }]
  });
}

pmBase.hook.on( 'init', init );