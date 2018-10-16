import bushoDataArray from './data/busho.js';

pmBase.sprite.add( 'busho_o', {
	url : '/nbng/images/busho_o.min.png',
	width: 64,
	height:32,
	col: 10
});

pmBase.sprite.add( 'busho_s', {
	url : '/nbng/images/busho_s.min.png',
	width: 31,
	height:19,
	col: 10
});

pmBase.sprite.add( 'pokemon', {
	url : '/nbng/images/pokemon.min.png',
	width: 32,
	height:32,
	col: 10
});

pmBase.sprite.add( 'kuni', {
	url : '/nbng/images/castle.min.png',
	width: 32,
	height:40,
	col: 6
});

pmBase.sprite.add( 'building', {
	url : '/nbng/images/shisetsu.min.png',
	width: 32,
	height:32,
	col: 10
});

pmBase.config.set('typenames',["一般","火","水","电","草","冰","格斗","毒","地面","飞行","超能力","虫","岩石","幽灵","龙","恶","钢"]);

const typeConverter = [0,9,10,12,11,14,1,3,4,2,13,6,5,7,15,16,8];
const statLimit = [
  [0,190,230,270,320,1000],
  [0,120,170,220,270,1000],
  [0,100,140,180,220,1000],
  [0, 75,125,175,225,1000],
];

function getStatStar( stat, value ) {
  return statLimit[stat].findIndex(x=>x>=value);
}

const blColor = [ '#000', '#569ed2', '#4292cd', '#3386c2', '#2e78ae', '#daa520' ];

function getBestLinkText( value ) {
  let stage = Math.floor( value /20 );
  return value == 0 ? '' : `<span style="color:${blColor[stage]};font-weight:bold;">${value}%</span>`;
}

function hex2bln(hex,count) {
  return hex
    .split('')
    .map( x=>parseInt(x, 16).toString(2).padStart(4,0) )
    .join('')
    .slice(-count)
    .split('')
    .map( x=>x==='1' )
    .reverse();
}

let specialBushoList = [];
bushoDataArray.forEach(function(x,i){
  if (x.rank===1 && x.id !==0 ) specialBushoList[x.id-1]=i;
});

let NBNG = pmBase.NBNG = {
  typeConverter,
  getStatStar,
  hex2bln,
  specialBushoList,
  getBestLinkText,
};

export default NBNG;