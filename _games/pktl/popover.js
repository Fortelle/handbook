import poketoru from './core.js';
import textDict from './data/text.js';
import skillData from './data/skills.js';
import { megaEvolutionDict } from './data/misc.js';

const createContent = function() {
  let pkmnId = this.getAttribute('data-pid');
  let pkmnData = poketoru.getPokemonData(pkmnId);
  if ( !pkmnData ) {
    let megaData = poketoru.getMegaData(pkmnId);
    pkmnId = megaData.originID;
    pkmnData = poketoru.getPokemonData(pkmnId);
  }
  let icon = pmBase.sprite.get('pokemon',pkmnData.icon);
  let type = pmBase.content.create('type',pkmnData.type);
  let skills = pkmnData.skills.filter(s=>s>0).map( s => skillData[s].name ).join('<br>');
  
  let html = `
  <div style="width:320px;font-size:small;">
    <div class="row">
      <div class="col-6">${pkmnData.number.toString().padStart(3,0)} ${pkmnData.name}</div>
      <div class="col-6 text-right">${pkmnData.formname}</div>
    </div>
    <hr class="mt-1 mb-1">
    <div class="row">
      <div class="col-4 text-center">${icon}</div>
      <div class="col-8">
        <div class="row">
          <div class="col-5 text-right">属性</div><div class="col-7 text-center">${type}</div>
          <div class="col-12"><hr class="m-0"></div>
          <div class="col-5 text-right">攻击力</div><div class="col-7 text-center">${poketoru.getAttack( pkmnData.group,1)} ～ ${poketoru.getAttack( pkmnData.group,pkmnData.rml+10)}</div>
          <div class="col-12"><hr class="m-0"></div>
          <div class="col-5 text-right">等级</div><div class="col-7 text-center">+${pkmnData.rml}</div>
          <div class="col-12"><hr class="m-0"></div>
          <div class="col-5 text-right">能力</div><div class="col-7 text-center">${skills}</div>
        </div>
      </div>
    </div>
  `;
  
  if ( pkmnId in megaEvolutionDict ) {
    megaEvolutionDict[pkmnData.id].forEach( function( megaID ) {
      let megaData = poketoru.getMegaData(megaID);
      icon = pmBase.sprite.get('pokemon',megaData.icon);
      type = pmBase.content.create('type',megaData.type);
      html += `
    <hr class="mt-2 mb-2">
    <div class="row">
      <div class="col-4 text-center">${icon}</div>
      <div class="col-8">
        <div class="row">
          <div class="col-5 text-right">属性</div><div class="col-7 text-center">${type}</div>
          <div class="col-12"><hr class="m-0"></div>
          <div class="col-5 text-right">进化速度</div><div class="col-7 text-center">${megaData.ms} - ${megaData.msu} = ${megaData.ms - megaData.msu}</div>
          <div class="col-12"><hr class="m-0"></div>
          <div class="col-5 text-right">超级效果</div><div class="col-7 text-center">${poketoru.getMegaEffect(megaData)}</div>
        </div>
      </div>
    </div>`;
    });
  }
  
  html += '</div>';
  return html;
};


const apply = function() {
  $('.p-pkmn .p-pkmn').each(function(){
    let pid = this.getAttribute('data-pid');
    debug(pid);
    $(this).parents('.p-pkmn')[0].setAttribute('data-pid', pid);
    $(this).removeClass('p-pkmn');
  });
  
  $('.p-pkmn').popover({
    content: createContent,
    html: true,
    placement: 'top',
    trigger: 'hover '
  });
};

export default {
  apply
}