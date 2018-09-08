import poketoru from './core.js';
import skillData from './data/skills.js';

const createContent = function() {
  let pkmnId = this.getAttribute('data-pid');
  let pkmnData = poketoru.getPokemonData(pkmnId);
  if ( !pkmnData ) {
    let megaData = poketoru.getMegaData(pkmnId);
    if ( !megaData ) return;
    pkmnData = poketoru.getPokemonData(megaData.originID);
  }
  
  let icon = pmBase.sprite.get('pokemon',pkmnData.icon);
  let type = pmBase.page.create('type',pkmnData.type);
  let skills = pkmnData.skills.map( s => skillData[s].name ).join('<br>');
  
  let html = `
  <div style="width:320px;font-size:small;">
    <div class="row">
      <div class="col-2">${pkmnData.dex}</div>
      <div class="col-4 text-left">${pkmnData.info.name}</div>
      <div class="col-6 text-right">${pkmnData.info.form}</div>
    </div>
    <hr class="mt-1 mb-1">
    <div class="row">
      <div class="col-4 text-center">${icon}</div>
      <div class="col-8">
        <div class="row">
          <div class="col-5 text-right">属性</div><div class="col-7 text-center">${type}</div>
          <div class="col-12"><hr class="m-0"></div>
          <div class="col-5 text-right">攻击力</div><div class="col-7 text-center">${pkmnData.power} ～ ${pkmnData.maxPower}</div>
          <div class="col-12"><hr class="m-0"></div>
          <div class="col-5 text-right">等级</div><div class="col-7 text-center">${pkmnData.maxLevel}</div>
          <div class="col-12"><hr class="m-0"></div>
          <div class="col-5 text-right">能力</div><div class="col-7 text-center">${skills}</div>
        </div>
      </div>
    </div>
  `;
  
  if ( pkmnData.hasMega ) {
    poketoru.megaEvolutionDict[pkmnData.id].forEach( function( megaID ) {
      let megaData = poketoru.getMegaData(megaID);
      icon = pmBase.sprite.get('pokemon',megaData.icon);
      type = pmBase.page.create('type',megaData.type);
      html += `
    <hr class="mt-2 mb-2">
    <div class="row">
      <div class="col-4 text-center">${icon}</div>
      <div class="col-8">
        <div class="row">
          <div class="col-5 text-right">属性</div><div class="col-7 text-center">${type}</div>
          <div class="col-12"><hr class="m-0"></div>
          <div class="col-5 text-right">进化速度</div><div class="col-7 text-center">${megaData.mb} - ${megaData.msu} = ${megaData.mb - megaData.msu}</div>
        </div>
      </div>
    </div>`;
    });
  }
  
  html += '</div>';
  return html;
};
const apply = function() {
  $('.p-pkmn').popover({
    content: createContent,
    html: true,
    placement: 'top',
    trigger: 'hover '
  })
};

export default {
  apply
}