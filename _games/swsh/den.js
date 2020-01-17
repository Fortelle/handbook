import core from './core.js';

function init(){
  pmBase.data.add('misc', '../data/encounter_misc.json');
  pmBase.data.add('nesthole', '../data/nesthole.json');
  pmBase.data.add('monsname', '../text/monsname.json');

  pmBase.data.load(function() {

    let body = [];
    let nesthole = pmBase.data.get('nesthole');
    let misc = pmBase.data.get('misc');

    let selector = [];
    let content = '';

    let patternNests = Array.from({length:nesthole.Encounters.length/2},_=>'');

    let areaIndexes = [...new Set(misc.NestList.map(x=>x[0]))];
    areaIndexes.forEach(areaIndex=> {
      let areaNests = misc.NestList.filter(x=>x[0]==areaIndex);
      let list = [];

      areaNests.forEach(([_, nestIndex, normalIndex, rareIndex]) => {
        let nestId = `${areaIndex}-${nestIndex}`;
        let nestName = `${misc.WildAreaNames[areaIndex]}-${nestIndex}`;
        let pattern4 = [
          nesthole.Encounters[normalIndex*2],
          nesthole.Encounters[normalIndex*2+1],
          nesthole.Encounters[rareIndex*2],
          nesthole.Encounters[rareIndex*2+1]
        ];
        let patternText = pattern4.map(pattern=> {
          let pokemonList = pattern.Slots.filter((x,i)=>i>=7).map(x=>pmCommon.getPokemonID(x.Pokemon,x.GMax?'999':x.Form));
          let ret = pokemonList.map(x=>pmBase.sprite.get('pi8', x)).join('');
          return '…'+ret;
        });
        list.push([
          nestIndex,
          `<a href="${pmBase.url.getHref(normalIndex)}">#${normalIndex}</a>`,
          patternText[0],
          patternText[1],
          `<a href="${pmBase.url.getHref(rareIndex)}">#${rareIndex}</a>`,
          patternText[2],
          patternText[3],
        ]);

        patternNests[normalIndex] += ' ' + nestName;
        patternNests[rareIndex] += ' ' + nestName;

/*
        selector.push({
          value: nestId,
          text: nestName,
        });
*/
      });

      content += pmBase.content.create({
        type: 'list',
        title: misc.WildAreaNames[areaIndex],
        columns: ['编号', '普通种类', '剑', '盾', '稀有种类', '剑','盾' ],
        list: list,
        card: true,
      });

    });

    selector = patternNests.map( (x, i)=> {
      return { text: `#${i}${x}`, value: i };
    });

    pmBase.content.build({
      pages: [{
        content: content,
      }, {
        selector: selector,
        content: show,
      }]
    });

  });
}


function show(hash) {
  let nestIndex = ~~hash.value * 2;
  let encounters = pmBase.data.get('nesthole').Encounters;
  let nestHash = encounters[nestIndex].Hash;
  let tables = [
    encounters.find(x => x.Hash == nestHash && x.Game == 1).Slots,
    encounters.find(x => x.Hash == nestHash && x.Game == 2).Slots
    ];

  let html = '';
  ['剑','盾'].forEach( (x,i)=> {
    html += `<h3>${x}</h3>`;
    html += pmBase.content.create({
      type: 'list',
      columns: ['宝可梦', '等级', '☆1','☆2','☆3','☆4','☆5','特性','最佳个体' ],
      list: tables[i].map(slot => [
        pmBase.sprite.get("pi8",pmCommon.getPokemonID(slot.Pokemon,slot.GMax?999:(slot.Form||0),3)),
        pmBase.data.get("monsname", slot.Pokemon),
        ...slot.Weights.map(x=>x>0?`${x}%`:'-'),
        ['特性1','特性2','隐藏','普通','随机'][slot.Ability],
        slot.BestIV,
      ]),
      card: true,
    });
  });

  return {
    content: html,
  };
}

pmBase.hook.on( 'load', init );