import EntityModel from '../../EntityModel';

function SiteServiceEndpointModel(context) {
  return EntityModel.create({
    name                : 'DeprecatedGLUE20SiteService',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.top.vaproviders' } },
    baseFields          : ['_id', 'info.SiteName', 'info.SitePKey', 'info.SiteEndpointPKey', 'info.GLUE2EndpointID', 'info.service.GLUE2ServiceID', 'info.service.SiteName', 'info.service.SitePKey'],
    excludeFields       : ['images', 'templates', 'serviceStatus', 'serviceDowntimes'],
    propertyMap         : {
      'id'                                                : '_id',
      'site.name'                                         : 'info.SiteName',
      'site.pkey'                                         : 'info.SitePKey',
      'endpointPKey'                                      : 'info.SiteEndpointPKey',
      'isInProduction'                                    : 'info.SiteEndpointInProduction',
      'beta'                                              : 'info.SiteEndpointBeta',
      'gocPortalUrl'                                      : 'info.SiteEndpointGocPortalUrl',
      'gocEndpointUrl'                                    : 'info.SiteEndpointUrl',
      'endpointURL'                                       : 'info.GLUE2EndpointURL',
      'endpointServiceType'                               : 'info.SiteEndpointServiceType',
      'endpointID'                                        : 'info.GLUE2EndpointID',
      'endpointInterfaceName'                             : 'info.GLUE2EndpointInterfaceName',
      'endpointInterfaceVersion'                          : 'info.GLUE2EndpointInterfaceVersion',
      'endpointTechnology'                                : 'info.GLUE2EndpointTechnology',
      'endpointQualityLevel'                              : 'info.GLUE2EndpointQualityLevel',
      'endpointCapabilities'                              : 'info.GLUE2EndpointCapability',
      'endpointServingState'                              : 'info.GLUE2EndpointServingState',
      'endpointHealthState'                               : 'info.GLUE2EndpointHealthState',
      'endpointHealthStateInfo'                           : 'info.GLUE2EndpointHealthStateInfo',
      'endpointImplementor'                               : 'info.GLUE2EndpointImplementor',
      'endpointImplementationVersion'                     : 'info.GLUE2EndpointImplementationVersion',
      'location.id'                                       : 'info.Location.GLUE2LocationID',
      'location.longitude'                                : 'info.Location.GLUE2LocationLongitude',
      'location.latitude'                                 : 'info.Location.GLUE2LocationLatitude',
      'location.country'                                  : 'info.Location.GLUE2LocationCountry',
      'entityName'                                        : 'info.GLUE2EntityName',
      'entityOtherInfo'                                   : 'info.GLUE2EntityOtherInfo',
      'imageList'                                         : 'info.images',
      'numberOfImages'                                    : 'meta.num_images',
      'templateList'                                      : 'info.templates',
      'numberOfTemplates'                                 : 'meta.num_templates',
      'hash'                                              : 'info.hash'
    },
    relationMap         : {
      'site'            : {name: 'Site', relationType: 'belongsTo', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'}, sharedFields: {'name': 'site.name', 'pkey': 'site.pkey'} },
      'images'          : {name: 'DeprecatedGLUE20SiteServiceImage', relationType: 'hasMany', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}},
      'templates'       : {name: 'DeprecatedGLUE20SiteServiceTemplate', relationType: 'hasMany', relationOn: {key: 'info.SiteEndpointPKey',foreignKey: 'info.SiteEndpointPKey'}},
      'serviceStatus'   : {name: 'SiteServiceStatus', relationType: 'hasOne', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}},
      'serviceDowntimes': {name: 'SiteServiceDowntime', relationType: 'hasMany', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}}
    },
    postProcessFields : {
      'info.images'     : (doc) => doc.map(d => ({_id: 'egi.top.vaproviders.images.' + d.hash, info: Object.assign({}, d)})),
      'info.templates'  : (doc) => doc.map(d => ({_id: 'egi.top.vaproviders.templates.' + d.hash, info: Object.assign({}, d)}))
    }
  });
}

export default SiteServiceEndpointModel;