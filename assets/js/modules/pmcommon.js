const Config = {
  numberLength : 3,
  formLength : 2,
  pokemonNames : [''],
  formNames : {'000.00':''},

};

let getPokemonName= function ( key ) {
  return `{${key}}`;
};

let getPokemonID = function (num, form = null) {
  let numPart = Math.floor(num).toString().padStart(Config.numberLength, '0');
  let formPart = ( (form === null)
      ? (Number(num) - Math.floor(num)).toFixed(Config.formLength).split('.')[1]
      : form.toString()
    ).padStart(Config.formLength, '0');
  return numPart + "." + formPart;
};

let getNameInfo= function ( dexNumber, formIndex = 0 ) {
  let pkmnID = getPokemonID( dexNumber, formIndex );
  [ dexNumber, formIndex ] = pkmnID.split('.');
  let pkmnName = `{${pkmnID}}`;//pmBase.text.pokemon[ ~~dexNumber ];
  let formName = "", fullName = "";
  let nameFormat = '{0}（{1}）';

  if ( false && pkmnID in pmBase.data.formnames ) {
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
  }
};


window.pmCommon = pmBase.common = {
  getPokemonID,
  getPokemonName,
  getNameInfo,
  Config,
};