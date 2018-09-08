var arr2obj = function( arr, names, func ) {
  for ( var i in arr ) {
    var obj = { index: i };
    var a = arr[i];
    for ( var j in names ) {
      obj[names[j]] = a[j];
    }
    if ( func ) obj = func( i, obj );
    arr[i] = obj;
  }
  return arr;
};

var getPokemonID = function ( num, form = null ) {
  let numPart  = Math.floor(num).toString().padStart(3,'0');
  let formPart = ( ( form === null ) ? ( Number(num) - Math.floor(num) ).toFixed(2).split('.')[1] : form.toString() ).padStart(2,'0');
  return numPart + "." + formPart;
};

var getPokemonName = function ( key ) {
  return pmBase.data.pokemonnames[ Math.floor(key) ];
};

var getPokemonInfo = function ( dexNumber, formIndex = 0 ) {
  let pkmnID = getPokemonID( dexNumber, formIndex );
  [ dexNumber, formIndex ] = pkmnID.split('.');
  let pkmnName = pmBase.data.pokemonnames[ ~~dexNumber ];
  let formName = "", fullName = "";
  let nameFormat = '{0}（{1}）';
  
  if ( pkmnID in pmBase.data.formnames ) {
    let form = pmBase.data.formnames[pkmnID];
    if ( Array.isArray(form) ) {
      formName = form[1].replace( '{0}', pkmnName ).replace( '{1}', form[0] );
    } else {
      formName = form;
    }
  }
  
  if ( !formName ) {
    fullName = pkmnName;
  } else if ( formName.includes(pkmnName) ) {
    fullName = formName;
  } else {
    fullName = `${pkmnName}（${formName}）`;
  }
  
  return {
    id: pkmnID,
    number: dexNumber,
    name: pkmnName,
    form: formName,
    fullname: fullName
  };
};

let sheet,styleEl;

function addCSS(rule) {
  if ( !sheet ) {
    styleEl = document.createElement("style");
    document.head.appendChild(styleEl);
    sheet = styleEl.sheet;
  }
  //sheet.insertRule(rule, sheet.cssRules.length);
  styleEl.textContent += rule;
}

export default {
  arr2obj,
  getPokemonID,
  getPokemonName,
  getPokemonInfo,
  addCSS
}