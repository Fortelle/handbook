import poketoru from './core.js';
import { typeEffects } from './data/misc.js';

function init(){
  let html = '';
  
  html = '';
  html += `<option value="-1">-</option>`;
  $.each( pmBase.data.typenames, function( i, t ) {
    html += `<option value="${i}">${t}</option>`;
  });
  $('.c-pktl-type').html(html);
  $('.c-pktl-type').change( change );
}

function change(){
  let atkTypes = $('.c-pktl-type').map(function() {
      if(this.value>-1) return this.value;
    }).get();
  let defTypes = new Array(18).fill(-1);
  
  $.each( atkTypes,function( i, t ) {
    $.each( typeEffects[t],function( j, u ) {
      if( u==2 ) defTypes[j] = u;
      else if ( u < 1 && defTypes[j] < 1 ) defTypes[j] = u;
      else if ( defTypes[j] == -1 ) defTypes[j] = 1;
    });
  });
  
  let a='',b='',c='';
  
  $.each( defTypes,function( t, v ) {
    let s = pmBase.builder.create('type',t);
    if ( v == 2 ) a += s;
    else if ( v == 1 ) b += s;
    else if ( v == 0.5 ) c += s;
  });
  $('.c-pktl-te1').html(a);
  $('.c-pktl-te2').html(b);
  $('.c-pktl-te3').html(c);
}

pmBase.hook.on( 'init', function(){
	init();
});