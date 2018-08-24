let modules = {
	default : {
		url : '',
		index : 0,
		width : 0,
		height : 0,
		col : 0,
	}
}

function add ( key, opt ) {
	modules[key] = opt;
}

function get ( key, val, width ) {
	let opt = modules[key];
	return create( opt.url, opt.width, opt.height, opt.col, val, width );
}

function create( url, width, height, col, index, displayWidth ) {
	let scale = displayWidth ? displayWidth / width : 1;
	let html = `<div style="display:inline-block;vertical-align:bottom;
		background:url(${url}) no-repeat -${width * ( index % col ) * scale}px -${height * Math.floor( index / col ) * scale}px;
		background-size: ${width * col * scale}px auto;
		height: ${height * scale}px;
		width: ${width * scale}px;
		"></div>`;
	return html;
};
 
export default {
	add,
	get
}