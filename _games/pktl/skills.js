import poketoru from './core.js';
import skillData from './data/skills.js';

function filter() {
	let tbody = '';
	
	$.each( skillData, function( i, sData ) {
	  let rate = `${sData.rate[0]}% / ${sData.rate[1]}% / ${sData.rate[2]}%`;
	  let exp = sData.exp.join(' / ');
	  let growth = ( sData.type == 1 ) ?
	    `+ ${sData.growth[0]}% / ${sData.growth[1]}% / ${sData.growth[2]}% / ${sData.growth[3]}%` :
	    `x ${sData.growth[0]} / ${sData.growth[1]} / ${sData.growth[2]} / ${sData.growth[3]}`;
	    
		tbody += `
      <tr>
			  <td>${sData.name}</td>
			  <td>${sData.desc}</td>
			  <td>${sData.damage}</td>
			  <td>${rate}</td>
			  <td>${growth}</td>
			  <td>${exp}</td>
      </tr>
    `;
	});	
	$(".c-pktl-result tbody").html(tbody);
};

pmBase.hook.on( 'init', function(){
	filter();
});