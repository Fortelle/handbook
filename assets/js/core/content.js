import config from './config.js';
import url from './url.js';
import util from './util.js';

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
    let imageTD = image ? `<div class="col-12 col-lg-3 order-xs-first order-first order-lg-last d-flex"><div class="align-self-center flex-grow-1 text-center">${image}<hr class="d-lg-none"></div></div>` : '';
    if ( typeof data !== 'string' ) data = data.filter(x=>(x!==null)&&(x[1]!==false)).map( (x,i)=> `<tr><td>${x.join('</td><td>')}</td></tr>` ).join('');
    return `<div class="row">
      <div class="col-12 col-lg-${imageTD?9:12} order-lg-first">
        <table class="table table-sm p-infotable">
          <tbody>${data}</tbody>
        </table>
      </div>
      ${imageTD}
    </div>`;
  },
  
  'list' : function( dataTable, header = '', classes = '', attr = '' ) {
    if ( typeof dataTable !== 'string' ) dataTable = dataTable.map( x=> `<tr><td>${x.join('</td><td>')}</td></tr>` ).join('');
    if ( typeof header !== 'string' ) header = '<tr>' + header.map( x=>{
      if ( x.includes('|') ) {
        let y=x.split('|');
        return `<th style="width:${y[0]}">${y[1]}</th>`;
      } else {
        return `<th>${x}</th>`;
      }
    }).join('') + '</tr>';
    
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
  
  'tabs' : function( names, contents ) {
    let id = util.getUniqueID();
    let html = '<div class="c-tabs">';
    for ( let i=0;i<names.length;i++ ) {
      html += `
                 <input type="radio" id="js-tabs-${id}-${i}" class="c-tabs__input c-tabs__input--${i}" name="${id}" ${i===0?'checked':''}>
                 <label class="c-tabs__label" for="js-tabs-${id}-${i}">${names[i]}</label>
      `;
    }
    for ( let i=0;i<names.length;i++ ) {
      html += `<div class="c-tabs__content c-tabs__content--${i}">${contents[i]}</div>`;
    }
    html += '</div>';
    return html;
  },
  
  'stack' : function( x1, x2 ) {
    return `<span class="fa-stack">
      <i class="far fa-${x1} fa-stack-2x"></i>
      <strong class="fa-stack-1x">${x2}</strong>
    </span>`;
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
  $('.c-loading').attr('class', 'c-loading c-loading--step-4');
  
  buildingOptions = options;
  let html = '';
  let listen = false;
  
  for ( let i=0; i<options.pages.length; i++ ) {
    let htmlControls = '', htmlContent = '';
    
    if ( options.pages[i].control ) {
      htmlControls = createSelector(options.pages[i].control);
      //options.pages[i].dynamic = true;
      delete options.pages[i].control;
    }
    
    if ( typeof options.pages[i].content === 'string' ) {
      htmlContent = options.pages[i].content;
      delete options.pages[i].content;
    } else if ( options.pages[i].content instanceof Function ) {
      options.pages[i].dynamic = true;
      options.dynamic = true;
      listen = true;
    }
    
    html += `
      <input class="js-tab-trigger" type="radio" name="layouttab" ${i==0?'checked':''} />
      <div class="p-page p-page--${i}">
        <div class="p-page__control">${htmlControls}</div>
        <div class="p-page__content">${htmlContent}</div>
      </div>
    `;
  }
  $('.l-page__body').html(html);
  
  if ( listen ) {
  	$('.p-select-prev').click( function(){ url.setHash($(this).parents('.p-page__control').find('.p-selector option:selected').prev().val()); });
  	$('.p-select-next').click( function(){ url.setHash($(this).parents('.p-page__control').find('.p-selector option:selected').next().val()); });
	  $('.p-selector').change( function(){ url.setHash(this.value); });

    if ( !options.hashParser ) options.hashParser = hashParser;
    if ( !options.trigger ) options.trigger = $('.p-selector').change;
    
    
    window.addEventListener("hashchange", onHashChange );
    
  }
  
  if ( onHashChange() === false && options.pages && options.pages[0].dynamic ) {

  }
  
  sortTable();
  $('.c-loading').remove();
};

const hashParser = function( hashValue ) {
  let targetPage = ( hashValue.length === 0 ) ? 0 : buildingOptions.pages.length-1;
  if ( /^\d+$/.test(hashValue) ) hashValue = ~~hashValue;
  let html = '';
  if ( buildingOptions.pages[targetPage].dynamic ) {
    if ( hashValue !== '' ) html = buildingOptions.pages[targetPage].content(hashValue);
    if ( targetPage === 0 && !html ) {
      hashValue = $('.p-page--0 .p-selector option:first').val();
      if ( /^\d+$/.test(hashValue) ) hashValue = ~~hashValue;
      html = buildingOptions.pages[targetPage].content(hashValue);
    }
    if ( html ) {
    } else {
      targetPage = 0;
    }
  }
  return {
    page: targetPage,
    output: html,
    value: hashValue,
  }
};

const sortTable = function(){
	$('.p-listtable.sortable').removeClass('sortable').tablesorter();
};

const onHashChange = function (){
  
	let hashValue = url.getHash();
  debug( `Hash change event {${hashValue}}` );
  if ( !buildingOptions.hashParser ) return;
  let result = buildingOptions.hashParser( hashValue );
  if ( !result ) return;
  let targetPage = result.page || 0;
  if ( result.output ) $(`.p-page--${targetPage} .p-page__content`).html( result.output );
  if ( result.value )  $(`.p-page--${targetPage} .p-selector`).val( result.value );
  sortTable();
	
	changeTab( targetPage );
	if ( targetPage > 0 ) {
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
        <button class="btn p-select-prev d-none d-lg-block d-xl-block" type="button"><i class="fas fa-angle-left"></i></button>
        <button class="btn p-select-next d-none d-lg-block d-xl-block" type="button"><i class="fas fa-angle-right"></i></button>
      </div>
    </div><div class="input-group">
        <button class="btn w-50 d-sm-block d-md-block d-lg-none p-select-prev" type="button"><i class="fas fa-angle-left"></i></button>
        <button class="btn w-50 d-sm-block d-md-block d-lg-none p-select-next" type="button"><i class="fas fa-angle-right"></i></button>
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
  pageIndex = pageIndex || 0;
  $('.js-tab-trigger')[pageIndex].checked=true;
};


export default {
  create,
  build,
  setTitle,
}