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

let typeConverter = [0,9,10,12,11,14,1,3,4,2,13,6,5,7,15,16,8];
let statLimit = [
  [0,190,230,270,320,1000],
  [0,120,170,220,270,1000],
  [0,100,140,180,220,1000],
  [0, 75,125,175,225,1000],
];

function getStatStar( stat, value ) {
  return statLimit[stat].findIndex(x=>x>=value);
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

let NBNG = pmBase.extension.NBNG = {
  typeConverter,
  getStatStar,
  hex2bln,
  specialBushoList
};

export default NBNG;