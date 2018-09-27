import poketoru from './core.js';
import { typeEffectArray } from './data/misc.js';

let typeNames = pmBase.config.get('typenames');

function init(){
  let htmlSelect = `
    <select class="form-control p-selector p-type">
      <option value="-1">-</option>
      ${ typeNames.map( (n,i)=> `<option value="${i}">${n}</option>` ).join('') }
    </select>
    `;
  
  let htmlTable = `
    <table class="table table-sm text-center p-result">
      <thead>
        <th></th>
        <th>${htmlSelect}</th>
        <th>${htmlSelect}</th>
        <th>${htmlSelect}</th>
        <th>${htmlSelect}</th>
        <th></th>
      </thead>
      <tbody>
      </tbody>
    </table>`;
  /*
  let html = `
  <div class="card card-primary">
      <div class="card-header with-border">结果</div>
      <div class="card-body card-profile text-center">
        <div class="form-group row">
          <label class="col-4 control-label">克制</label>
          <div class="col-8 c-pktl-te1">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-4 control-label">一般</label>
          <div class="col-8 c-pktl-te2">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-4 control-label">无效</label>
          <div class="col-8 c-pktl-te3">
          </div>
        </div>
        <div class="form-group row">
          <label class="col-4 control-label">推荐属性</label>
          <div class="col-8 c-pktl-te4">
          </div>
        </div>
      </div>
    </div>`;

  let htmlSelect = `<div class="form-row">`;
  for ( let i=0;i<4;i++ ) {
    htmlSelect+=`<div class="col-3">
        <select class="form-control p-selector p-type">
          <option value="-1">-</option>
          ${ typeNames.map( (n,i)=> `<option value="${i}">${n}</option>` ).join('') }
        </select>
      </div>`;
  }
  htmlSelect+='</div>';
  */
  pmBase.content.build({
    pages: [{
      content: htmlTable
    }]
  });
  
  $('.p-type').change( change );
}

function change(){
  let atkTypes = $('.p-type').map(function() {
      return this.value;
    }).get();
    debug(atkTypes);
  let defTypes = new Array(18).fill(-1);
  
  let html= '';
  typeNames.forEach( (n,defType)=>{
    let bestTE = 0;
    html += `<tr><td>${pmBase.content.create('type',defType)}</td>`;
    atkTypes.forEach( atkType => {
      if ( atkType==-1 ) {
        html += '<td></td>';
      } else {
        let te = typeEffectArray[atkType][defType];
        html += `<td>${te}</td>`;
        bestTE = Math.max(bestTE,te);
      }
    });
    html += `<td>${bestTE}</td></tr>`;
  });
  $('.p-result tbody').html(html);
  /*
  $.each( atkTypes,function( i, t ) {
    $.each( typeEffectArray[t],function( j, u ) {
      if( u==2 ) defTypes[j] = u;
      else if ( u < 1 && defTypes[j] < 1 ) defTypes[j] = u;
      else if ( defTypes[j] == -1 ) defTypes[j] = 1;
    });
  });
  debug(defTypes);
  let a='',b='',c='';
  
  $.each( defTypes,function( t, v ) {
    let s = pmBase.content.create('type',t);
    if ( v == 2 ) a += s;
    else if ( v == 1 ) b += s;
    else if ( v == 0.5 ) c += s;
  });
  $('.c-pktl-te1').html(a);
  $('.c-pktl-te2').html(b);
  $('.c-pktl-te3').html(c);*/
}

pmBase.hook.on( 'load', init );