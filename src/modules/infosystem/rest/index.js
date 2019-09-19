import _ from 'lodash';
import {
  DEFAULT_LIMIT,
  RequestMetaData,
  CollectionMetaData,
  ItemMetaData,
  applyMetaData,
  _handleMissing,
  getInvalidFilterFromError,
  getGraphqlErrors,
  handleInvalidFilterError,
  handleUnknownFilter,
  handleInvalidGraphQLFilterError,
  handleGenericGraphQLError,
  _handleRequest,
  getCollectionRequestParams
} from './httpUtils';

/**
 * Handle GraphQL not implemented yet error.
 *
 * @param {object} req  Express request.
 * @param {object} res  Express response.
 */
export const handleNoImlementation = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(501);
  let doc = {
    httpStatus: 501,
    error: {
      type: "NOT_IMPLEMENTED",
      message: 'Not implemented',
      details: 'The requested facility is not implemented yet.'
    }
  };
  res.json(doc);
  res.end();
};

/**
 * Handle GraphQL invalid request error.
 *
 * @param {object} req  Express request.
 * @param {object} res  Express response.
 */
export const handleUnknown = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(400);
  let doc = {
    httpStatus: 400,
    error: {
      type: 'BAD_REQUEST',
      message: 'Bad request',
      details: 'Invalid request. Please check the URL for errors.'
    }
  };
  res.json(doc);
  res.end();
};

export const expressRouter = function (router, config, {schema}) {
  let _router = null;

  try {
    _router = require('./' + schema).expressRouter(router, config);
    console.log('\x1b[32m[ISPublisher::infosystem:RestAPI]\x1b[0m: Inited for schema ' + schema);
  } catch(e) {
    _router = function(req, res, next) { next(); };
    console.log('\x1b[31m[ISPublisher::infosystem:RestAPI][ERROR]\x1b[0m: Could not load rest api router. Reason: ', e);
  }

  return _router;
};

/**
 * Rest API service description.
 */
export const serviceDescription = function getServiceDescription({schema}) {
  try {
    return require('./' + schema).serviceDescription;
  } catch(e) {
    console.log('\x1b[31m[ISPublisher::infosystem:RestAPI][ERROR]\x1b[0m: Could not load service description for schema "' + schema + '". Reason: ' , e);
    return {};
  }
};