import NBNG from './core.js'

const stars = ['', '★', '★★', '★★★', '★★★★', '★★★★'];
const scenarioText = ['⓪', ' ① ', '② ', '③', ' ④', ' ⑤', ' ⑥', ' ⑦', ' ⑧ ', '⑨ ', '⑩'];
const rankText = ['', 'I', 'II', 'III'];

function init() {
  pmBase.data.add('pokemon', '../data/pokemon.json');
  pmBase.data.add('text', '../data/text.json');

  pmBase.data.load(function () {
    var text = pmBase.data.get('text');

    let selector = pmBase.data.get('pokemon').map( (pkmnData, pkmnIndex) =>{
      return {
        value: pkmnIndex,
        text: text.pokemon[pkmnIndex],
      };
    });

    let list = pmBase.content.create({
      type: 'list',
      sortable: true,
      columns: [
        '图标',
        '宝可梦',
        '属性',
        'HP',
        '攻击力',
        '防御力',
        '速度',
        '移动',
        '招式',
        '特性',
      ],
      list: pmBase.data.get('pokemon').map((pkmnData, pkmnIndex) => [
        pmBase.sprite.get('pokemon', pkmnIndex),
        `<a href="${pmBase.url.getHref( pkmnIndex )}">${text.pokemon[pkmnIndex]}</a>`,
        [...new Set(pkmnData.Types)].filter(x => x >= 0).map(x => text.types[x]).join('/'),
        pkmnData.HP,
        pkmnData.Stats[0],
        pkmnData.Stats[1],
        pkmnData.Stats[2],
        pkmnData.Movement,
        pkmnData.Waza > 0 ? text.moves[pkmnData.Waza] : '',
        [...new Set(pkmnData.Abilities)].filter(a => a >= 0).map(a => text.abilities[a]).join('/'),
      ]),
    });

    pmBase.content.build({
      pages: [{
        selector: selector,
        content: list,
      }, {
        selector: selector,
        content: show,
      }]
    });

  });

}

function getBuilding(kuniIndex, encIndex) {
  let buildingIndex = encounterBuildings[kuniIndex][encIndex];
  let buildingData = buildingDataArray[buildingIndex];
  let icon = pmBase.sprite.get('building', buildingData.icon1);
  let name = textDict.buildings[buildingIndex];
  return `${icon}<br><small>${name}</small>`;
}

function show(hash) {
  let pkmnIndex = ~~hash.value;
  let pkmnData = pmBase.data.get('pokemon')[pkmnIndex];
  if (!pkmnData) return;
  var text = pmBase.data.get('text');

  let html = '';
  html += '<h3>栖息地</h3>';

  let habitats = pkmnData.Habitats.split('').map(x=>!!~~x);
  html += pmBase.content.create({
    type: 'list',
    columns: [
      '图标',
      '城池',
      '设施1',
      '设施2',
      ...[...Array(11)].map((_,i)=>`剧本${i}`)
    ],
    list: [...Array(16)].map((_,i) => !habitats[i*2] && !habitats[i*2+1] ? null : [
      pmBase.sprite.get('kuni', i),
      text.kuni[i],
      [...new Set(pkmnData.Types)].filter(x => x >= 0).map(x => text.types[x]).join('/'),
      habitats[i * 2],
      habitats[i * 2 + 1],
      //...scenarioDataArray.map((x, j) => x.appearPokemon[pkmnIndex] ? pmBase.content.create('stack', 'circle', j) : '')
    ]).filter(x=>!!x),
  });

  return {
    content: html
  };

  //let b1 = s1 ? getBuilding(i, 0) : '';
  //let b2 = s2 ? getBuilding(i, 1) : '';

  let listBushoData = bushoLinkDataArray
    .map((linkArray, bushoIndex) => {
      let bushoData = bushoDataArray[bushoIndex];
      let icon = pmBase.sprite.get('busho_o', bushoData.icon);
      let name = textDict.warriors[bushoIndex];
      let link = pmBase.url.getHref('busho', bushoIndex);
      let types = pmBase.content.create('type', bushoData.types[0], bushoData.types[1]);
      let power = textDict.powers[bushoData.power];
      return [
        icon,
        `<a href="${link}">${name}</a> <sup>${rankText[bushoData.rank]}</sup>`,
        types,
        power,
        bushoData.stats[0],
        bushoData.stats[1],
        bushoData.stats[2],
        bushoData.stats[3],
        NBNG.getBestLinkText(linkArray[pkmnIndex]),
      ];
    });
  let listBushoHead = [
    '图标',
    '武将',
    '擅长属性',
    '武将之力',
    '力量',
    '智力',
    '魅力',
    '才量',
    '最大连接',
  ];

  let listHabitatHead = [
    '图标',
    '城池',
    '设施1',
    '设施2',
    ...[...Array(11)].map((_,i)=>`剧本${i}`)
  ];
/*
  let html = `
<h3>栖息地</h3>
${pmBase.content.create('list', listHabitatData,listHabitatHead)}
<h3>最大连接的武将</h3>
${pmBase.content.create('sortlist', listBushoData,listBushoHead,"[8,1]")}
  `;*/
  return html;
}

pmBase.hook.on('init', init);
