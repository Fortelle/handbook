import core from './core.js';

function init(){
  pmBase.data.add('nesthole', '../data/nesthole.json');
  pmBase.data.add('monsname', '../text/monsname.json');

  pmBase.data.load(function() {

    let body = [];
    let nesthole = pmBase.data.get('nesthole');

    let selector = {};
    for (let i = 0; i < nesthole.Encounters.length; i++) {
      if (nesthole.Encounters[i].Game == '1'){
        selector[i / 2] = i / 2;
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
      columns: ['宝可梦', '等级', '☆1','☆2','☆3','☆4','☆5','特性','31基础点数' ],
      list: tables[i].map(slot => [
        pmBase.sprite.get("pi8",pmCommon.getPokemonID(slot.Pokemon,slot.GMax?999:(slot.Form||0),3)),
        pmBase.data.get("monsname", slot.Pokemon),
        ...slot.Weights.map(x=>x>0?`${x}%`:'-'),
        ['特性1','特性2','隐藏特性','普通特性','随机特性'][slot.Ability],
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