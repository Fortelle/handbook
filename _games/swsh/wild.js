import core from './core.js';

function init(){
  pmBase.data.add('encounters', '../data/encounters.json');
  pmBase.data.add('monsname', '../text/monsname.json');

  pmBase.data.load(function() {

    let selector = {};
    let body = [];
    let encounters = pmBase.data.get('encounters');
    for (let fileName in encounters) {
      let fileData = encounters[fileName];
      for ( let i = 0; i <fileData.length;i++){
        let mapName = `${fileName}/${i}`;
        selector[mapName] = mapName;
      }
    }

    pmBase.content.build({
      pages: [{
        selector: selector,
        content: "abc",
      }, {
        selector: selector,
        content: show,
      }]
    });

  });
}


function show(hash) {
  let [fileName, mapIndex] = hash.value.split('/');
  let encounters = pmBase.data.get('encounters');
  let mapData = encounters[fileName][~~mapIndex];



  let list = pmBase.content.create({
    type: 'list',
    columns: ['天气', '等级', '1','2','3','4','5','6','7','8','9','10','11','12' ],
    list: mapData.map((table,i) => table.Slots.length == 0 ? null : [
      i,
      `${table.MinLevel}-${table.MaxLevel}`,
      ...table.Slots.map(slot=>{
        var pid = pmCommon.getPokemonID(slot[0],slot[1],3);
        return pmBase.sprite.get("pi8",pid) + `(${slot[2]}%)`;
      })
    ]).filter(x=>!!x),
    card: true,
  });

  return {
    content: list,
  };
}

pmBase.hook.on( 'load', init );