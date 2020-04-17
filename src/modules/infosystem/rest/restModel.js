import getGraphQLEndpoint from './getGraphQLEndpoint';
import { createApolloFetch } from 'apollo-fetch';

//Get GraphQL endpoint
const _graphQLEndpoint = getGraphQLEndpoint();

//Create a GraphQL client
export const client = createApolloFetch({uri: _graphQLEndpoint});

//Create query function
export const query = (query, variables, req) => {
  client.use((obj, next) => {
    if (req && req.logData) {
      if (!obj.options.headers) {
        obj.options.headers = {};
      }

      if (req.logData.requestId) {
        obj.options.headers['x-request-id'] = req.logData.requestId;
      }

      if (req.logData.requestSource) {
        obj.options.headers['x-request-source'] = req.logData.requestSource;
      }

      if (req.logData.ip) {
        obj.options.headers['x-forwarded-for'] = req.logData.ip;
      } else if(req.headers['x-forwarded-for'] || req.connection.remoteAddress) {
        obj.options.headers['x-forwarded-for'] = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      }
    }

    next();
  });

  return client({query: query, variables: variables});
}

export const TEMPLATE_COLLECTION_HEADER = `
totalCount
count
limit
skip`;