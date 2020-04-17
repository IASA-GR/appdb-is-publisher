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

export const expressRouter = function (router, config, {schema, logger}) {
  let _router = null;

  try {
    _router = require('./' + schema).expressRouter(router, Object.assign(config, {logger: logger}));
    //console.log('\x1b[32m[ISPublisher:infosystem:RestAPI]\x1b[0m: Inited for schema ' + schema);
    logger.info('Inited IS Publisher REST API for schema ' + schema);
  } catch(e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      logger.error('Could not load REST API router. Reason: Module not found for schema "' + schema + '"')
    } else {
      logger.error('Could not load rest api router. Reason: ' + e);
    }
    _router = function(req, res, next) {
      next();
    };
  }

  return _router;
};

/**
 * Rest API service description.
 */
export const serviceDescription = function getServiceDescription({schema, logger}) {
  try {
    return require('./' + schema).serviceDescription;
  } catch(e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND") {
      logger.error('Could not load service description. Reason: Module not found for schema "' + schema + '"');
    } else {
      logger.error('Could not load service description. Reason: ' + e);
    }

    return {};
  }
};

/**
 * Add routes of documentation content fot the rest api
 *
 * @param   {object} router Express router instance
 * @returns {object}        Express router instance
 */
export const documentationRouter = function(router) {
  router.get('/rest/filters/:filter', function(req, res) {
    require('fs').readFile('dist/infosys.filter.' + req.params.filter + '.html', 'utf8', function(err, data) {
      if (err) {
        res.status(404);
        res.send('' + err);
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    })
  });

  router.get('/rest/filters', function(req, res) {
    require('fs').readFile('dist/infosys.filter.html', 'utf8', function(err, data) {
      if (err) {
        res.status(404);
        res.send('' + err);
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    })
  });

  return router;
}