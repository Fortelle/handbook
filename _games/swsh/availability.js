import core from './core.js';

const PokemonList = {};

function getEntry(pid) {
  if ( pid in PokemonList ) {
    return PokemonList[pid];
  }
  else{
    let dex = pmBase.data.get('dexindexes').indexOf(~~pid.split('.')[0]);
    let entry = {
      id: pid,
      dex: dex == -1 ? '' : 'No.' + `${dex}`.padStart(3,'0'),
      sort: dex == -1 ? 999 : dex,
      hasHiddenAbility: false,
      hasWild: false,
      hasRaid: false,
      random: [],
      symbol: [],
      special: [],
      raid: [],
    };
    PokemonList[pid] = entry;
    return entry;
  }
}

function init() {
  pmBase.data.add('encounters', '../data/encounters.json');
  pmBase.data.add('nesthole', '../data/nesthole.json');
  pmBase.data.add('misc', '../data/encounter_misc.json');
  pmBase.data.add('event_encount_data', '../data/event_encount_data.json');
  pmBase.data.add('dexindexes', '../data/dexindexes.json');

  pmBase.data.add('monsname', '../text/monsname.json');

  pmBase.data.load(function () {

    let encounters = pmBase.data.get('encounters');
    for (let fileName in encounters) {
      let version = fileName.endsWith('k') ? 1 : 2;
      let group = fileName.includes('symbol') ? 'symbol' : 'random';
      encounters[fileName].forEach( (map, mapIndex) => {
        map.forEach( (weather, weatherIndex) => {
          weather.Slots.forEach( (slot, slotIndex) => {
            let pmId = pmCommon.getPokemonID(slot[0], slot[1]);
            let entry = getEntry(pmId);
            entry[group].push([mapIndex, version, weatherIndex, slot[2]]);
            entry.hasWild |= version;
          });
        });
      });
    }

    pmBase.data.get('nesthole').Encounters.forEach( (table, tableIndex) => {
      let version = table.Game;
      for (let slot of table.Slots) {
        let pmId = pmCommon.getPokemonID(slot.Pokemon, slot.Form);
        let entry = getEntry(pmId);
        entry.raid.push([tableIndex, slot.Weights]);
        entry.hasRaid |= version;
        entry.hasHiddenAbility |= slot.Ability == 2 || slot.Ability == 4;
      }
    });

    pmBase.data.get('event_encount_data').forEach( (pkmn, pkmnIndex) => {
      let version = 3;
      let pmId = pmCommon.getPokemonID(pkmn.Pokemon, pkmn.Form);
      let entry = getEntry(pmId);
      entry.special.push(pkmnIndex);
      entry.hasWild |= version;
    });

    let pokemonArray = Object.values(PokemonList).sort((a, b) => a.sort - b.sort);
    let html = '';
    html += pmBase.content.create({
      type: 'list',
      sortable: true,
      columns: ['图标', '编号', '宝可梦', '野生（剑）', '野生（盾）', '巢穴（剑）', '巢穴（盾）', '隐藏特性'],
      list: pokemonArray.map(x => [
        pmBase.sprite.get("pi8", x.id),
        x.dex,
        `<a href="${pmBase.url.getHref(x.id)}">${pmBase.data.get('monsname')[~~x.id.split('.')[0]]}</a>`,
        (x.hasWild & 1) == 1 ? '<i class="fa fa-check"></i>' : '',
        (x.hasWild & 2) == 2 ? '<i class="fa fa-check"></i>' : '',
        (x.hasRaid & 1) == 1 ? '<i class="fa fa-check"></i>' : '',
        (x.hasRaid & 2) == 2 ? '<i class="fa fa-check"></i>' : '',
        x.hasHiddenAbility ? '<i class="fa fa-check"></i>' : '',
      ]),
      card: true,
    });

    let selector = pokemonArray.map(x=>{
      let pnum = ~~(x.id.split('.')[0]);
      return {
        text:`${x.dex} ${pmBase.data.get('monsname')[~~pnum]}`,
        value:x.id,
      };
    })
    pmBase.content.build({
      pages: [{
        content: html,
      },{
        selector,
        content: show,
      }]
    });

  });
}

function show(hash) {
  let pid = hash.value;
  let entry = PokemonList[pid];
  let misc = pmBase.data.get('misc');
  let content = '';

  let randomList = [];
  for( let mapIndex = 0; mapIndex < misc.RandomMapNames.length; mapIndex ++ ) {
    for ( let version of [1,2]) {
      if ( !entry.random.some(x=> x[0] == mapIndex && x[1] == version) ) continue;
      let row = [
        `<a href="${pmBase.url.getHref('wild', `encount_${version==1?'k':'t'}/${mapIndex}`)}">${misc.RandomMapNames[mapIndex]}</a>`,
        ['剑','盾'][version-1]
      ];
      for ( let weatherIndex =0; weatherIndex < misc.WeatherNames.length; weatherIndex ++) {
        let query = entry.random.find(x=>x[0] == mapIndex && x[1] == version && x[2] == weatherIndex);
        row.push(query?query[3]+'%':'-');
      }
      randomList.push(row);
    }
  }

  let symbolList = [];
  for( let mapIndex = 0; mapIndex < misc.SymbolMapNames.length; mapIndex ++ ) {
    for ( let version of [1,2]) {
      if ( !entry.symbol.some(x=> x[0] == mapIndex && x[1] == version) ) continue;
      let row = [
        `<a href="${pmBase.url.getHref('wild', `encount_symbol_${version==1?'k':'t'}/${mapIndex}`)}">${misc.SymbolMapNames[mapIndex]}</a>`,
        ['剑','盾'][version-1]
      ];
      for ( let weatherIndex =0; weatherIndex < misc.WeatherNames.length; weatherIndex ++) {
        let query = entry.symbol.find(x=>x[0] == mapIndex && x[1] == version && x[2] == weatherIndex);
        row.push(query?query[3]+'%':'-');
      }
      symbolList.push(row);
    }
  }

  let specialList = [];
  for( let pindex of entry.special ) {
    misc.SpecialSymbolList.forEach(x=>{
      if (!x[2].includes(pindex)) return;
      let nestName = `${misc.WildAreaNames[x[0]]}-${x[1]}`;
      specialList.push([
        nestName,
        '剑盾',
        ...x[2].map(y=>y==pindex?'100%':'-'),
        '-',
        '-'
      ]);
    });
  }

  let nestList = [];
  for( let row of entry.raid ) {
    let tableIndex = ~~(row[0]/2);
    let version = (row[0] % 2) + 1;
    misc.NestList.forEach(x=>{
      [ x[2], x[3] ].forEach((y,i)=>{
        if ( y != tableIndex ) return;
        let nestName = `${misc.WildAreaNames[x[0]]}-${x[1]}`;
        nestList.push([
          `<a href="${pmBase.url.getHref('den',y)}">${nestName}</a>`,
          ['剑','盾'][version-1],
          i == 0 ? '普通' : '稀有',
          ...row[1].map(z=>z ? `${z}%` : '-')
        ]);
      });
    });
  }

  if (randomList.length>0)
  content += pmBase.content.create({
    type: 'list',
    sortable: true,
    card: true,
    title: '随机遇敌',
    columns: [
      {header:'地图',width:'20%'},
      {header:'版本',width:'10%'},
      ...misc.WeatherNames
    ],
    list: randomList,
  });

  if (symbolList.length>0)
  content += pmBase.content.create({
    type: 'list',
    sortable: true,
    card: true,
    title: '地图遇敌',
    columns: [
      {header:'地图',width:'20%'},
      {header:'版本',width:'10%'},
      ...misc.WeatherNames
    ],
    list: symbolList,
  });

  if (specialList.length>0)
  content += pmBase.content.create({
    type: 'list',
    sortable: true,
    card: true,
    title: '固定位置',
    columns: [
      {header:'地图',width:'20%'},
      {header:'版本',width:'10%'},
      ...misc.WeatherNames
    ],
    list: specialList,
  });

  if (nestList.length>0)
  content += pmBase.content.create({
    type: 'list',
    sortable: true,
    card: true,
    title: '极巨团体战',
    columns: [
      {header:'巢穴',width:'20%'},
      {header:'版本',width:'10%'},
      {header:'条件',width:'10%'},
      '☆1',
      '☆2',
      '☆3',
      '☆4',
      '☆5',
    ],
    list: nestList,
  });

  return {
    title: pmBase.data.get('monsname')[~~pid.split('.')[0]],
    content,
  };
}


pmBase.hook.on('load', init);