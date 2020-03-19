import {getTypeDefs} from '../graphql/index';
import {parse} from 'graphql';
import {toArray} from './utils';
import _ from 'lodash';

/**
 * Converts default GraphQL type definitions to an OpenAPI component
 * definitions object.
 *
 * @returns {object}  OpenAPI component definitions object
 */
export function getGraphQLDefinitions({COMPONENT_PATH}) {
  const getSchemaObjectTypes = schema => {
    return toArray(_.get(schema, 'definitions'))
      .filter(def => ['EnumTypeDefinition', 'ObjectTypeDefinition', 'InputObjectTypeDefinition'].indexOf(def.kind) > -1)
      .filter(def => def.name && def.name.kind === 'Name')
      .reduce((acc, def) => {
        let fqdn = COMPONENT_PATH + _.get(def, 'name.value');
        // console.log('parsing ', fqdn)
        switch (def.kind) {
          case 'EnumTypeDefinition':
            acc[fqdn] = {
              type: 'enum',
              description: _.trim(_.get(def, 'description.value')) || '',
              enum: toArray(_.get(def, 'values'))
                .map(v => _.get(v, 'name.value'))
                .filter(v => !!v)
            };
            break;
          case 'InputObjectTypeDefinition':
              acc[fqdn] = {
                type: 'object',
                inputType: 'filter',
                description: _.trim(_.get(def, 'description.value')),
                properties: getDefinitionFields(def)
              };
              break;
          default:
            acc[fqdn] = {
              type: 'object',
              description: _.trim(_.get(def, 'description.value')),
              properties: getDefinitionFields(def)
            };
            break;
        }

        return acc;
      }, {});
  };

  const getDefinitionFields = definition => {
    let fields = toArray(_.get(definition, 'fields'));

    return fields
      .filter(f => f.kind === 'FieldDefinition' || f.kind === 'InputValueDefinition')
      .reduce((acc, f) => {
        let name = _.trim(_.get(f, 'name.value'));

        if (name) {
          acc[name] = {};
          let description = _.trim(_.get(f, 'description.value'));
          let ftype = _.trim(_.get(f, 'type.name.value'));
          let ftypekind = _.trim(_.get(f, 'type.kind'));
          let format = '';
          if (ftypekind === 'NamedType') {
            ftype = ftype === 'ID' ? 'string' : ftype;
            switch (ftype.toLowerCase()) {
              case 'inputvaluedefinition':
                acc[name].type = 'object';
                break;
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
                acc[name]['$ref'] = COMPONENT_PATH + _.get(f, 'type.name.value');
                break;
            }
          } else if (ftypekind === 'ListType') {
            let arrType = _.trim(_.get(f, 'type.type.name.value'));
            acc[name].type = 'array';
            acc[name].items = {};
            switch (arrType.toLowerCase()) {
              case 'string':
                acc[name].items = { type: 'string' };
                break;
              case 'float':
                acc[name].items = { type: 'number', format: 'float' };
                break;
              case 'int':
                acc[name].items = { type: 'integer' };
                break;
              case 'boolean':
                acc[name].items = { type: 'boolean' };
                break;
              case 'object':
                acc[name].items = { type: 'object' };
                break;
              case 'enum':
                acc[name].items = { type: 'string', description: description, enum: [] };
                break;
              case '':
                // console.log('===> EMPTY' , f);
                break;
              default:
                acc[name].items = {
                  $ref: COMPONENT_PATH + _.get(f, 'type.type.name.value')
                };
                acc[name].graphQLType = _.get(f, 'type.type.name.value');
                break;
            }
          } else {
            // console.log('IGNORED =====> ', f);
          }

          if (description) {
            acc[name].description = description;
          }

          if (format) {
            acc[name].format = format;
          }
        }

        return acc;
      }, {});
  };

  const schema = parse(getTypeDefs());

  return getSchemaObjectTypes(schema);
}