require('babel-register');
const fs = require('fs');
const _ = require('lodash');
const express = require('express');
const initRestAPIRouter = require('./src/modules/infosystem/rest/glue21/index.js').expressRouter;
const infosys = require('./src/modules/infosystem/index.js');
const MAX_TRAVERSE_LEVEL = 2;

function HTMLExport() {
  const definitions = JSON.parse(fs.readFileSync(__dirname + '/dist/infosys.swaggerui.json', 'utf8')).definitions;
  const defNames = Object.keys(definitions);

  const EXCLUDE_FILTER_OPS = ['oneOf', 'between', 'containsSome', 'icontainsSome', 'containsAll', 'icontainsAll'];
  const EXCLUDE_FILTER_PROPS = ['computingEndpointComputingServiceForeignKey', 'serviceAdminDomainForeignKey', 'cloudComputingServiceForeignKey', 'cloudComputingendpointForeignKey', 'endpointServiceForeignKey', 'resourceManagerForeignKey', 'endpointForeignKey', 'managerForeignKey', 'shareForeignKey', 'serviceForeignKey'];
  const ALLOW_EXPORT_FILTERS = ['Site_Filter', 'SiteCloudComputingEndpoint_Filter', 'SiteCloudComputingImage_Filter', 'SiteCloudComputingTemplate_Filter', 'SiteCloudComputingManager_Filter', 'SiteCloudComputingShare_Filter', 'SiteServiceDowntime_Filter', 'SiteServiceStatus_Filter'];
  const find = function(arr, func) {
    let res = [];

    if (_.isFunction(func)) {
      res = arr.filter(func);
    } else {
      res = arr.filter(a => a === func);
    }

    return res.length > 0 ? res[0] : null;
  };

  const isDeprecated = function(name) {
    return /\/DEPRECATEDGLUE20/.test(name);
  };

  const isFilterOperator = function(name) {
    return !isDeprecated(name) && /\/Filter[A-Z][a-zA-Z]*Operators$/.test(name);
  };

  const isFilter = function (name) {
    return !isDeprecated(name) && /\/[A-Za-z]*_Filter$/.test(name);
  };

  const isEnum = function(name) {
    return ((definitions[name] || {}).type === 'enum')
  }

  const isComponent = function (name) {
    return !isDeprecated(name) && !isFilterOperator(name) && !isFilter(name) && !isEnum(name);
  }

  const filterDefinitionsBy = function(func) {
    return defNames.filter(func).map(defName => Object.assign({name: defName}, definitions[defName]));
  };

  const getFilterOperatorType = function(op) {
    let matches = /\/Filter([A-Za-z]*)Operators$/.exec(op.name);
    return (matches && matches.length > 1) ? matches[1] : null;
  };

  const getFilterComponentName = function(filterName) {
    let matches = /\/([A-Za-z]*)_Filter$/.exec(filterName);
    return matches && matches.length > 1 ? matches[1] : null;
  }

  const Filters = filterDefinitionsBy(isFilter).map(filter => {
    filter.component = getFilterComponentName(filter.name);
    return filter;
  });

  const FilterOperators = filterDefinitionsBy(isFilterOperator).map(op => {
    op.dataType = getFilterOperatorType(op);
    return op;
  });

  const Components = filterDefinitionsBy(isComponent);
  const Enumerations = filterDefinitionsBy(isEnum);

  const getFlatPropOutput = function(item, level = 0) {
    if (level >= MAX_TRAVERSE_LEVEL) {
      return {};
    }
    item = item || {};
    item.properties = item.properties || item;

    return Object.keys(item.properties || {}).reduce(function(acc, name) {
      if(EXCLUDE_FILTER_PROPS.indexOf(name) > -1) {
        return acc;
      }
      let prop = item.properties[name];
      let ref = prop['$ref'];
      let filterName = name;
      let fop = find(FilterOperators, op => op.name === ref);
      let fopProps = {};

      //Check if the item is a Filter Operator (eg FilterStringOperators)
      if (fop) {
        fopProps = getFlatPropOutput(fop, level);

        Object.keys(fopProps).forEach(fopName => {
          if (EXCLUDE_FILTER_OPS.indexOf(fopName) > -1) {
            return;
          }
          let fopProp = fop.properties[fopName] || {};
          let descr = _.trim(prop.description);
          let filterDesc = _.trim(fopProp.description);

          if (descr) {
            if (/^GLUE2/.test(descr) === false) {
              descr = descr.charAt(0).toLowerCase() + descr.slice(1);
            }

            if (_.startsWith(_.trim(descr), 'where')) {
              descr += ' on ' + fopName + ' ' + _.trim(descr);
            } else if (filterDesc) {
              if (!_.startsWith(_.trim(filterDesc).toLowerCase(), 'contains') &&
                !_.startsWith(_.trim(filterDesc).toLowerCase(), 'does') &&
                !_.startsWith(_.trim(filterDesc).toLowerCase(), 'must')
              ) {
                descr += ' is';
              }
              descr += ' ' + filterDesc;
            }
          } else if (filterName && filterDesc) {
            if (filterName.indexOf('.') > -1) {
              descr = ' where ' + filterName.split('.')[1];
            } else {
              descr = ' where ' + filterName;
            }

            if (!_.startsWith(_.trim(filterDesc).toLowerCase(), 'contains') &&
                !_.startsWith(_.trim(filterDesc).toLowerCase(), 'does') &&
                !_.startsWith(_.trim(filterDesc).toLowerCase(), 'must')
              ) {
              descr += ' is';
            }

            descr += ' ' + filterDesc;
          } else  if (filterDesc) {
            filterDesc = filterDesc.charAt(0).toLowerCase() + filterDesc.slice(1);

            descr += ' where ' + filterDesc;
          }

          acc[filterName + '::' + fopName] = {
            dataType: (fopProp.type === 'array') ? (fopProp.items.format || fopProp.items.type) : fopProp.type,//fopProp.dataType || fopProp.type,
            description: _.capitalize(descr) || '<none>',
            itemDescription: item.description,
            isArray: (fopProp.type === 'array'),
            validValues: fopProp.validValues || []
          };

        });
      }
      // Check if the item is a primitive value
      else if (['string', 'number', 'integer', 'boolean', 'float', 'array'].indexOf(prop.type) > -1) {
        acc[name] = {
          dataType: (prop.type === 'array') ? (prop.items.format || prop.items.type) : prop.type,
          description: prop.description,
          isArray: (prop.type === 'array'),
          itemDescription: item.description,
          validValues: []
        };
      }
      //Check if the item is a Filter input object
      else if (isFilter(prop['$ref'])) {
        fop = find(Filters, (f) => f.name === prop['$ref']);

        if (fop) {
          fopProps = getFlatPropOutput(fop, level + 1);

          Object.keys(fopProps).forEach(fopName => {
            try {
              let fopProp = fopProps[fopName];
              let propDescr = _.get(prop, 'description') || '';
              let descr = _.trim(fopProp.description);

              if (descr) {
                if (/^GLUE2/.test(descr) === false) {
                  descr = descr.charAt(0).toLowerCase() + descr.slice(1);
                } else if (_.startsWith(_.trim(descr), 'where')) {
                  descr += ' on ' + fopName + ' ' + _.trim(descr);
                }
              }

              acc[filterName + '.' + fopName] = {
                dataType: fopProp.dataType || prop.type,
                description: propDescr + ' ' + descr,
                itemDescription: item.description,
                isArray: fopProp.isArray,
                validValues: fopProp.validValues || []
              };
            }catch(e) {
              console.log('ERROR: ' + e);
              console.log({
                filterName: filterName,
                fopName: fopName,
                fop: fop,
                prop: prop,
                item: item
              })
            }

          });
        }
      } else if(isEnum(prop['$ref'])) {
        fop = find(Enumerations, (e) => e.name === prop['$ref']);
        acc[name] = {
          dataType: 'enum',
          description: prop.description,
          isArray: false,
          validValues: fop.enum || [],
          itemDescription: item.description
        };
      } else {
        console.log(prop)
      }

      return acc;
    }, {})
  };
  const getFilterOutput = function(refName) {
    let filter = find(Filters, (f) => f.name === refName);

    return {
      component: filter.component,
      filters: getFlatPropOutput(filter)
    }
  }
  const getStyle = () => `
  <style>
  body {
    font-size: 14px;
    font-family: "Arial";
    color: #222;
  }
  #app {
    max-width: 1024px;
    margin: 0 auto;
  }
  table {
    margin: 0 auto;
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

  }
  table > thead > tr > th {
    text-align: left;
    min-height: 30px;
    background-color: #e0e0e0;
  }
  table > thead > tr > th,
  table > tbody > tr > td {
    border: 1px solid #aaa;
    padding: 5px 10px;
  }
  table > thead > tr:first-child > th {
    background-color: #c0c0c0;
    height: 50px;
    max-width: 550px;
    min-width: 550px;
  }
  table > thead > tr > th:first-child {
    border-left: 1px solid #aaa;
  }
  table > thead > tr > th:last-child {
    border-right: 1px solid #aaa;
  }

  table > thead > tr > th:nth-child(2) {
    max-width: 50px;
    width: 50px;
    min-width: 50px;
  }

  table > tbody > tr:nth-child(even) {
    background-color: #f3f3f3;
  }

  table > tbody > tr > td {
    padding: 10px;
    padding-top: 5px;
    vertical-align: top;
  }

  table > tbody > tr > td:first-child {
    white-space: prewrap;
  }

  .filtername {
    font-weight: 600;
    color: #333;
  }

  .opsep {
    margin-left: -4px;
  }

  .opsep, .sep {
    font-weight: bold;
    color: #1e3068;
  }

  .op {
    font-weight: 500;
    color: #525f88;
  }

  .value, .value > pre {
    font-size: 0.9rem;
    display: inline-block;
    white-space: nowrap;
  }

  .value > pre {
    color: #888;
    font-style: italic;
  }

  h2 {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    display: block;
    background-color: white;
    padding: 10px;
    padding-left: 5px;
    border: 1px solid #d0d0d0;
    border-radius: 2px;
    box-shadow: 0px 5px 5px -3px #a0a0a0;
    color: #666;
    min-width: 1044px;
    margin-left: -20px;
  }
  </style>
  `

  const getExampleValue = (item) => {
    if (item.dataType === 'string') {
      return '<span class="value datatype_string"><pre>"&lt;string&gt;"</pre></span>';
    }
    return '<span class="value datatype_' + item.dataType + '"><pre>&lt;' + item.dataType  + '&gt;</pre></span>';
  }

  const getFilterDisplayName = function(refName) {
    return (refName || '').replace('#/components/schemas/', '');
  }

  const exportHTMLTable = function(refName) {
    let displayName = getFilterDisplayName(refName);
    let fout = getFilterOutput(refName);
    let foutFilters = _.keys(fout.filters);
    let html = '<H2 id="' + displayName  + '">Supported ' + displayName.split('_')[0] + ' queries</H2>';

    html += '<TABLE id="' + displayName  + '"><THEAD>';
    html += '<TR><TH>Search Item</TH>';
    html += '<TH>Type</TH>';
    html += '<TH>Description</TH>';
    html += '</THEAD><TBODY>';

    html += foutFilters.map(fname => {
      let f = fout.filters[fname];
      let desc = f.description
      let filter = fname.split('::');
      let htmlFilter = '<span class="filtername">' + filter[0] +' </span>';
      if (filter.length > 1) {
        htmlFilter += '<span class="opsep">::</span><span class="op">' + filter[1] + '</span>';
      }
      htmlFilter += '<span class="sep">:</span>';
      let dataType = f.dataType;
      if (f.isArray) {
        dataType += '[]';
      } else if (f.dataType === 'enum') {
        if (!_.endsWith(desc, '.')) {
          desc += '. ';
        }
        desc += '<b>Valid Values:</b>' + f.validValues.join(',');
      } else if (f.dataType === 'string') {
        if (f.isArray) {

        } else {

        }
      }
      htmlFilter += getExampleValue(f);

      return '<TR><TD>' + htmlFilter + '</TD><TD>' + dataType + '</TD><TD>' + desc + '</TD></TR>';
    }).join('\n')

    html += '</TBODY></TABLE>';

    return html;
  }

  const getHeader = function(title) {
    title = _.trim(title);
    title = (title) ? '<title>' + title + '</title>' : '';

    return '<!DOCTYPE html><HTML><HEAD>'+getStyle()+'<meta charset="UTF-8">' + title + '</HEAD><BODY><DIV id="app">';
  };

  const getFooter = function() {
    return '</DIV></BODY></HTML>';
  }

  const saveHTML = function(filterName, html) {
    fs.writeFileSync(__dirname + '/dist/infosys.filter.' + filterName + '.html', html, 'utf8');
  }

  const exportToHTML = function() {
    let filters = Filters.map(f => f.name).filter(f => ALLOW_EXPORT_FILTERS.indexOf(getFilterDisplayName(f)) > -1);
    let html = getHeader();

    html = filters.reduce(function(acc, filterName) {
      console.log('[EXPORT_FILTERS]: Generating HTML for filter ' + filterName);
      let htmlText = exportHTMLTable(filterName);
      acc += htmlText;

      htmlText = getHeader('Available search terms for ' + getFilterDisplayName(filterName).replace('_Filter', '') + ' filter') + htmlText + getFooter();
      saveHTML(getFilterDisplayName(filterName), htmlText);
      return acc;
    }, html)

    html += getFooter();

    fs.writeFileSync(__dirname + '/dist/infosys.filter.html', html, 'utf8');
  }

  return exportToHTML();
}

function init() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Initialize dummy infosystem to collect and generate filter documentation');
    return infosys.default().then(() => {
      initRestAPIRouter(express.Router());
      HTMLExport();
      return Promise.resolve(true);
    }).catch(err => {
      console.log('[EXPORT_FILTERS]: Could not generate filter docs. Reason: ' , err);
      return Promise.resolve(true);
    });
  } else {
    try {
      console.log('[EXPORT_FILTERS]: Generate filter documentation from distribution')
      HTMLExport();
    } catch(err) {
      console.log('[EXPORT_FILTERS]: Could not generate filter docs. Reason: ' , err);
    }

    return Promise.resolve(true);
  }
}

init();

