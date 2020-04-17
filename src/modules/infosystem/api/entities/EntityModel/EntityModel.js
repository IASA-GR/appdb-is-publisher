import _ from 'lodash';
import EntityModelRegistry from './EntityModelRegistry';
import EntityMapper from './EntityMapper';
import ExecutionEngine from './ExecutionEngine';
import {
  DEFAULT_DB_FIELDS,
  DEFAULT_MODEL_FINDMANY_ARGUMENTS,
  DEFAULT_MODEL_FINDONE_ARGUMENTS,
  DEFAULT_ARRAY_OPERATOR_MAP,
  DEFAULT_OPERATOR_MAP
} from './EntityDefaults';
import {exportLogDataFromLogData} from '../../../../../lib/isql/utils/exportLogData';

const _errorMandatoryField = (msg) => {
  return () => {
    throw new Error(msg);
  };
};

/**
 * Creates a model to perform queries based on the given parameters
 *
 * @param {*} param0
 */
const _createModel = (
  {
    //The name of the model
    name              = _errorMandatoryField('[InfoSystem:api:entities:createModel] Must give name when creating a model'),
    //The DB collection name to be used. Can be String or Function -> String
    dbName            = _errorMandatoryField('[InfoSystem:api:entities:createModel] Must give dbNameparameter when creating a model'),
    //Key-Value object where keys are the external data schema property names and values are the corresponding DB field names.
    //Values can be either String or Function -> String
    propertyMap       = {},
    //Key-Value object where keys are the external schema scalar operator names and values are the corresponfing DB (eg. mango) scalar operator names
    //Value can be either String or Function(v) -> Object(key->DB operator, value -> v ) Eg eq -> $eq, like -> (v) => {$regex: v}
    operatorMap       = DEFAULT_OPERATOR_MAP,
    //Key-Value object where keys are the external schema array operator names and values are the corresponfing DB (eg. mango) array operator names
    //Value can be either String or Function(v) -> Object(key->DB operator, value -> v ). Eg. in -> $in, contains -> (v) => {$in: v}
    arrayOperatorMap  = DEFAULT_ARRAY_OPERATOR_MAP,
    //Key-Value object where keys are the external schema model names and values are objects containing information about the relation.
    relationMap       = {},
    //Filtering object based on the external filtering schema to be applied to all DB queries performed by this model
    baseFilter        = {},
    //Always return the given fields
    baseFields        = [],
    //Always exclude these fields from DB results
    excludeFields     = [],
    //Custom processing of fecthed fields before exporting and/or translate them to properties
    postProcessFields = {},
    //Custom processing of arguments before operation execution. Runs before postProcessFields.
    //Is an object with keys the operation names and value an array of functions getting the arguments of operation and
    //a callback function passing the new arguments to the next funcion if any, otherwise passes arguments to the original operation.
    preProcessOperations = {},
    //Custom processing of operation execution response. Runs after the operation returns.
    //Is an object with keys the operation names and value an array of function getting an object {initialArgs, args, response}, the context and
    //a callback function passing the new response to the next function if any, otherwise retruns to the original caller of the stack.
    postProcessOperations = {},
    //The DB connection instance
    dbConnection      = _errorMandatoryField('[InfoSystem:api:entities:createModel] Must give DB connection object'),
    getLogger = () => null
  } = {}
) => {

  const _rawLogger = getLogger('api');

  const getContextLogger = (context) => {
    context = context || {};
    let req = {};
    if (context.getRequest) {
      req = context.getRequest() || {};
    }

    let logData = exportLogDataFromLogData(req.logData, {module: 'entity'})

    return _rawLogger.child({logData: logData});

  }
  //Initializa Entity Model Mapper instance for this model.
  const _mapper = EntityMapper.create(name, {baseFilter, baseFields, propertyMap, operatorMap, arrayOperatorMap, relationMap});

  //CouchDB client getter.
  const _db = (_.isFunction(dbConnection)) ? dbConnection : () => dbConnection;

  //Initialize Execution Engine instance for this model.
  const _execEngine = ExecutionEngine.create({modelName: name, dbConnection: _db, mapper: _mapper, relationMap});

  //Gather post process functions declared in the model definition.
  const _postProcessFieldNames = _.keys(postProcessFields).filter(p => _.isFunction(postProcessFields[p]));

  //Dummy. For future use.
  const _postDocumentFetch = (doc) => {
    return doc;
  };

  /**
   * Apply post processing of document fields as customly defined in the model definition.
   *
   * @param   {object} doc  CouchDB document object.
   *
   * @returns {object}      Processed CouchDB document object.
   */
  const _postProcessFields = (doc) => {
    return _.reduce(_postProcessFieldNames, (acc, name) => {
      if (_.has(doc, name)) {
        doc[name] = postProcessFields[name](_.get(doc, name), doc);
      }
      return doc;
    }, doc);
  }

  /**
   * Transforms a DB document to a model object
   *
   * @param   {object} doc  DB document.
   * @returns {object}      Model object.
   */
  const _exportDocument = (doc) => {
    if (doc === null || doc.data === null) {
      return null;
    }

    return _postDocumentFetch(_mapper.getPropertiesFromFields(_postProcessFields(doc)));
  };

  /**
   * Returns a list of model objects based on the given model query.
   *
   * @param   {object}    query                         Model query.
   * @param   {object}    query.filter                  Model filter.
   * @param   {number}    query.skip                    Model skip(offset) entries.
   * @param   {number}    query.limit                   Model limit results.
   * @param   {object[]}  query.sort                    Array of sort property objects.
   * @param   {object[]}  query.fields                  Array of properties to retrieve.
   * @param   {boolean}   query.includeTotalCount       Optional. Retrieve the total count the query can return. If true, it performs two queries, one for the paged data and one for the count and will impact performance. Default false.
   * @param   {boolean}   query.translateProperties     Optional. Translate db fields to model properties. Default true.
   * @param   {boolean}   query.wrapItemsToCollection   Optional. Wrap list as a collection object (includes paging information, count etc), else it just returns the model object list. Default true.
   * @param   {object}    context                       Request context.
   *
   * @returns {Promise}                                 Resolves the model object collection.
   */
  const fetchMany = async ({filter = {}, skip, limit, sort = [], fields = [], includeTotalCount = false,translateProperties = true, wrapItemsToCollection= true} = DEFAULT_MODEL_FINDMANY_ARGUMENTS, context) => {
    let query = _mapper.getQuery({filter, limit, skip, sort, fields});
    let execQueries = await Promise.all([
      _db().findMany(query, context),
      ((includeTotalCount && wrapItemsToCollection) ? _db().findCount(query, context) : Promise.resolve(null))
    ]).then(vals => {
      return Promise.resolve({
        docs: (vals[0] || []).map((translateProperties) ? _exportDocument : (doc) => doc),
        totalCount: vals[1]
      });
    });

    if (wrapItemsToCollection === false) {
      return Promise.resolve(execQueries.docs);
    }

    return Promise.resolve({
      totalCount: execQueries.totalCount,
      count: execQueries.docs.length,
      skip: skip || 0,
      limit: limit || 0,
      sort: sort || [],
      filter: filter || {},
      items: execQueries.docs
    });
  }

  /**
   * Returns the first model object from the given query
   *
   * NOTE: It uses the ExecutionEngine, so if the filter contains references
   * accross documents, it will perform joins on the application level.
   *
   * @param   {object}    query                         Model query.
   * @param   {object}    query.filter                  Model filter.
   * @param   {object[]}  query.fields                  Array of properties to retrieve.
   * @param   {boolean}   query.translateProperties     Optional. Translate db fields to model properties. Default true.
   * @param   {object}    context                       Request context.
   *
   * @returns {Promise}                                 Resolves the model object collection.
   */
  const findOne = ({filter = {}, fields = DEFAULT_DB_FIELDS, translateProperties = true} = DEFAULT_MODEL_FINDONE_ARGUMENTS, context) => {
    let query = _mapper.getQuery({filter, limit: 1, skip: 0, fields});
    let logger = getContextLogger(context);

    logger.trace('DB Fetch single document request: ' + JSON.stringify(query));

    return _db().findOne(query, context).then(doc => ((translateProperties) ? _exportDocument(doc) : doc)).then(doc => {
      logger.trace('DB Fetch single document response "' + (doc._id || doc.id) + '"');
      return Promise.resolve(doc);
    });
  }

  /**
   * Returns a list of model objects based on the given model query.
   *
   * NOTE: It uses the ExecutionEngine, so if the filter contains references
   * accross documents, it will perform joins on the application level.
   *
   * @param   {object}    query                         Model query.
   * @param   {object}    query.filter                  Model filter.
   * @param   {number}    query.skip                    Model skip(offset) entries.
   * @param   {number}    query.limit                   Model limit results.
   * @param   {object[]}  query.sort                    Array of sort property objects.
   * @param   {object[]}  query.fields                  Array of properties to retrieve.
   * @param   {boolean}   query.includeTotalCount       Optional. Retrieve the total count the query can return. If true, it performs two queries, one for the paged data and one for the count and will impact performance. Default false.
   * @param   {boolean}   query.translateProperties     Optional. Translate db fields to model properties. Default true.
   * @param   {boolean}   query.wrapItemsToCollection   Optional. Wrap list as a collection object (includes paging information, count etc), else it just returns the model object list. Default true.
   * @param   {number}    query.nestedLevel             Optional. Used from ExecutionEngine to track down the documents join level. Default 0
   * @param   {object}    context                       Request context.
   *
   * @returns {Promise}                                 Resolves the model object collection.
   */
  const findMany = ({filter = {}, skip, limit, sort = [], fields = [], includeTotalCount = false, translateProperties = true, wrapItemsToCollection = true, nestedLevel = 0} = DEFAULT_MODEL_FINDMANY_ARGUMENTS, context) => {
    let logger = getContextLogger(context);

    logger.trace('Find many query request: ' + JSON.stringify({filter, skip, limit, sort, fields, includeTotalCount}));

    return _execEngine.executeQuery({filter, skip, limit, sort, fields, includeTotalCount, translateProperties, wrapItemsToCollection, nestedLevel}, context);
  }

  /**
   * Return a model object with the given ID.
   *
   * @param   {string}  id        DB document id.
   * @param   {object}  context   Request context.
   *
   * @returns {Promise}           Resolves model object.
   */
  const getById = (id, context) => {
    let logger = getContextLogger(context);

    logger.trace('DB Fetch document by ID request "' + id + '"');

    return _db().getById(id, context).then(doc => Promise.resolve(_exportDocument(doc))).then(doc => {
      logger.trace('DB Fetch document by ID repsonse: "' + (doc._id || doc.id) + '"');
      return Promise.resolve(doc);
    });
  };

  /**
   * Get count based on given filter.
   *
   * @param {object} query          Model query.
   * @param {object} query.filter   Module filter query.
   * @param {object} context        Request context.
   *
   * @returns {Promise}             Resolves count.
   */
  const getCount = ({filter = {}} = DEFAULT_MODEL_FINDONE_ARGUMENTS, context) => {
    let query = _mapper.getQuery({filter, fields: ['id']});
    let logger = getContextLogger(context);

    logger.trace('DB Fetch count of documents request: ' + JSON.stringify(query));

    return _db().findCount(query, context).then(res => {
      logger.trace('DB Fetch count of documents response:' + JSON.stringify(res));
      return Promise.resolve(res);
    });
  }

  /**
   * Checks if given query filter correspond to only one document.
   *
   * @param {object} query          Model query.
   * @param {object} query.filter   Module filter query.
   * @param {object} context        Request context.
   *
   * @returns {Promise}             Resolves boolean.
   */
  const hasOneEntry = ({filter = {}} = DEFAULT_MODEL_FINDONE_ARGUMENTS, context) => {
    let query = _mapper.getQuery({filter, limit: 2, skip: 0, fields: ['id']});

    return _db().findCount(query, context).then(count => (count === 1));
  };

  /**
   * Checks if given query filter correspond to more than one documents.
   *
   * @param {object} query          Model query.
   * @param {object} query.filter   Module filter query.
   * @param {object} context        Request context.
   *
   * @returns {Promise}             Resolves count.
   */
  const hasSomeEntries = ({filter = {}} = DEFAULT_MODEL_FINDONE_ARGUMENTS, context) => {
    let query = _mapper.getQuery({filter, limit: 2, skip: 0, fields: ['id']});
    return _db().findCount(query, context).then(count => (count > 1));
  };

  /**
   * Checks if given query filter correspond to one or more documents.
   *
   * @param {object} query          Model query.
   * @param {object} query.filter   Module filter query.
   * @param {object} context        Request context.
   *
   * @returns {Promise}             Resolves count.
   */
  const hasAny = ({filter = {}} = DEFAULT_MODEL_FINDONE_ARGUMENTS, context) => {
    let query = _mapper.getQuery({filter, limit: 1, skip: 0, fields: ['id']});
    return _db().findCount(query, context).then(count => (count > 0));
  };

  /**
   * Checks if given query filter does not correspond to any document.
   *
   * @param {object} query          Model query.
   * @param {object} query.filter   Module filter query.
   * @param {object} context        Request context.
   *
   * @returns {Promise}             Resolves count.
   */
  const hasNone = ({filter = {}} = DEFAULT_MODEL_FINDONE_ARGUMENTS, context) => {
    return !hasAny({filter}, comtext);
  };

  /**
   * Maps given DB document fields to Model properties.
   *
   * @param   {object[]} data List of DB documents.
   *
   * @returns {object[]}      List of Model objects.
   */
  const _map = (data) => {
    data = data || [];
    data = Array.isArray(data) ? data : [data];

    return data.map(d => _exportDocument(d));
  };

  /**
   * Maps one DB document fields to Model properties.
   *
   * @param   {object} data DB document.
   * @returns {object}      Model object.
   */
  const _mapOne = (data) => {
    return _.first(_map(data)) || null;
  };

  // Applies a chain of pre process and post process operations to the given action
  const _applyProcessOperationHooks = (
    hookedFunc,
    preOps = [],
    postOps = []
  ) => {
    //If no pre/post process operations defined simply return the function itself
    if (!preOps.length && !postOps.length) {
      return hookedFunc;
    }

    // Help function to create temp storage throughout the hook lifecycle
    const _createHookStorage = (storage = {initialCallArgs: [], callArgs: [], response: null}) => {
      return (name, val) => {
        if (name) {
          if (val) {
            storage[name] = val;
          }
          return storage[name];
        }
        return storage;
      }
    };

    return (...argus) => {
      // Create hook storage to store intermediate data between hook operations
      let hookStorage = _createHookStorage({
        // Copy initial arguments
        initialCallArgs: [].concat(argus),
        // Arguments to pass to preOps
        callArgs: _.merge([], argus),
        // Response from actual function call
        response: null
      });

      return preOps.reduce(
          //Call pre process operations sequencially
          (acc, preOp) => acc.then(newCallArgs => preOp(...newCallArgs)),
          Promise.resolve(hookStorage('callArgs'))
        )
        // Store call arguments to hook storage
        .then(callArgs => hookStorage('callArgs', callArgs))
        // Make actual function call with arguments passed from preOps execution chain response
        .then(callArgs => hookedFunc(...callArgs))
        // Store actual response
        .then(response => hookStorage('response', response))
        // Prepare arguments for post process operations
        .then(response => [hookStorage('initialCallArgs'), hookStorage('callArgs'), hookStorage('response')])
        // Call post process operations sequencially
        .then(postArgs => postOps.reduce((acc, postOp) => acc.then(postArgs => postOp(...postArgs)), Promise.resolve(postArgs)))
        // Retrieve post process operations response object
        .then(postArgs => postArgs[2]);
    };
  };

  //Find and apply hook operations to the supported functions if any.
  const _applyHooks = (supportedOps = null) => {
    supportedOps = supportedOps || ['findMany', 'findOne', 'getCount', 'fetchMany'];
    preProcessOperations = preProcessOperations || {};
    postProcessOperations = postProcessOperations || {};

    supportedOps.forEach((opName) => {
      let preOps = preProcessOperations[opName] || [];
      let postOps = postProcessOperations[opName] || [];
      if (preOps.length && postOps.length && _.isFunction(_modelOps[opName])) {
        _modelOps[opName] = _applyProcessOperationHooks(_modelOps[opName], preOps, postOps);
      }
    });
  };

  /**
   * Retrieve the property names of the shared fields of a relation
   *
   * @param   {string}    relationName  The name of the relation as defined in the model
   * @returns {string[]}                A list of property names
   */
  const _getRelationSharedProperties = (relationName) => {
    let sharedFields = _mapper.getRelationSharedFields(relationName);

    return  Object.keys(sharedFields) || [];
  };

  /**
   * Extract from given data the shared fields values of the given relation
   *
   * @param   {string} relationName The name of the relation as defined in the model
   * @param   {object} data         The data object to extract shared values from
   * @returns {object}              The extracted data
   */
  const _extractRelationSharedProperties  = (relationName, data) => {
    let propNames = _getRelationSharedProperties(relationName);
    let root = data[relationName] || {};

    return propNames.reduce((acc, name) => {
      acc[name] = root[name];
      return acc;
    }, {});
  };

  /**
   * Return the given fields of the relation that are not defined by the model.
   * Useful when trying to decide if an extra call is needed to retrieve missing fields
   * or the shared fields cover the current information requirements.
   *
   * @param   {string}    relationName  The name of the relation as defined in the model
   * @param   {string[]}  fields        The property names of the related data to query
   * @returns {string[]}                The property names of the related data which are not shared.
   */
  const _getMissingRelationSharedFields = (relationName, fields) => {
    let propNames = _getRelationSharedProperties(relationName);

    return fields.reduce((acc, field) => {
      if (propNames.indexOf(field) === -1) {
        acc.push(field);
      }

      return acc;
    }, []);
  }

  /**
   * Optimization. The DB documents contain denormalized information, thus containing information
   * that conceptualy belongs to another document. This function tries to extract such information for all of
   * the given fields from the given data object as returned from the current model call, so that the system
   * won't have to make another request to the DB to fetch shared information.
   *
   * The function returns a promise that resolves successfully if all the given relation fields are also provided
   * by the current entity model. The promise is rejected if at least one of these fields is not provided, signaling the
   * caller to perform a new request for the specific relation.
   * Although this function is actually synchronous, the promise based api is used to avoid more logic to the caller as
   * this is just for optimization purposes and it should not interfere much with the the code flow.
   *
   * The information as to which fields are considered shared between two entities is defined in the model definition
   * under the relation -> sharedFields section.
   *
   * An example of this optimization is when the user is quering from a SiteService model the name of the site it belongs to.
   * In the SiteService model the name and pkey of the "Site" relation are declared as shared (this must also align with the DB schema).
   * In this case the function will resolve with infromation retrieved from this
   *
   * NOTE1: This function should not be used for retrieving collections.
   * NOTE2: The sharedFields information is also used for filtering optimizations, so do not assume they are useless
   * if this optimization is not used.
   * NOTE3: This method must be explicitly used in the model api (eg Site/index.js) and is not automatically applied.
   *
   * @param   {string}    relationName  The name of the relation as defined in the model
   * @param   {string[]}  fields        The list of fileds to query from the related model
   * @param   {object}    data          Data returned from the current object
   * @return  {promise}                 Resolves with shared infromation, rejects if at least one field is not shared between two models.
   */
  const _tryRelationalSharedFields = (relationName, fields, data) => {
    let missing = _getMissingRelationSharedFields(relationName , fields);

    if (missing.length === 0) {
      try {
        let results = _extractRelationSharedProperties(relationName, data);
        return Promise.resolve(results);
      } catch(e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(new Error('[Optimization] Cannot extract shared fields for relation "' + name + '->' + relationName + '". Missing fields ' + missing.join(', ') + '.'));
  }

  //Setup Entity Model public api functions.
  const _modelOps = {
    findMany: findMany,
    findOne: findOne,
    getCount: getCount,
    getById: getById,
    hasAny: hasAny,
    hasNone: hasNone,
    hasOne: hasOneEntry,
    hasSome: hasSomeEntries,
    getMapper: () => _mapper,
    fetchMany: fetchMany,
    getExecutionEngine: () => _execEngine,
    map: _map,
    mapOne: _mapOne,
    tryRelationalSharedFields: _tryRelationalSharedFields
  };

  //Apply model hooks.
  _applyHooks();

  //Every Entity Model needs to be registered for other parts of the framework can look it up. (eg ExecutionPlanner ExecutionEngine, etc)
  EntityModelRegistry.register(name, _modelOps);

  return _modelOps;
};

export const createEntityModel = _createModel;

export default {
  create: _createModel
}