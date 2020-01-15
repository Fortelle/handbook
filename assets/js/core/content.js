import config from './config.js';
import url from './url.js';
import util from './util.js';

let createFunctions = {

  'select' : function( html ) {
    return `<select class="form-control p-selector">${html}</select>`;
  },
  
  'card': function (config) {
    let html = `<div class="card mb-3">`;

    if (config.title) {
      html += `<div class="card-header"><div class="card-title m-0 font-weight-bold">${config.title}</div></div>`;
    }

    if (config.body) {
      html += `<div class="card-body">${config.body}</div>`;
    }

    if (config.table) {
      html += config.table;
    }

    if (config.list) {
      html += `<ul class="list-group list-group-flush">${config.list.map(x=>`<li class="list-group-item">${x}</li>`).join('')}</ul>`;
    }

    html += `</div>`;
    return html;
  },

  'info': function (config) {
    let headerHtml = '',
      bodyHtml = '',
      imageHtml = '';
    let imageCol = 0;

    if (config.image) {
      imageCol = config.imageCol || 3;
      imageHtml = `<div class="col-12 col-lg-${imageCol} order-xs-first order-first order-lg-last d-flex">
        <div class="align-self-center flex-grow-1 text-center">${config.image}<hr class="d-lg-none"></div>
      </div>`;
    }

    if (config.header) {
      headerHtml = '<thead><tr>' + config.header.map(x => `<th>${x}</th>`).join('') + '</tr></thead>';
    }

    if (config.ignoreNull) {
      config.list = config.list.filter(x => (x !== null) && (!!x[1] !== false) );
    }

    let labelWidth = 100 * 0.6 / (0.6 + config.list[0].length - 1);

    config.list.forEach((x, i) => {
      bodyHtml += `<tr><td class="c-infotable__label" style="width:${labelWidth}%">${x[0]}</td>`;
      for (let j = 1; j < x.length; j++) {
        bodyHtml += `<td class="c-infotable__data">${x[j]}</td>`;
      }
      bodyHtml += `</tr>`;
    });

    let html = `<div class="row">
      <div class="col-12 col-lg-${12-imageCol} order-lg-first">
        <table class="table table-sm c-infotable" style="table-layout:fixed;">
          ${headerHtml}
          <tbody>${bodyHtml}</tbody>
        </table>
      </div>
      ${imageHtml}
    </div>`;

    if (config.card) {
      html = create({
        type: 'card',
        table: html,
        title: config.title,
      });
    }

    return html;
  },
  
  'table': function (config) {
    let headHtml = '',
      bodyHtml = '',
      colHtml = '';
    let tableClass = config['class'] || '';
    let tableAttr = config.attr || '';
    let tableStyle = config.style || '';
    let columns = config.columns || [];
    let bodies = config.bodies || [];
    if (config.body) bodies.push(config.body);

    if (config.small) tableClass += ' table-sm';
    if (config.hover) tableClass += 'table-hover';
    if (config.bordered) tableClass += 'table-bordered';
    if (config.sortable) tableClass += ' sortable';
    if (config.sortlist) tableAttr += ` data-sortlist="[${config.sortlist}]"`;

    if (config.header) columns.push(...config.header);
    for (let i = 0; i < columns.length; i++) {
      if (typeof columns[i] === 'string') columns[i] = {
        header: columns[i]
      };
    }

    if (columns.length > 0) {
      colHtml += '<colgroup>';
      columns.forEach(col => {
        colHtml += '<col';
        if (col.width) colHtml += ` style="width:${col.width};"`;
        if (col.span) colHtml += ` colspan="${col.span};"`;
        colHtml += ` />`;
      });
      colHtml += '</colgroup>';
    }

    if (columns.length > 0) {
      headHtml += '<thead><tr>';
      columns.forEach(col => {
        headHtml += '<th';
        if (col.width) headHtml += ` style="width:${col.width};"`;
        if (col.span) headHtml += ` colspan="${col.span};"`;
        headHtml += `>${col.header}</th>`;
      });
      headHtml += '</tr></thead>';
    }

    bodies.map(body => {
      bodyHtml += '<tbody>';
      body.map(tr => {
        bodyHtml += '<tr>';
        tr.map((cell, col) => {
          bodyHtml += `<td>${cell}</td>`;
        });
        bodyHtml += '</tr>';
      });
      bodyHtml += '</tbody>';
    });

    let html = `<table class="table c-table text-center ${tableClass}" style="${tableStyle}" ${tableAttr}>
      ${colHtml}
      ${headHtml}
      ${bodyHtml}
    </table>`;

    if (config.card) {
      html = create({
        type: 'card',
        table: html,
      });
    }

    return html;
  },


  'list': function (config) {
    let head = '',
      body = '';
    let tableClass = config['class'] || '';
    let tableAttr = config.attr || '';
    let columns = config.columns || [];

    if (config.header) {
      columns.push(...config.header);
    }

    for (let i = 0; i < columns.length; i++) {
      if (typeof columns[i] === 'string') columns[i] = {
        header: columns[i]
      };
    }

    if (columns.length > 0) {
      head += '<tr>';
      columns.forEach(col => {
        head += '<th';
        if (col.width) head += ` style="width:${col.width};"`;
        if (col.span) head += ` colspan="${col.span};"`;
        head += `>${col.header}</th>`;
      });
      head += '</tr>';
    }

    if (config.sortable) {
      tableClass += ' sortable';
    }

    if (config.sortlist) {
      tableAttr += ` data-sortlist="[${config.sortlist}]"`;
    }

    config.list.map(tr => {
      body += '<tr>';
      tr.map((cell, col) => {
        body += `<td class="${columns[col]?columns[col]['class']||'':''}">${cell}</td>`;
      });
      body += '</tr>';
    });

    let html = `<table class="table table-sm table-hover text-center c-listtable ${tableClass}" ${tableAttr}>
      <thead>${head}</thead>
      <tbody>${body}</tbody>
    </table>`;

    if (config.card) {
      html = create({
        type: 'card',
        title: config.title,
        table: html,
      });
    }

    return html;
  },

  'tabs': function (config) {
    let id = config.id || 'default';
    let active = ('active' in config)
      ? config.active
      : $(`#tab-${id} .nav-link.active`).data('index') || 0
      ;
    let html = `<ul class="nav nav-tabs" id="tab-${id}">`;
    config.tabs.forEach((tab, i) => {
      html += `<li class="nav-item"><a class="nav-link ${i==active?'active':''}" data-toggle="tab" data-index="${i}" href="#" data-target="#tab-${id}-${i}">${tab.text}</a></li>`;
    });
    html += '</ul>';
    html += '<div class="tab-content pt-3">';
    config.tabs.forEach((tab, i) => {
      html += `<div class="tab-pane  ${i==active?'active':''}" id="tab-${id}-${i}">${tab.content}</div>`;
    });
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

let create = function (key, config) {
  if (typeof key == 'object') {
    config = key;
    key = config.type;
  }
  key = key.toLowerCase();
  if (key in createFunctions) {
    return createFunctions[key](config);
  } else {
    return '[err]';
  }
};

const BuildOptions = {
  defaultPageIndex: 0,
  currentPageIndex: 0,
  hashDetecter: detectHash,
  tempTabIndex: 0,
  pages: [],
};

const PAGEMODE_STATIC = 0,
  PAGEMODE_HASHBANG = 1,
  PAGEMODE_HASHQUERY = 2,
  PAGEMODE_CODE = 3;

let build = function (options) {
  Object.assign(BuildOptions, options);
  let html = '';

  BuildOptions.pages.forEach((page, pageIndex) => {
    if (page.content instanceof Function) {
      page.isDynamic = true;
      BuildOptions.isListen = true;
    }
    page.index = pageIndex;

    html += `
      <input class="js-tab-trigger" type="radio" name="layouttab" ${pageIndex==0?'checked_':''} />
      <div class="p-page p-page--${pageIndex}">
        <div class="p-page__control"></div>
        <div class="p-page__content"></div>
      </div>
    `;
  });
  $('.l-dynamic').html(html);

  parseHash();

  if (BuildOptions.isListen) {
    window.addEventListener("hashchange", parseHash);
  }

  $('.c-loading').remove();
};


function getPageElement(pageIndex) {
  return $(`.p-page--${pageIndex}`);
}

const initPage = function (pageIndex) {
  let page = BuildOptions.pages[pageIndex];
  if (page.isInited) return;

  if (page.selector) {
    page.hasSelector = true;
    let $page = getPageElement(pageIndex);
    let htmlControls = createSelector(page.selector);
    $page.find('.p-page__control').html(htmlControls);
    $page.find('.p-select-prev').click(function () {
      url.setHash($(this).parents('.p-page__control').find('.p-selector option:selected').prev().val());
    });
    $page.find('.p-select-next').click(function () {
      url.setHash($(this).parents('.p-page__control').find('.p-selector option:selected').next().val());
    });
    $page.find('.p-selector').change(function () {
      url.setHash(this.value);
    });
  }

  if (typeof page.content === 'string') {
    getPageElement(pageIndex).find('.p-page__content').html(page.content);
    delete page.content;
  } else if ( page.content instanceof jQuery ) {
    getPageElement(pageIndex).find('.p-page__content').html(page.content);
    delete page.content;
  }

  page.isInited = true;
};

function detectHash(hash) {
  if (hash === '') {
    return BuildOptions.defaultPageIndex;
  }

  for (let page of BuildOptions.pages) {
    if (page.hashDetecter && page.hashDetecter(hash)) {
      return page.index;
    } else if (page.isDynamic) {
      return page.index;
    }
  }

  return BuildOptions.defaultPageIndex;
}

const createContent = function (pageIndex, hash) {
  let result;
  let page = BuildOptions.pages[pageIndex];
  if (page.isDynamic) {
    result = page.content(hash);
  } else {
    result = page.content;
  }

  if (result === undefined) {
    return true;
  } else if (result === false) {
    return false;
  } else if (typeof result === 'string') {
    result = {
      content: result,
    };
  }
  result.index = pageIndex;
  result.hash = hash.value;
  return result;
  // false: not match
  // true: not change
  // object: change
}

function show(obj) {
  if ( obj === false ) {
    return;
  } else if ( obj === true ) {
    changeTab(BuildOptions.currentPageIndex);
  } else {
    let pageIndex = 'index' in obj
      ? obj.index
      : BuildOptions.currentPageIndex;
    
    let $tab = $('.nav-tabs .nav-link.show');
    if ($tab.length>0) BuildOptions.tempTabIndex = $tab.closest('.nav-item').index();

    changeTab(obj.index);
    let $page = getPageElement(pageIndex);
    $page.find('.p-page__content').html(obj.content);
    if (obj.hash) $page.find('.p-selector').val(obj.hash);
    $('.c-listtable.sortable').removeClass('sortable').tablesorter();
    setTitle(obj.title);

    if($tab.length>0) $('.nav-tabs .nav-link:nth(' + BuildOptions.tempTabIndex + ')').trigger('click');
  }
}

const parseHash = function () {
  let hash = url.getHashObject();
  debug(`Hash change event (${hash.value})`);

  let targetPageIndex = detectHash(hash.value);
  let result = createContent(targetPageIndex, hash);
  if (result === false) {
    targetPageIndex = BuildOptions.defaultPageIndex;
    result = createContent(targetPageIndex, hash);
  }
  BuildOptions.currentPageIndex = targetPageIndex;

  show(result);
}



let createSelector = function (obj) {
  let html = '';
  let withContainer = false;

  if (typeof obj === 'string') {
    html = obj.trim();
    withContainer = html.startsWith('<op');
  } else if (Array.isArray(obj)) {
    var groups = obj.reduce( (ret, option) => {
      let group = option.group || '';
      ret[group] = ret[group] || [];
      ret[group].push(option);
      return ret;
    }, Object.create(null));
    for (let [k, v] of Object.entries(groups)) {
      if (!!k) html += `<optgroup label="${k}">`;
      for (let option of v) {
        html += `<option value="${option.value}">${option.text}</option>`;
      }
      if (!!k) html += `</optgroup>`;
    }

    withContainer = true;
  } else if ( typeof obj === 'object' ) {
    for (var value in obj) {
      html += `<option value="${value}">${obj[value]}</option>`;
    }

    withContainer = true;
  }

  if (withContainer) {
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

const setTitle = function (subtitle) {
  let separater = siteInfo.separater || ' - ';
  if ( subtitle ) {
    document.title =`${subtitle}${separater}${pageInfo.title}${separater}${pageInfo.gamTitle||siteInfo.title}`;
    $('.l-page__subtitle').html('：' + subtitle);
  } else {
    document.title =`${pageInfo.title}${separater}${pageInfo.gamTitle||siteInfo.title}`;
    $('.l-page__subtitle').html('');
    //$('.l-page__title a').html(pageInfo.title);
  }
};

const changeTab = function (pageIndex) {
  pageIndex = pageIndex || 0;
  $('.js-tab-trigger')[pageIndex].checked = true;
  initPage(pageIndex);
};

export default {
  create,
  build,
  setTitle,
}