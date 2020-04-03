const fs = require('fs')
const MAX_TRAVERSE_LEVEL = 2;
const definitions = JSON.parse(fs.readFileSync('infosys.swaggerui.json', 'utf8')).definitions;
const defNames = Object.keys(definitions);
const _ = require('lodash');

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
    let prop = item.properties[name];
    let ref = prop['$ref'];
    let filterName = name;
    let fop = find(FilterOperators, op => op.name === ref);
    let fopProps = {};

    //Check if the item is a Filter Operator (eg FilterStringOperators)
    if (fop) {
      fopProps = getFlatPropOutput(fop, level);

      Object.keys(fopProps).forEach(fopName => {

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
  max-width: 900px;
  min-width: 900px;
  font-size: 14px;
  font-family: "Arial";
  color: #222;
}
table {
  margin: 0 auto;
  width: 100%;
  border-collapse: collapse;
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
}
table > thead > tr > th:first-child {
  border-left: 1px solid #aaa;
}
table > thead > tr > th:last-child {
  border-right: 1px solid #aaa;
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
  max-width: 550px;
  min-width: 550px;
  white-space: nowrap;
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
}
</style>
`

const getExampleValue = (item) => {
  switch(item.dataType) {
    case "string":
      if (item.isArray) {
        return '<span class="value datatype_string"><pre>"&lt;text&gt;", ...</pre></span>';
      } else {
        return '<span class="value datatype_string"><pre>"&lt;text1&gt;"</pre></span>';
      }
    case "enum":
      if(item.isArray) {
        return '<span class="value datatype_enum"><pre>&lt;enum1&gt;, ...</pre></span>';
      }
      return '<span class="value datatype_enum"><pre>&lt;enum value&gt;</pre></span>';
    case "float":
      if (item.isArray) {
        return '<span class="value datatype_float"><pre>&lt;float1&gt;, ...</pre></span>';
      }
      return '<span class="value datatype_float"><pre>&lt;float value&gt;</pre></span>';
    case "integer":
      if (item.isArray) {
        return '<span class="value datatype_integer"><pre>&lt;integer1&gt;, ...</pre></span>';
      }
      return '<span class="value datatype_integer"><pre>&lt;integer value&gt;</pre></span>';
    case "number":
      if (item.isArray) {
        return '<span class="value datatype_number"><pre>&lt;number1&gt;, ...</pre></span>';
      }
      return '<span class="value datatype_number"><pre>&lt;number value&gt;</pre></span>';
    case "boolean":
      return '<span class="value datatype_enum"><pre>&lt;true or false&gt;</pre></span>';
    default:
      return ''
  }
}
const exportToHTML = function(refName) {
  let fout = getFilterOutput(refName);
  let foutFilters = _.keys(fout.filters);
  let html = '<HTML><HEAD>'+getStyle()+'</HEAD><BODY><TABLE id="' + fout.component + '_Filter'  + '"><THEAD>'

  html += '<TR ><TH colspan="3">'+refName+'</TH></TR>';
  html += '<TR><TH>Search Item</TH>';
  html += '<TH>DataType</TH>';
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

  html += '</TBODY></TABLE></BODY></HTML>'

  fs.writeFileSync('infosys.swagger.html', html, 'utf8');
}
exportToHTML('#/components/schemas/Site_Filter');
//let fout = getFilterOutput('#/components/schemas/Site_Filter');

