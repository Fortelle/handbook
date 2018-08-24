import poketoru from './core.js';

function filter() {
	let tbody = '';
	
	$.each( poketoru.megaList, function( pkmnID, pkmn ) {
		
		var pkmnID = pkmn.id;
		var pkmnNumber = pkmnID.split('.')[0];
		var pkmnSkill = '';
		var maxPower = 0;
		var a = pmBase.url.createAnchor( 'pktl-pokemon', pkmnID, pkmn.name );
		tbody += `
      <tr>
			  <td>${pmBase.sprite.get('pktl-pokemon',pkmn.icon,48)}</td>
			  <td>${pkmn.dex}</td>
			  <td>${a}</td>
			  <td data-text="${pkmn.type}">${pmBase.builder.create('type',pkmn.type)}</td>
			  <td>${pkmn.power}</td>
			  <td data-text="${pkmn.mb-pkmn.msu}">${pkmn.mb} - ${pkmn.msu} = ${pkmn.mb - pkmn.msu}</td>
			  <td></td>
      </tr>
    `;
	});	
	$(".c-pktl-result tbody").html(tbody);
	$(".c-pktl-result").tablesorter();
};

pmBase.hook.on( 'init', function(){
	filter();
});