import EntityModel from '../../EntityModel';

function SiteServiceModel(context) {
  return EntityModel.create({
    name                : 'SiteService',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.top.vaproviders.services' } },
    baseFields          : ['_id', 'info.SiteName', 'info.SitePKey', 'info.SiteEndpointPKey', 'info.GLUE2ServiceID'],
    excludeFields       : [],
    propertyMap         : {
      'id'                                                : '_id',
      'site.name'                                         : 'info.SiteName',
      'site.pkey'                                         : 'info.SitePKey',
      'entityName'                                        : 'info.GLUE2EntityName',
      'entityCreationTime'                                : 'info.GLUE2EntityCreationTime',
      'entityValidity'                                    : 'info.GLUE2EntityValidity',
      'entityOtherInfo'                                   : 'info.GLUE2EntityOtherInfo',
      'serviceID'                                         : 'info.GLUE2ServiceID',
      'qualityLevel'                                      : 'info.GLUE2ServiceQualityLevel',
      'statusInfo'                                        : 'info.GLUE2ServiceStatusInfo',
      'serviceType'                                       : 'info.GLUE2ServiceType',
      'serviceAdminDomainForeignKey'                      : 'info.GLUE2ServiceAdminDomainForeignKey',
      'capability'                                        : 'info.GLUE2ServiceCapability',
      'complexity'                                        : 'info.GLUE2ServiceComplexity',
      'AUP'                                               : 'info.GLUE2CloudComputingServiceAUP',
      'haltedVM'                                          : 'info.GLUE2CloudComputingServiceHaltedVM',
      'runningVM'                                         : 'info.GLUE2CloudComputingServiceRunningVM',
      'suspendedVM'                                       : 'info.GLUE2CloudComputingServiceSuspendedVM',
      'totalVM'                                           : 'info.GLUE2CloudComputingServiceTotalVM',
      'hash'                                              : 'info.hash'
    },
    relationMap         : {
      'site'            : {name: 'Site', relationType: 'belongsTo', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'}, sharedFields: {'name': 'site.name', 'pkey': 'site.pkey'} },
      'endpoints'       : {name: 'SiteServiceEndpoint', relationType: 'hasMany', relationOn: {key: 'info.service.GLUE2ServiceID', foreignKey: 'info.GLUE2ServiceID'}},
      'shares'          : {name: 'SiteServiceShare', relationType: 'hasMany', relationOn: {key: 'info.GLUE2ServiceID', foreignKey: 'info.GLUE2ShareServiceForeignKey'}},
      'managers'        : {name: 'SiteServiceManager', relationType: 'hasMany', relationOn: {key: 'info.GLUE2ServiceID', foreignKey: 'info.GLUE2ManagerServiceForeignKey'}},
      'images'          : {name: 'SiteServiceImage', relationType: 'hasMany', relationOn: {key: 'info.GLUE2ServiceID', foreignKey: 'info.GLUE2ServiceID'}},
      'templates'       : {name: 'SiteServiceTemplate', relationType: 'hasMany', relationOn: {key: 'info.GLUE2ServiceID',foreignKey: 'info.GLUE2ServiceID'}}
      //'serviceStatuses' : {name: 'SiteServiceStatus', relationType: 'hasOne', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}},
      //'serviceDowntimes': {name: 'SiteServiceDowntime', relationType: 'hasMany', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}}
    },
    getLogger: context.getLogger
  });
}

export default SiteServiceModel;