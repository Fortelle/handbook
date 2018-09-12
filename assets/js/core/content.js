const typeNames = [
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

let createFunctions = {
  
  'type' : function( value, value2 = null ) {
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
  
  'info' : function( data ) {
    if ( typeof data !== 'string' ) data = data.map( x=> `<tr><td>${x.join('</td><td>')}</td></tr>` ).join('');
    return `<table class="table table-sm p-infotable"><tbody>${data}</tbody></table>`;
  },
  
  'list' : function( data, header = '' ) {
    if ( typeof data !== 'string' ) data = data.map( x=> `<tr><td>${x.join('</td><td>')}</td></tr>` ).join('');
    if ( typeof header !== 'string' ) header = `<tr><th>${header.join('</th><th>')}</th></tr>`;
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

/*******************/

const setTitle = function ( title ){
	let titlePart = ( title ) ? title + siteInfo.separater + pageInfo.title : pageInfo.title;
	window.title = titlePart + siteInfo.separater + pageInfo.gameName + siteInfo.separater + siteInfo.title;
};

const changeTab = function (index) {
  $('.l-tab-controller')[index].checked=true;
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

export default {
  create,
  setControl,
  setContent,
  setTitle,
  changeTab,
}