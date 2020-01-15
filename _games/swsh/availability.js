import core from './core.js';

function init() {
  pmBase.data.add('encounters', '../data/encounters.json');
  pmBase.data.add('nesthole', '../data/nesthole.json');
  pmBase.data.add('monsname', '../text/monsname.json');

  pmBase.data.load(function () {

    let body = [];
    let pokemonList = {};

    let encounters = pmBase.data.get('encounters');
    for (let fileName in encounters) {
      let version = fileName.endsWith('k') ? 1 : 2;
      for (let map of encounters[fileName]) {
        for (let table of map) {
          for (let slot of table.Slots) {
            let pmId = pmCommon.getPokemonID(slot[0], slot[1], 3);
            if (!(pmId in pokemonList)) {
              pokemonList[pmId] = {
                id: pmId,
                wild: 0,
                raid: 0,
                ha: false
              };
            }
            pokemonList[pmId].wild |= version;
          }
        }
      }
    }

    let nesthole = pmBase.data.get('nesthole').Encounters;
    for (let table of nesthole) {
      let version = table.Game;
      for (let slot of table.Slots) {
        let pmId = pmCommon.getPokemonID(slot.Pokemon, slot.Form||0, 3);
        if (!(pmId in pokemonList)) {
          pokemonList[pmId] = {
            id: pmId,
            wild: 0,
            raid: 0,
            ha: false
          };
        }
        pokemonList[pmId].raid |= version;
        pokemonList[pmId].ha |= slot.Ability >= 3;
      }
    }

    let pokemonArray = Object.values(pokemonList).sort((a, b) => a.id > b.id ? 1 : -1);
    let html = '';
    html += pmBase.content.create({
      type: 'list',
      sortable: true,
      columns: ['图标', '编号', '宝可梦', '野生（剑）', '野生（盾）', '巢穴（剑）', '巢穴（盾）', '隐藏特性'],
      list: pokemonArray.map(x => [
        pmBase.sprite.get("pi8", x.id),
        `#${x.id.split('.')[0]}`,
        pmBase.data.get('monsname')[~~x.id.split('.')[0]],
        (x.wild & 1) == 1 ? '<i class="fa fa-check"></i>' : '',
        (x.wild & 2) == 2 ? '<i class="fa fa-check"></i>' : '',
        (x.raid & 1) == 1 ? '<i class="fa fa-check"></i>' : '',
        (x.raid & 2) == 2 ? '<i class="fa fa-check"></i>' : '',
        x.ha ? '<i class="fa fa-check"></i>' : '',
      ]),
      card: true,
    });
    console.log(pokemonArray)

    pmBase.content.build({
      pages: [{
        content: html,
      }]
    });

  });
}


pmBase.hook.on('load', init);