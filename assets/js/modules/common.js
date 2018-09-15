import text from './common.text.js';

let getPokemonID= function ( num, form = null ) {
  let numPart  = Math.floor(num).toString().padStart(3,'0');
  let formPart = ( ( form === null ) ? ( Number(num) - Math.floor(num) ).toFixed(2).split('.')[1] : form.toString() ).padStart(2,'0');
  return numPart + "." + formPart;
};

let getPokemonName= function ( key ) {
  return text.pokemon[ Math.floor(key) ];
};

window.pmCommon = pmBase.common = {
  getPokemonID,
  getPokemonName,
};

Object.assign( pmBase.text, text );