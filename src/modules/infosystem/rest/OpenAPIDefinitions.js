
import {parse} from 'graphql';
import gql from 'graphql-tag';
import {getTypeDefs} from '../graphql/index';
import _ from 'lodash';

const COMPONENT_PATH = '#/components/schemas/';

function toArray(arr) {
  arr = arr || [];
  arr = Array.isArray(arr) ? arr :[arr];
  return arr;
}

function getGraphQLDefinitions() {
  const getSchemaObjectTypes = (schema) => {
    return toArray(_.get(schema, 'definitions'))
        .filter(def => ['EnumTypeDefinition', 'ObjectTypeDefinition'].indexOf(def.kind) > -1)
        .filter(def => def.name && def.name.kind === 'Name')
        .reduce((acc, def) => {
          let fqdn = COMPONENT_PATH + _.get(def, "name.value");
          // console.log('parsing ', fqdn)
          switch (def.kind) {
            case "EnumTypeDefinition":
              acc[fqdn] = {
                "type": "enum",
                "description": _.trim(_.get(def, 'description.value')) || '',
                "enum": toArray(_.get(def, 'values')).map(v => _.get(v, 'name.value')).filter(v => !!v)
              };
              break;
            default:
              acc[fqdn] = {
                "type": "object",
                "description": _.trim(_.get(def, 'description.value')),
                "properties": getDefinitionFields(def)
              };
              break;
          }

          return acc;
        }, {});
  }

  const getDefinitionFields = (definition) => {
    let fields = toArray(_.get(definition, "fields"));

    return fields.filter(f => f.kind === 'FieldDefinition')
      .reduce((acc, f) => {
        let name = _.trim(_.get(f, 'name.value'));

        if (name) {
          acc[name] = {}
          let description = _.trim(_.get(f, "description.value"));
          let ftype = _.trim(_.get(f, "type.name.value"));
          let ftypekind = _.trim(_.get(f, "type.kind"));
          let format = '';
          if (ftypekind === 'NamedType') {
            ftype = ftype === 'ID' ? 'string' : ftype;
            switch(ftype.toLowerCase()) {
              case 'string':
                acc[name].type = 'string';
                break;
              case 'float':
                acc[name].type = 'number';
                acc[name].format = 'float';
                break;
              case 'int':
                acc[name].type = 'integer';
                break;
              case 'boolean':
                acc[name].type = 'boolean';
                break;
              case 'object':
                acc[name].type = 'object';
                acc[name].raw =  f;
                break;
              case 'enum':
                  acc[name].type = 'string';
                  acc[name].enum = [];
                  acc[name].description = description;
                  break;
              case '':
                // console.log('===> EMPTY' , f);
                break;
              default:
                acc[name].graphQLType = _.get(f, 'type.type.name.value') || ftype;
                acc[name]["$ref"] = COMPONENT_PATH + _.get(f, "type.name.value");
                break;
            }
          } else if (ftypekind === 'ListType') {
            let arrType = _.trim(_.get(f, "type.type.name.value"));
            acc[name].type = 'array'
            acc[name].items = {};
            switch(arrType.toLowerCase()) {
              case 'string':
                acc[name].items = {type: 'string'};
                break;
              case 'float':
                acc[name].items = {type: 'number', format: 'float'};
                break;
              case 'int':
                acc[name].items = {type: 'integer'};
                break;
              case 'boolean':
                acc[name].items = {type: 'boolean'};
                break;
              case 'object':
                acc[name].items = {type: 'object', raw: f};
                break;
              case 'enum':
                acc[name].items = {type: 'string', description: description, enum: []};
                break;
              case '':
                // console.log('===> EMPTY' , f);
                break;
              default:
                acc[name].items = {
                  "$ref": COMPONENT_PATH + _.get(f, "type.type.name.value")
                };
                acc[name].graphQLType = _.get(f, "type.type.name.value");
                acc[name].raw = f;
                break;
            }
          } else {
            // console.log('IGNORED =====> ', f);
          }

          if(description) {
            acc[name].description = description;
          }

          if (format) {
            acc[name].format = format;
          }
        }

        return acc;
      }, {});
  }

  const schema = parse(getTypeDefs());

  return getSchemaObjectTypes(schema);
}

/**
 * Recursively generate subqueries from graphql-tag result
 * @param {*} selectionSetFields
 */
function extractSubFields(selectionSetFields) {
  selectionSetFields = toArray(selectionSetFields);
  return selectionSetFields.map(s => {
    if (_.get(s, 'selectionSet.kind') === 'SelectionSet') {
      let subSelectionSet = toArray(_.get(s, 'selectionSet.selections'));

      if(subSelectionSet.length > 0) {
        let newNameValue = _.get(s, 'name.value');
        let newFields = extractSubFields(subSelectionSet).map(sub => {
          return _.get(sub, 'name.value');
        });
        newNameValue = `${newNameValue} {
          ${newFields}
        }`;
        _.set(s, 'name.value', newNameValue);
      }
    }

    return s;
  });
}

class OpenAPIDefinitions {
  constructor() {
    this._definitions = getGraphQLDefinitions();
    this._refs = {};
    this._paths = {};
  }

  getComponentFromGraphQLQuery({
    graphQLType,
    graphQLFields,
    description = ''
  }) {
    let query = gql`
    {
      ${graphQLType} {
        ${graphQLFields}
      }
    }`;

    let fields = toArray(_.get(query, 'definitions.0.selectionSet.selections.0.selectionSet.selections'));
    let properties = fields.map(f => {
      let selectionSetFields = _.get(f, 'selectionSet.selections') || [];

      selectionSetFields = extractSubFields(selectionSetFields);

      return {
        name: _.get(f, 'name.value'),
        selectionSetFields: selectionSetFields
      }
    });

    let graphqlRef = this._definitions[COMPONENT_PATH + graphQLType];
    let openAPIRefs = Object.keys(graphqlRef.properties).reduce((acc, prop) => {
      let fieldProperty = properties.find(fprop => fprop.name === prop);

      if (fieldProperty) {
        acc[prop] = Object.assign({}, graphqlRef.properties[prop] || {});

        if (acc[prop].graphQLType) {
          if (fieldProperty.selectionSetFields.length) {

            let newComponent = this.getComponentFromGraphQLQuery({
              graphQLType: acc[prop].graphQLType,
              graphQLFields: fieldProperty.selectionSetFields.map(sel => _.get(sel, 'name.value')).filter(sel => !!sel).join('\n'),
              previousObj: properties
            });

            if (acc[prop].type === 'array') {
              acc[prop].items = newComponent
            } else {
              acc[prop].properties = newComponent.properties;
            }

          } else {
            let subDef = this._definitions[COMPONENT_PATH + acc[prop].graphQLType];

            if(subDef.type === 'enum') {
              acc[prop].type = 'string';
              acc[prop].enum = subDef.enum;
              acc[prop].description = subDef.description;
            }
          }

          delete acc[prop].graphQLType;
          delete acc[prop].raw;
        }
      }

      return acc;
    }, {});

    let refData = {type: 'object', properties: openAPIRefs};
    if (_.trim(description)) {
      refData.description = description;
    }

    return refData;
  }

  registerComponentFromGraphQLQuery( {
    name,
    graphQLType,
    graphQLFields,
    description = ''
  }) {

    let refData = this.getComponentFromGraphQLQuery({graphQLType, graphQLFields, description});
    this._refs = Object.assign({}, this._refs, {[name]: refData});

    return this;
  }

  registerCollectionWrapperComponent({
    name,
    wrapperOf,
    description = ''
  }) {
    let wrapper = this.getCollectionResponseType(wrapperOf);

    if (_.trim(description)) {
      wrapper.description = description;
    }

    this._refs = Object.assign({}, this._refs, {[name]: wrapper});

    return this;
  }

  registerItemWrapperComponent({
    name,
    wrapperOf,
    description = ''
  }) {
    let wrapper = this.getItemResponseType(wrapperOf);

    if (_.trim(description)) {
      wrapper.description = description;
    }

    this._refs = Object.assign({}, this._refs, {[name]: wrapper});

    return this;
  }

  registerGetPath(path, data) {
    this._paths = Object.assign({}, this._paths, { [path]: { "get": data } });
    return this;
  }

  getOpenAPIComponentByRef(ref) {
    return this._refs[ref];
  }

  getOpenAPIComponentByRefName(refName) {
    refName = _.trim(refName).toLowerCase();
    return Object.keys(this._refs).find(ref => ref.replace(COMPONENT_PATH, '').toLowerCase() === refName) || null;
  }

  getAllOpenAPIComponents() {
    return Object.assign({}, /*this._definitions,*/ this._refs || {});
  }

  getAllOpenAPIPaths() {
    return Object.assign({}, this._paths || {});
  }

  getItemResponseType(componentName) {
    return {
      "type": "object",
      "properties": {
        "entityType": {
          "type": "string",
          "description": "The entity type wrapped in the data section. Eg Site, SiteCloudComputingEndpoint etc"
        },
        "dataType": {
          "type": "string",
          "enum": ["item", "collection"],
          "description": "Indicates if the data section is a collection of entities or a single entity"
        },
        "httpStatus": {
          "type": "integer",
          "default": 200,
          "description": "The returning HTTP status of the response"
        },
        "data": {
          "type": "object",
          "$ref": "#/components/schemas/" + componentName
        }
      }
    }
  };

  getCollectionResponseType(componentName) {
    return {
      "type": "object",
      "properties": {
        "entityType": {
          "type": "string",
          "description": "The entity type wrapped in the data section. Eg Site, SiteCloudComputingEndpoint etc"
        },
        "dataType": {
          "type": "string",
          "enum": ["item", "collection"],
          "description": "Indicates if the data section is a collection of entities or a single entity"
        },
        "httpStatus": {
          "type": "integer",
          "default": 200,
          "description": "The returning HTTP status of the response"
        },
        "totalCount": {
          "type": "integer",
          "description": "The total entries of items in the backend"
        },
        "count": {
          "type": "integer",
          "description": "The number of entries in the response"
        },
        "limit": {
          "type": "integer",
          "description": "The requested maximum number of entries to return in this request"
        },
        "skip": {
          "type": "integer",
          "description": "The requested number of items to skip before returning the results."
        },
        "data": {
          "type": "array",
          "description": "An array of items of the specific entityType",
          "items": {
            "$ref": "#/components/schemas/" + componentName
          }
        }
      }
    }
  };

  getOpenAPICollectionParameters(extraParams) {
    extraParams = extraParams || [];
    extraParams = Array.isArray(extraParams) ? extraParams : [extraParams];

    return extraParams.concat([
      {
        "in": "query",
        "name": "filter",
        "required": false,
        "schema": {
          "type": "string"
        },
        "description": "Filter results"
      },
      {
        "in": "query",
        "name": "limit",
        "required": false,
        "schema": {
          "type": "integer"
        },
        "description": "Maximum number of items to return."
      },
      {
        "in": "query",
        "name": "skip",
        "required": false,
        "schema": {
          "type": "integer",
          "default": 0
        },
        "description": "Number of items to skip before returning the results."
      }
    ]);
  };

  getOpenAPIItemParameters(extraParams) {
    extraParams = extraParams || [];
    extraParams = Array.isArray(extraParams) ? extraParams : [extraParams];

    return extraParams.concat([/** Add predefined parameters here */]);
  };

  getOpenAPI200Response({ref = '', description = ''} = {ref:'', description:''}) {
    let response = {}

    if (_.trim(description)) {
      response.description = description;
    }

    if (_.trim(ref)) {
      response.content = {
        "application/json": {
          "schema": {
            "$ref": ref
          }
        }
      };
    }

    return response;
  };
}

export default OpenAPIDefinitions;