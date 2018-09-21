import config from './config.js';
import url from './url.js';

const coreTypeNames = [
  "一般",
  "格斗",
  "飞行",
  "毒",
  "地面",
  "岩石",
  "虫",
  "幽灵",
  "钢",
  "火",
  "水",
  "草",
  "电",
  "超能力",
  "冰",
  "龙",
  "恶",
  "妖精",
];

let typeNames;

let createFunctions = {
  
  'type' : function( value, value2 = null ) {
    if ( !typeNames ) typeNames = pmBase.config.get( 'typenames', coreTypeNames);
    let name = Number.isInteger(value) ? typeNames[value] : value;
    let html = `<span class="o-badge o-badge--type t-type--${name}">${name}</span>`;
    if ( value2 !== null && value2 != value ) {
      name = Number.isInteger(value2) ? typeNames[value2] : value2;
      html += `<span class="o-badge o-badge--type t-type--${name}">${name}</span>`;
    }
    return html;
  },
  
  'select' : function( html ) {
    return `<select class="form-control p-selector">${html}</select>`;
  },
  
  'info' : function( data, image ) {
    let imageTD = image ? `<div class="col-3 d-flex"><div class="align-self-center flex-grow-1 text-center">${image}</div></div>` : '';
    if ( typeof data !== 'string' ) data = data.map( (x,i)=> `<tr><td>${x.join('</td><td>')}</td></tr>` ).join('');
    return `<div class="row">
      <div class="col-${imageTD?9:12}">
        <table class="table table-sm p-infotable">
          <tbody>${data}</tbody>
        </table>
      </div>
      ${imageTD}
    </div>`;
  },
  
  'list' : function( dataTable, header = '', classes = '', attr = '' ) {
    if ( typeof dataTable !== 'string' ) dataTable = dataTable.map( x=> `<tr><td>${x.join('</td><td>')}</td></tr>` ).join('');
    if ( typeof header !== 'string' ) header = `<tr><th>${header.join('</th><th>')}</th></tr>`;
    return `<table class="table table-sm table-hover text-center p-listtable ${classes}" ${attr}>
      <thead>${header}</thead>
      <tbody>${dataTable}</tbody>
    </table>`;
  },
  
  'sortlist' : function( data, header = '', defaultSortColumn = '' ) {
    let attr = defaultSortColumn === ''
      ? ''
      : typeof defaultSortColumn === 'number'
        ? `data-sortlist="[[${defaultSortColumn},0]]"`
        : `data-sortlist="[${defaultSortColumn}]"`;
    return create( 'list', data, header, 'sortable', attr );
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

let buildingOptions;

let build = function( options ) {
  buildingOptions = options;
  let html = '';
  for ( let i=1; i<=options.pages; i++ ) {
    let htmlControls = '', htmlContent = '';
    if ( options[`control${i}`] ) {
      htmlControls = createSelector(options[`control${i}`]);
      options[`control${i}`] = '';
    }
    if ( typeof options[`content${i}`] === 'string' ) {
      htmlControls = options[`content${i}`];
      //options[`content${i}`] = '';
    }
    
    html += `
      <input class="l-tab-controller" type="radio" name="layouttab" ${i==1?'checked':''} />
      <div class="p-page p-page--${i}">
        <div class="p-page__control">${htmlControls}</div>
        <div class="p-page__content">${htmlContent}</div>
      </div>
    `;
  }
  $('.l-page__body').html(html);
	$('.p-select-prev').click( function(){ url.setHash($(this).parents('.p-page__control').find('.p-selector option:selected').prev().val()); });
	$('.p-select-next').click( function(){ url.setHash($(this).parents('.p-page__control').find('.p-selector option:selected').next().val()); });
	$('.p-selector').change( function(){ url.setHash(this.value); });
  
  if ( !options.hashParser ) options.hashParser = function( hashValue ){
    if ( hashValue.length === 0 ) {
      return 1;
    } else {
      return options.pages;
    }
  }
  if ( onHashChange() === false && options.pages ===1 && options.content1 instanceof Function ) {
    
  }
  
  window.addEventListener("hashchange", onHashChange );
  
  $('.c-loading').remove();
};

const onHashChange = function (){
	let hashValue = url.getHash();
  if ( /^\d+$/.test(hashValue) ) hashValue = ~~hashValue;
	let targetPage = buildingOptions.hashParser( hashValue );
	
  if ( buildingOptions[`content${targetPage}`] instanceof Function ) {
    let html = hashValue === '' ? '' : buildingOptions[`content${targetPage}`](hashValue);
    if ( targetPage === 1 && !html ) {
      hashValue = $('.p-page--1 .p-selector option:first').val();
      if ( /^\d+$/.test(hashValue) ) hashValue = ~~hashValue;
      html = buildingOptions[`content${targetPage}`](hashValue);
    }
    if ( html ) {
      $(`.p-page--${targetPage} .p-page__content`).html( html );
      $(`.p-page--${targetPage} .p-selector`).val(hashValue);
    } else {
      targetPage = 1;
    }
  }
	//$(`.p-page--${targetPage} .p-selector`).val(0)
	$('.p-listtable.sortable').removeClass('sortable').tablesorter();
	
	changeTab( targetPage );
	if ( targetPage > 1 ) {
	  window.scrollTo(0, 0);
    return true;
	} else {
	  return false;
	}
};

let createSelector = function(html) {
  html = html.trim();
  if ( html.startsWith('<option') ) {
    html = `<div class="input-group">
      <div class="input-group-prepend">
      </div>
      <select class="form-control p-selector">${html}</select>
      <div class="input-group-append">
        <button class="btn p-select-prev" type="button"><i class="fas fa-arrow-left"></i></button>
        <button class="btn p-select-next" type="button"><i class="fas fa-arrow-right"></i></button>
      </div>
    </div>`;
  }
  return html;
};

/*******************/

const setTitle = function ( title ){
	let titlePart = ( title ) ? title + siteInfo.separater + pageInfo.title : pageInfo.title;
	window.title = titlePart + siteInfo.separater + pageInfo.gameName + siteInfo.separater + siteInfo.title;
};

const changeTab = function (pageIndex) {
  pageIndex = pageIndex || 1;
  $('.l-tab-controller')[pageIndex-1].checked=true;
};
/*
const createSelector = function ( html ) {
  $('.p-page__control')[0].innerHTML = `<select class="form-control p-selector">${html}</select>`;
};
const setControl = function ( html, pageIndex = 0 ) {
  html = html.trim();
  if ( html.startsWith('<option') ) {
    html = `<div class="input-group">
      <div class="input-group-prepend">
      </div>
      <select class="form-control p-selector">${html}</select>
      <div class="input-group-append">
        <button class="btn p-select-prev" type="button"><i class="fas fa-arrow-left"></i></button>
        <button class="btn p-select-next" type="button"><i class="fas fa-arrow-right"></i></button>
      </div>
    </div>`;
  }
  $('.p-page__control')[pageIndex].innerHTML = html;
};

const setContent = function ( html, pageIndex = 0 ) {
  $('.p-page__content')[pageIndex].innerHTML = html;
};

*/

export default {
  create,
  build,
  setTitle,
}