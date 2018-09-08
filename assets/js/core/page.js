import url from './url.js';
import data from './data.js';

/**********************************/

let pageMode, callback, selector;

const changeTab = function (index) {
  $('.l-tab-controller')[index].checked=true;
};

const listen = function ( _callback, _selector = '.p-selector' ) {
  pageMode = pageInfo.pageMode;
  callback = _callback;
  selector = _selector;
  parseHash();
  window.addEventListener("hashchange", parseHash);
	$(selector).change( function(){url.setHash(this.value); });
};

const parseHash = function (){
	let key = url.getHash();
	if ( key.length > 0 ) {
	  let success = callback(key);
	  if ( success ) {
      $(selector).val(key);
      if ( pageMode == 2 ) {
  	    window.scrollTo(0, 0);
  	    changeTab(1);
      }
	    return true;
	  }
	} else {
	  if ( pageMode == 2 ) changeTab(0);
	}
	return false;
};

const setTitle = function ( title ){
	let titlePart = ( title ) ? title + siteInfo.separater + pageInfo.title : pageInfo.title;
	window.title = titlePart + siteInfo.separater + pageInfo.gameName + siteInfo.separater + siteInfo.title;
};

const createSelector = function ( html ) {
  $('.p-page__control')[0].innerHTML = `<select class="form-control p-selector">${html}</select>`;
};

const setControl = function ( html, pageIndex = 0 ) {
  html = html.trim();
  if ( html.startsWith('<option') ) html = `<select class="form-control p-selector">${html}</select>`;
  $('.p-page__control')[pageIndex].innerHTML = html;
};

const setContent = function ( html, pageIndex = 0 ) {
  $('.p-page__content')[pageIndex].innerHTML = html;
};

/**********************************/

let createFunctions = {
  
  'type' : function( value, value2 = null ) {
    let name = Number.isInteger(value) ? data.typenames[value] : value;
    let html = `<span class="o-badge o-badge--type t-type--${name}">${name}</span>`;
    if ( value2 !== null && value2 != value ) {
      name = Number.isInteger(value2) ? data.typenames[value2] : value2;
      html += `<span class="o-badge o-badge--type t-type--${name}">${name}</span>`;
    }
    return html;
  },
  
  'select' : function( html ) {
    return `<select class="form-control p-selector">${html}</select>`;
  },
  
  'info' : function( data ) {
    if ( typeof data !== 'string' ) data = data.map( x=> `<tr><td>${x.join('</td><td>')}</td></tr>` ).join('');
    return `<table class="table table-sm p-infotable"><tbody>${data}</tbody></table>`;
  },
  
  'list' : function( data, header = '' ) {
    if ( typeof data !== 'string' ) data = data.map( x=> `<tr><td>${x.join('</td><td>')}</td></tr>` ).join('');
    if ( typeof header !== 'string' ) header = header.map( x=> `<tr><th>${x.join('</th><th>')}</th></tr>` ).join('');
    return `<table class="table table-sm p-listtable">
      <thead>${header}</thead>
      <tbody>${data}</tbody>
    </table>`;
  },
}

let create = function( key, ...args) {
  key = key.toLowerCase();
  if ( key in createFunctions ) {
    return createFunctions[key].apply(null, args);
  } else {
    return '[err]';
  }
};


export default {
  listen,
  create,
  createSelector,
  setControl,
  setContent,
  setTitle,
}