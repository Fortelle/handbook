import pokemonData from './data/pokemondata.js';

function init(){
  var html = ''
  $.each( pokemonData, function( i, pData) {
    html += '<option value="'+i+'">'+String('00').concat(i).slice(-3) + ' ' + pmBase.util.getPokemonName(i)+'</option>';
  });
  $('.calc__pokemon').html(html);
  
  $('.calc__ok').click(calc);
}

function calc(){
  var pi = parseInt($('.calc__pokemon').val(),10);
  var lv = parseInt($('.calc__level').val(),10);
  var hp = parseInt($('.calc__hp').val(),10);
  var atk = parseInt($('.calc__atk').val(),10);
  var pData = pokemonData[pi];
  
  var bsHp = pData.hpBasis;
  var bsAtk = pData.attackBasis;
  
  var ivHp = hp - bsHp - lv;
  var ivAtk = atk - bsAtk - lv;
  
  $('.calc__hpresult').val(ivHp);
  $('.calc__atkresult').val(ivAtk);
}

pmBase.hook.on( 'init', init);