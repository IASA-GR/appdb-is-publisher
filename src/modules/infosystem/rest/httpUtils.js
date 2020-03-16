import _ from 'lodash';

export const DEFAULT_LIMIT = 20;

/**
 * Express middleware to attach request metadata to express request object.
 *
 * @param {object} args             Metadata arguments.
 * @param {object} args.entityType  Name of information system entity.
 * @param {object} args.dataType    Either item or collection.
 */
export const RequestMetaData = ({entityType = null, dataType = 'item'} = {entityType: null, dataType: 'item'}) => {
  return (req, res, next) => {
    req.requestMetaData = Object.assign({}, {entityType, dataType});

    next();
  };
};

/**
 * Returns function to create an express middleware RequestMetaData for collection response types.
 *
 * @param {object} args             Metadata arguments.
 * @param {object} args.entityType  Name of information system entity.
 */
export const CollectionMetaData = ({entityType}) => RequestMetaData({entityType, dataType: 'collection'});

/**
 * Returns function to create an express middleware RequestMetaData for list response types.
 *
 * @param {object} args             Metadata arguments.
 * @param {object} args.entityType  Name of information system entity.
 */
export const ListMetaData = ({entityType}) => RequestMetaData({entityType, dataType: 'list'});

/**
 * Returns function to create an express middleware RequestMetaData for item response types.
 *
 * @param {object} args             Metadata arguments.
 * @param {object} args.entityType  Name of information system entity.
 */
export const ItemMetaData = ({entityType}) => RequestMetaData({entityType, dataType: 'item'});

/**
 * Apply request metadata to the given document object.
 *
 * @param   {object} doc  Document object.
 * @param   {object} req  Express request object.
 * @param   {object} ext  Optional. Extended attributes to attach to document.
 *
 * @returns {object}
 */
export const applyMetaData = (doc, req, ext) => {
  ext = _.isPlainObject(ext) ? ext : {};
  req.requestMetaData = req.requestMetaData || {};
  doc = {...req.requestMetaData, ...ext, ...doc};
  return doc;
};

/**
 * Handle GraphQL resource not found error.
 *
 * @param {object} req  Express request.
 * @param {object} res  Express response.
 */
export const _handleMissing = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(404);
  let doc = {
    httpStatus: 404,
    error: {
      type: 'NOT_FOUND',
      message: 'Not found',
      details: 'The requested resource does not exist.'
    }
  };
  res.json(doc);
  res.end();
};


/**
 * Extract GraphQL invalid filter value error.
 *
 * @param   {string} errorMessage   GraphQL error message.
 * @returns {string}                Error message or null.
 */
export const getInvalidFilterFromError = (errorMessage) => {
  let match = /^Argument\s+\"filter\" has invalid value (\{.*\})\./i.exec(errorMessage);
  return (match) ? match[1] : null;
};

/**
 * Collect GraphQL errors and create one error message.
 *
 * @param   {object} e  GrpahQL response object.
 *
 * @returns {string}    Error message.
 */
export const getGraphqlErrors = (e) => {
  let responseErrors = _.get(e, 'response.errors', []);
  return _.map(responseErrors, r => r.message).filter(e => !!e).map(s => s.replace(/\n/g, ' ')).join('\n');
};

/**
 * Handle GraphQL invalid filter error.
 *
 * @param   {object} req  Express request.
 * @param   {object} res  Express response.
 * @param   {object} e    GraphQL response object.
 *
 * @returns {boolean}     The error is handled.
 */
export const handleInvalidFilterError = (req, res, e) => {
  let errorMessage = (_.isString(e) ? e : e.message ) || '';
  let invalidFilter = /setting\s+.+\s+filter\s+property\s+as\s+\w+\s+value\s+with\s+invalid\s+operator/i.exec(errorMessage);
  if (!invalidFilter) {
    return false;
  }
  res.status(400);
  res.json({
    ...req.requestMetaData,
    httpStatus: 400,
    error: {
      type: "INVALID_FILTER_OPERATOR",
      message: 'Use of unsupported filtering operator in the provided filter.',
      details: e.message
    }
  }
);

  return true;
};

/**
 * Handle GraphQL unsupported filtering semantics error.
 *
 * @param   {object} req  Express request.
 * @param   {object} res  Express response.
 * @param   {object} e    GraphQL response object.
 *
 * @returns {boolean}     The error is handled.
 */
export const handleUnknownFilter = (req, res, e) => {
  let errorMessage = (_.isString(e) ? e : e.message ) || '';
  let invalidFilter = /Cannot\s+parse\s+all\s+of\s+the\s+filter\s+string\.\s+Unknown\s+filter/i.exec(errorMessage);
  if (!invalidFilter) {
    return false;
  }
  res.status(400);
  res.json({
    ...req.requestMetaData,
    httpStatus: 400,
    error: {
      type: "UNKNOWN_FILTER",
      message: 'Use of unsupported filtering semantics.',
      details: e.message
    }
  }
);

  return true;
};

/**
 * Handle GraphQL invalid filter for entity type error.
 *
 * @param   {object} req  Express request.
 * @param   {object} res  Express response.
 * @param   {object} e    GraphQL response object.
 *
 * @returns {boolean}     The error is handled.
 */
export const handleInvalidGraphQLFilterError = (req, res, e) => {
  let errorMessage = (_.isString(e) ? e : e.message ) || '';
  let invalidFilter = getInvalidFilterFromError(errorMessage);
  if (!invalidFilter) {
    return false;
  }

  res.status(400);
  res.json({
    ...req.requestMetaData,
    httpStatus: 400,
    error: {
      type: "INVALID_FILTER",
      message: "The provided filter is invalid for this entity type (" + invalidFilter + ").",
      details: getGraphqlErrors(e)
    }
  }
);

  return true;
};

/**
 * Handle GraphQL generic backend error.
 *
 * @param   {object} req  Express request.
 * @param   {object} res  Express response.
 * @param   {object} e    GraphQL response object.
 *
 * @returns {boolean}     The error is handled.
 */
export const handleGenericGraphQLError = (req, res, e) => {
  let isGraphQLError = (_.has(e, 'message') && _.has(e, 'stack') && _.has(e, 'response.errors') && _.has(e, 'request'));
  if (!isGraphQLError) {
    return false;
  }

  res.status(400);
  res.json({
    ...req.requestMetaData,
    httpStatus: 400,
    error: {
      type: "INVALID_REQUEST",
      message: "A backend service error occured while processing the request.",
      details: getGraphqlErrors(e)
    }
  }
);

  return true;
};

/**
 * Handle graphql response.
 *
 * @param   {Promise} pr    Resolved graphql request.
 * @param   {object}  req   Express request object.
 * @param   {object}  res   Express response object.
 *
 * @returns {Promise}       Resolved REST request.
 */
export const _handleRequest = (pr, req, res) => {
  return pr.then(doc => {
    doc = applyMetaData(doc, req, {httpStatus: 200});
    if (doc.data === null) {
      return Promise.resolve(_handleMissing(req, res));
    }
    if (doc.dataType === 'collection' || doc.dataType === 'list') {
      let items = doc.items || [];
      delete doc.items;
      let data = doc.data || {};
      delete doc.data;
      doc = Object.assign({}, doc, data || {});
      doc.data = items;
    }
    res.setHeader('Content-Type', 'application/json');
    res.json(doc);
    res.end();
  }
).catch(e => {
    res.setHeader('Content-Type', 'application/json');
    if (
      !handleInvalidFilterError(req, res, e) &&
      !handleUnknownFilter(req, res, e) &&
      !handleInvalidGraphQLFilterError(req, res, e) &&
      !handleGenericGraphQLError(req, res, e)
    ) {
      res.status(500);
      res.json({...req.requestMetaData, httpStatus: 500, error: e});
    }
    res.end();
  }
);
}

/**
 * Extract collection parameters from request object.
 *
 * @param   {object} req  Express request object.
 * @returns {object}      Collection parameters.
 */
export const getCollectionRequestParams = (req) => {
  return {
    filter: _.trim(req.query.filter) || {},
    limit: parseInt(req.query.limit) || DEFAULT_LIMIT,
    skip: parseInt(req.query.skip) || 0
  };
}