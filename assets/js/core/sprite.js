const modules = {
  default : {
    url : '',
    width : 0,
    height : 0,
    col : 0,
    keys : [],
  }
}

function add ( key, opt ) {
  modules[key] = opt;
}

function get ( key, value, displayWidth ) {
  let opt = modules[key];
  if ( !opt ) return '';
  let index  = value;
  if ( opt.keys ) {
    index = opt.keys.indexOf( value ) || 0;
  } else if ( opt.toIndex ) {
    index = opt.toIndex( value );
  }
  let scale  = displayWidth ? displayWidth / opt.width : 1;
  let width  = opt.width * scale;
  let height = opt.height * scale;
  let x      = width * ( index % opt.col );
  let y      = height * Math.floor( index / opt.col );
  let bgWidth = opt.width * scale * opt.col;
  let wrapperStyle = `
    height: ${height}px;
    width: ${width}px;
  `;
  let iconStyle = `
      background:url(${opt.url}) no-repeat -${x}px -${y}px;
      background-size: ${bgWidth}px auto;
      height: ${height}px;
      width: ${width}px;
    `;
  

  if( opt.crop ) {
    wrapperStyle = `
      height: ${opt.crop[2]}px;
      width: ${opt.crop[3]}px;
    `;
    iconStyle += `
      position: relative;
      left: -${opt.crop[0]}px;
      top: -${opt.crop[1]}px;
    `;
  }

  if( opt.style ) {
    wrapperStyle += opt.style;
  }
  let html = `<div class="p-sprite" data-value="${value}" title="${value}" style="display: inline-block; vertical-align:bottom; ${wrapperStyle}">
    <div class="p-sprite__icon" style="${iconStyle}"></div></div>`;

  return html;
  //return create( opt.url, opt.width, opt.height, opt.col, index, scale, value );
}

function create( url, width, height, col, index, scale, value ) {
  let html = `<div class="p-sprite" style="display:inline-block;vertical-align:bottom;
    background:url(${url}) no-repeat -${width * ( index % col ) * scale}px -${height * Math.floor( index / col ) * scale}px;
    background-size: ${width * col * scale}px auto;
    height: ${height * scale}px;
    width: ${width * scale}px;
    " data-value="${value}" title="${value}"></div>`;
  return html;
};

export default {
  add,
  get
}