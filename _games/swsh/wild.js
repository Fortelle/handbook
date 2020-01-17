import core from './core.js';

function init(){
  pmBase.data.add('encounters', '../data/encounters.json');
  pmBase.data.add('misc', '../data/encounter_misc.json');
  pmBase.data.add('monsname', '../text/monsname.json');

  pmBase.data.load(function() {

    let selector = {};
    let body = [];
    let encounters = pmBase.data.get('encounters');
    let misc = pmBase.data.get('misc');
    for (let fileName in encounters) {
      let fileData = encounters[fileName];
      let version = fileName.endsWith('k') ? 1 : 2;
      let group = fileName.includes('symbol') ? 'symbol' : 'random';
      for ( let i = 0; i <fileData.length;i++){
        let mapId = `${fileName}/${i}`;
        let mapName = `${version==1?'剑':'盾'}：${misc[group=='random'?'RandomMapNames':'SymbolMapNames'][i]}`;
        selector[mapId] = mapName;
      }
    }

    pmBase.content.build({
      pages: [{
        selector: selector,
        content: show,
      }]
    });

  });
}


function show(hash) {
  if ( hash.isEmpty ) return;
  let [fileName, mapIndex] = hash.value.split('/');
  let encounters = pmBase.data.get('encounters');
  let mapData = encounters[fileName][~~mapIndex];

  let list = pmBase.content.create({
    type: 'list',
    columns: ['天气', '等级' ],
    list: mapData.map((table,i) => table.Slots.length == 0 ? null : [
      pmBase.data.get('misc').WeatherNames[i],
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