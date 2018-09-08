import poketoru from './core.js';
import popover from './popover.js';

function init() {
	let tbody = '';
	
	$.each( poketoru.megaList, function( pkmnID, pkmn ) {
		var pkmnID = pkmn.id;
		var pkmnNumber = pkmnID.split('.')[0];
		var pkmnSkill = '';
		var maxPower = 0;
		var url = pmBase.url.createUrlHash( 'pokemon', pkmnID );
		tbody += `
      <tr>
			  <td>${poketoru.getPokemonIcon(pkmn)}</td>
			  <td>${pkmn.dex}</td>
        <td><a href="${url}">${pkmn.info.fullname}</a></td>
			  <td data-text="${pkmn.type}">${pmBase.page.create('type',pkmn.type)}</td>
			  <td>${pkmn.power}</td>
			  <td data-text="${pkmn.mb-pkmn.msu}">${pkmn.mb} - ${pkmn.msu} = ${pkmn.mb - pkmn.msu}</td>
			  <td></td>
      </tr>
    `;
	});
	$(".p-result tbody").html(tbody);
	$(".p-result").tablesorter();
	popover.apply();
};

pmBase.hook.on( 'init', function(){
	init();
});