import text from './main.text.js';

let getNameInfo= function ( dexNumber, formIndex = 0 ) {
  let pkmnID = pmBase.common.getPokemonID( dexNumber, formIndex );
  [ dexNumber, formIndex ] = pkmnID.split('.');
  let pkmnName = pmBase.text.pokemon[ ~~dexNumber ];
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
  
window.pmMain = pmBase.main = {
  getNameInfo,
};
  /*

pmBase.common = {
  getPokemonID,
  getPokemonName,
};

pmBase.text = text;*/
Object.assign( pmBase.text, text );