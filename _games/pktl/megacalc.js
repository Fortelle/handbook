import poketoru from './core.js';
import popover from './popover.js';

function init() {
	let tbody = '';
  let sumMSU = 0;
  
  let html = `
  <div class="card">
  <div class="card-body p-text"></div>
  </div>
  <hr>
  <div class="row no-gutters ">`;
  Object.keys( poketoru.megaList )
    .map( megaID => poketoru.getMegaData(megaID) )
    .sort(function(pkmn1, pkmn2) {
      return pkmn1.dex - pkmn2.dex || pkmn1.form - pkmn2.form;
    })
    .forEach( megaData => {
      let pkmnData = poketoru.getPokemonData(megaData.originID);
      sumMSU += megaData.msu;
      html += `<div class="col-1 small"><label style="display:block;">
      <div class="card m-1"><div class="card-body p-1 text-center">
  		  ${ poketoru.getPokemonIcon( megaData ) }
  		  <input type="checkbox" name="msu" value="${megaData.msu}" style="display:none;"  />
        <br>${megaData.ms} - ${megaData.msu} = ${megaData.ms - megaData.msu}
      </div></div>
      </label></div>`;
    });
    html+='</div>';
  pmBase.content.build({
    pages: 1,
    content1: html
  });
	popover.apply();
	$('input[name=msu]').change(function(){
	  let sumUsedMSU = 0;
	  $(this).parents('.card').toggleClass('bg-primary');
	  $('input[name=msu]:checked').each(function(){
      sumUsedMSU += ~~this.value;
    });
	  $('.p-text').html(`超级进化加速总数：${sumMSU}个，已使用${sumUsedMSU}个，还需要${sumMSU-sumUsedMSU}个。`);
	});
};


pmBase.hook.on( 'load', init );