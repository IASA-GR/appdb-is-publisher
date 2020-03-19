
import _ from 'lodash';
import {extractGraphQLQueryProperties} from './utils';
import {getGraphQLDefinitions} from './GraphQLDefinitions';

const COMPONENT_PATH = '#/components/schemas/';

class OpenAPIDefinitions {
  constructor() {
    this._definitions = getGraphQLDefinitions({COMPONENT_PATH});
    this._refs = {};
    this._paths = {};
    this._filters = {};
  }

  getComponentFromGraphQLQuery({
    graphQLType,
    graphQLFields,
    description = '',

  }) {
    if (!_.trim(graphQLFields)) {
      return {};
    }

    let properties = extractGraphQLQueryProperties(`{
      ${graphQLType} {
        ${graphQLFields}
      }
    }`);

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

            });

            if (acc[prop].type === 'array') {
              acc[prop].items = newComponent
            } else {
              acc[prop].properties = newComponent.properties;
            }
            delete newComponent.graphQLType;
          } else {
            let subDef = this._definitions[COMPONENT_PATH + acc[prop].graphQLType];

            if(subDef.type === 'enum') {
              acc[prop].type = 'string';
              acc[prop].enum = subDef.enum;
              acc[prop].description = subDef.description;
            }
          }

          delete acc[prop].graphQLType;
          delete acc[prop]["$ref"];
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

  registerListWrapperComponent({
    name,
    wrapperOf,
    description = ''
  }) {
    let wrapper = this.getListResponseType(wrapperOf);

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

  registerPathFilter({
    path,
    type
  }) {

    let fqdn = '#/components/schemas/' + type;
    this._filters[path] = fqdn;
  }

  registerGetPath(path, data, options) {
    this._paths = Object.assign({}, this._paths, { [path]: { "get": data } });

    if (options && options.filter && options.filter.graphQLType) {
      this.registerPathFilter({path, type: options.filter.graphQLType});
    }
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

  getAllGraphQLDefinitions() {
    return Object.assign({}, this._definitions || {});
  }

  getAllOpenAPIPaths() {
    return Object.assign({}, this._paths || {});
  }

  getAllFilters() {
    return Object.assign({}, this._filters || {});
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

  getListResponseType(componentName) {
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
          "type": "array",
          "description": "An array of items of the specific entityType",
          "items": {
            "$ref": "#/components/schemas/" + componentName
          }
        }
      }
    }
  }

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