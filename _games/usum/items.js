import core from './core.js';
import itemDataArray from './data/items.js';

function init(){
  let list = itemDataArray.map( (data,i)=>[
    pmBase.sprite.get('item7',i ),
    `#${i.toString().padStart(3,0)}`,
    data.name,
    data.nameja,
    data.nameen,
    data.desc,
  ]);
  
  let header = [
    '图标',
    '编号',
    '名字',
    '日文',
    '英文',
    '说明',
  ];
	pmBase.content.build({
	  pages: [{
	    content: pmBase.content.create('list',list,header),
	  }]
	});
}

pmBase.hook.on( 'init', init );