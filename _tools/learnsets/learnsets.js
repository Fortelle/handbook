
const Learnsets = {};
const EggGroups = [];
const EggGroupNames = [
  '',
  "怪兽",
  "水中1",
  "虫",
  "飞行",
  "陆上",
  "妖精",
  "植物",
  "人形",
  "水中3",
  "矿物",
  "不定形",
  "水中2",
  "百变怪",
  "龙",
  "未发现蛋",
];
const TypeColors = [
  "#9199A1",
  "#CE406A",
  "#8FA8DE",
  "#AA6AC8",
  "#D97744",
  "#C6B78B",
  "#91C12E",
  "#5269AC",
  "#5A8EA1",
  "#FF9C54",
  "#4F90D6",
  "#63BB5A",
  "#F4D23C",
  "#F97178",
  "#73CEC0",
  "#0A6DC3",
  "#5A5365",
  "#EC8FE6",
];
const Devolutions = {};
const Families = {};

function init() {
  pmBase.data.add('learnset_swordshield', './data/swordshield.json');
  pmBase.data.add('evolutions', './data/evolutions.json');
  pmBase.data.add('families', './data/families.json');

  pmBase.data.add('pokemondata', '/swsh/data/pokemondata.json');
  pmBase.data.add('wazadata', '/swsh/data/wazadata.json');
  pmBase.data.add('pi8index', '/swsh/data/piindex.json');

  pmBase.data.add('monsname', '/swsh/text/monsname.json');
  pmBase.data.add('wazaname', '/swsh/text/wazaname.json');
  pmBase.data.add('tokusei', '/swsh/text/tokusei.json');
  pmBase.data.add('typename', '/swsh/text/typename.json');

  pmBase.data.load(function () {

    pmBase.sprite.add( 'pi8', {
      url : '/swsh/images/pi.png',
      width: 68,
      height:56,
      crop: [10, 16, 40, 40],
      col: 30,
      keys: pmBase.data.get('pi8index')
    });

    pmBase.sprite.add( 'type', {
      url : '/swsh/images/types.png',
      width: 64,
      height: 64,
      col: 1
    });

    let pokemonData = pmBase.data.get('pokemondata');

    let raws = pmBase.data.get('learnset_swordshield');
    let keys = Object.keys(raws).sort();
    for( let key of keys ){
      if ( !(key.replace('.', '.0') in pokemonData)) continue;
      let value = raws[key];
      if ( !key.endsWith('.00') ) {
        let originId = key.split('.')[0].concat('.00');
        if (raws[originId] == value) continue;
      }
      Learnsets[key.replace('.', '.0')] = value.split(',').map(x=> {
        let t = x.split(':');
        return [ ~~t[0], t[1] || ''];
      });
    }

    for( let i=0;i<15;i++){
      EggGroups.push([]);
    }
    for( let [key, value] of Object.entries(pokemonData) ) {
      if ( value.EggGroups[0] != 0 &&
        value.EggGroups[0] != 15 &&
        value.EggGroups[1] != 0 &&
        value.EggGroups[1] != 15 ) {
          EggGroups[value.EggGroups[0]].push(key);
          if (value.EggGroups[0] != value.EggGroups[1]) EggGroups[value.EggGroups[1]].push(key);
      }
    }

    for( let [key, value] of Object.entries(pmBase.data.get('evolutions')) ){
      if (!(key in Families)) {
        Families[key] = [key];
      }
      else if ( !Families[key].includes[key] ){
        Families[key].push(key);
      }
      for (let pid of value) {
        Devolutions[pid.replace('.','.0')] = key.replace('.','.0');
        if ( !Families[key].includes[pid] ) Families[key].push(pid);
        if (!(pid in Families)) {
          Families[pid] = [pid];
        }
        else if ( !Families[pid].includes[pid] ){
          Families[pid].push(pid);
        }
      }
    }
    console.log(Families);

    let selector = Object.keys(Learnsets)
      .map( key => { return {
        value: key,
        text: '#' + key + ' ' + pmBase.data.get('monsname', ~~key.split('.')[0] ),
        };
      });

    let content = '';
    pmBase.content.build({
      pages: [{
        content,
        selector
      }, {
        content: parse,
        selector
      }]
    });

  });
}

function parse(hash) {
  let pid = hash.value;
  let learnset = Learnsets[pid];

  let content = '';

  content += pmBase.content.create({
    type: 'tabs',
    id: 'main',
    tabs: [{
      text: '预览',
      content: parsePage1(pid),
    },
    {
      text: '招式表',
      content: parsePage2(pid),
    },
    {
      text: '详细',
      content: parsePage3(pid),
    },
    {
      text: '遗传途径',
      content: parsePage4(pid),
    }]
  });

  return {
    title: pmBase.data.get('monsname', ~~pid.split('.')[0] ),
    content: content
  };
}

function parsePage1(pid) {

  let content = '';
  let pdata = pmBase.data.get('pokemondata')[pid];

  content += pmBase.content.create({
    type: 'info',
    image: getPokemonIcon(pid),
    list: [
      ['属性', [...new Set(pdata.Types)].map(x=>pmBase.data.get('typename', x||0)) ],
      ['特性', pdata.Abilities.map(x=>pmBase.data.get('tokusei', x||0)) ],
      ['种族值', pdata.Stats],
      ['蛋组', [...new Set(pdata.EggGroups)].map(x=>EggGroupNames[x||0])],

    ],
    card: true,
  });

  let learnset = Learnsets[pid];
  let wazadata = pmBase.data.get('wazadata');
  let wazaname = pmBase.data.get('wazaname');
  let table = Array.from(Array(3), () => Array(18).fill(""));
  let moves = [...new Set(learnset.map(x=>x[0]))].sort();
  for(let mi of moves){
    let data = wazadata[mi];
    /*
    table[data.Category||0][data.Type||0] += // getMoveIcon(data.Type||0) + wazaname[mi];
    `<span class="btn-group-toggle btn btn-light text-left m-1 float-left" style="width:150px;" data-toggle="buttons">
    <span class="badge badge-light">${getMoveIcon(data.Type||0)}</span>
    ${wazaname[mi]}</span>`;
*/
    let item = `
<div class="input-group float-left m-1" style="width:auto;">
  <div class="input-group-prepend">
    <div class="input-group-text" style="background-color:${TypeColors[data.Type||0]};border-color: transparent;">
      <div style="filter:brightness(100);">${getMoveIcon(data.Type||0)}</div>
    </div>
  </div>
  <div class="btn-group-toggle btn btn-light" data-toggle="buttons" style="width: 120px;">${wazaname[mi]}</div>
</div>
  `;
    table[data.Category||0][data.Type||0] += item;
  }
  // table = table.filter(x=>x[0] != '' || x[1] != '' || x[2] != '' );
  table = table.map(row=>[row.join('')]);
  table = [table[1], table[2], table[0]];

  content += pmBase.content.create({
    type: 'table',
    body: table,
    card: true,
  });

  return content;
}

function parsePage2(pid) {
  let levelup = [],
      eggs = [],
      tm = [],
      tr = [],
      tutor = [],
      others = []
      ;

  Learnsets[pid].forEach( ([mi, met]) => {
    let name = pmBase.data.get('wazaname', mi);
    let type = getMoveIcon(pmBase.data.get('wazadata')[mi].Type||0,16);
    if (met.startsWith('L')) {
      met = ({"L0":"进化"})[met]||met.replace('L','Lv.');
      levelup.push([type,name,met]);
    } else if (met.startsWith('TM')) {
      tm.push([type,name,met]);
    } else if (met.startsWith('TR')) {
      tr.push([type,name,met]);
    } else if (met.startsWith('T')) {
      tutor.push([type,name,met]);
    } else if (met.startsWith('E')) {
      met = '遗传';
      eggs.push([type,name,met]);
    } else {
      others.push([type,name,met]);
    }
  });

  let content = '<div class="row">';
  [
    ["升级", levelup],
    ["招式学习器", tm],
    ["招式记录", tr],
    ["教学", tutor],
    ["遗传", eggs],
    ["其他", others],
  ].forEach(x=>{
    content += '<div class="col-12 col-md-6 col-lg-3 col-xl-2">';
    content += pmBase.content.create({
      type: 'list',
      title: x[0],
      list: x[1],
      card: true,
    });
    content += '</div>';
  });
  content += '</div>';

  return content;
}

function parsePage3(pid) {

  let content = '';
  let learnset = Learnsets[pid];
  let wazadata = pmBase.data.get('wazadata');
  let wazaname = pmBase.data.get('wazaname');

  let moves = [...new Set(learnset.map(x=>x[0]))].sort();
  content += pmBase.content.create({
    type: 'list',
    columns: ['招式','属性','分类','攻击','命中','PP'],
    sortable: true,
    list: moves.map(mi=>{
      let mdata = wazadata[mi];
      return [
        wazaname[mi],
        getMoveIcon(mdata.Type||0) + pmBase.data.get('typename',mdata.Type||0),
        ['变化','物理','特殊'][mdata.Category||0],
        ( mdata.Power || 0 ) <= 1 ? '--' : ( mdata.Power || 0 ),
        ( ( mdata.Accuracy || 0 ) == 0 || mdata.Accuracy == 101 ) ? '--' : ( mdata.Power || 0 ),
        mdata.PP
      ];
    }),
    card: true,
  });

  return content;
}

function parsePage4(pid) {
  let partners = findPartners(pid);
  let learnset = Learnsets[pid];
  let eggs = learnset.filter( x => x[1].startsWith('E') ).map(x=>x[0]);
  if (partners.length == 0) {
    if(eggs.length == 0 ) {
      return `
      <div class="alert alert-success" role="alert">
      <h4 class="alert-heading">这只宝可梦不能生蛋。</h4>
      </div>`;
    } else {
      return `
      <div class="alert alert-success" role="alert">
      <h4 class="alert-heading">这只宝可梦不能生蛋。</h4>
      <p>请转至它的进化形查看它的遗传途径。</p>
      </div>`;
    }
  }
  else if (eggs.length == 0 ) {
    return `
    <div class="alert alert-success" role="alert">
    <h4 class="alert-heading">这只宝可梦没有遗传招式。</h4>
    </div>`;
  }

  let content = pmBase.content.create({
    type: 'list',
    columns: [
      {header:'招式',width:'20%'},
      {header:'自身拥有',width:'10%'},
      {header:'直接遗传',width:'40%'},
      {header:'间接遗传',width:'40%'}
    ],
    list: eggs.map(mi=> {
      let routes = findEggRoutes(pid, partners, mi);
      return [
        pmBase.data.get('wazaname', mi),
        learnset.find(x=>x[0]==mi && !x[1].startsWith('E')) ? '是' : '-',
        routes[0].map(x=>getPokemonIcon(x)).join(''),
        routes[1].map(x=>getPokemonIcon(x)).join(''),
      ];
    }),
    card: true,
  });
  return content;
}

function findPartners(pid) {
  let pokemonData = pmBase.data.get('pokemondata');
  let eggGroups = pokemonData[pid].EggGroups;
  
  let partners = [];
  if (eggGroups.includes(15)) return partners;

  partners.push(...EggGroups[eggGroups[0]]);
  if(eggGroups[0]!=eggGroups[1]) partners.push(...EggGroups[eggGroups[1]]);
  partners = [...new Set(partners)].sort();

  return partners;
}



function findEggRoutes(pid, partners, mi) {
  let parents1 = [];
  let parents2 = [];
  let families = pmBase.data.get('families', pid.replace('.0','.'));
  if( families == undefined ) {
    families = [pid];
  }
  else {
    families = families.map(x=>x.replace('.','.0'));
  }
  console.log(families);

  partners.forEach( pid2=> {
    if( families.includes(pid2) )return;
    let ls = Learnsets[pid2];
    if(!ls)return;
    if( ls.some(x=>x[0] == mi && x[1].startsWith('L') ) ) parents1.push(pid2);
    if( ls.some(x=>x[0] == mi && x[1].startsWith('E') ) ) parents2.push(pid2);
  });

  parents1 = filterParents(parents1);
  parents2 = filterParents(parents2);

  return [parents1, parents2];
}

function filterParents(arr){
  let arr2 = [...arr];
  for(let i=0;i<arr.length;i++){
    let dev = Devolutions[arr[i]];
    if ( !dev ) continue;
    if ( arr.includes(dev) ) arr2[i] = '';
  }
  return arr2.filter(x=>x.length>0);
}

function getPokemonIcon(pid) {
  return `<a href="${pmBase.url.getHref(pid)}">${pmBase.sprite.get('pi8',pid)}</a>`;
}
function getMoveIcon(type, size=16) {
  return pmBase.sprite.get('type',type,size);
}

pmBase.hook.on('init', init);