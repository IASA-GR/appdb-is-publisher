function getSchemaEntities(schemaName) {
  schemaName = (schemaName || '').toLowerCase();

  switch(schemaName) {
    case "glue20":
      return require('./glue20');
    case "glue21":
      return require('./glue21');
    default:
      throw new Error('The configured schema ' + schemaName + ' is not implemented');
  }
}

/**
 * Initializes the entities supported by the information system.
 *
 * @param   {object} context  Information System API.
 *
 * @returns {object}          Information System Entities API.
 */
function _initEntities(context) {
  const _schemaName = context.getSchema();
  const _entities = getSchemaEntities(_schemaName);
  const _entityInstances = _entities.init(context);

  console.log('\x1b[32m[ISPublisher:infosystem:API]\x1b[0m: Inited for schema ' + _schemaName);

  return {
    get: (name) => _entityInstances[name]
  };
}

export default _initEntities;