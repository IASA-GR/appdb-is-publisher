import {merge} from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import {getDirectoryFiles} from './../../../lib/isql/utils/fs';

const DEFAULT_SCHEMA = 'glue20';
let _typeDefs = null;
/**
 * Initialize and generate GraphQL executable schema
 * based on the type definitions in ./schema/*.graphql files
 * and the resolvers in ./resolvers/*.js folders.
 *
 * @returns {object}  GraphQL module API.
 */
async function _init(config) {
  let schemaName = config.get('schema', DEFAULT_SCHEMA);
  let typeDefs = await getDirectoryFiles(__dirname + '/' + schemaName + '/schema/*.graphql', 'text/plain');
  let resolveDefs = await getDirectoryFiles(__dirname + '/' + schemaName + '/resolvers/*.js', 'application/javascript');
  let resolvers = resolveDefs.reduce((sum, def) => merge(sum, def), {});
  let executableSchema = null;
  _typeDefs = typeDefs;

  config.getLogger().info('Loaded IS Publisher GraphQL schema "' + schemaName + '"');

  return {
    getSchema: () => {
      executableSchema = executableSchema || makeExecutableSchema({typeDefs, resolvers});
      return executableSchema
    },
    getTypeDefs: () => typeDefs,
    getResolvers: () => resolvers
  };
}

export const serviceDescription = {
  '/graphql': {
    description: 'Service providing a GraphQL endpoint to query the information system backend.'
  },
  '/tools/graphiql': {
    description: 'Service providing a UI tool to post queries to the local GraphQL endpoint.'
  },
  '/tools/voyager': {
    description: 'Service providing a UI tool to visually explore the local GraphQL schema as an interactive graph. [experimental]'
  }
};

export const getTypeDefs = () => {
  if(Array.isArray(_typeDefs)) {
    return _typeDefs.join('\n');
  } else {
    return '' + _typeDefs;
  }
};

export default {
  init: _init,
  getTypeDefs
}