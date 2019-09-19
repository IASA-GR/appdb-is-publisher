import EntityModel from '../../EntityModel';

function SiteServiceShareModel(context) {
  return EntityModel.create({
    name                : 'SiteServiceShare',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.top.vaproviders.shares' } },
    baseFields          : ['_id', 'info.SiteName', 'info.SitePKey', 'info.SiteEndpointPKey', 'info.ShareVO', 'info.GLUE2ShareID', 'info.GLUE2CloudComputingShareCloudComputingEndpointForeignKey'],
    excludeFields       : ['site', 'siteService', 'images', 'templates', 'serviceStatuses', 'serviceDowntimes'],
    propertyMap         : {
      'id'                                                        : '_id', /*infosys: string*/
      'site.name'                                                 : 'info.SiteName', /*gocdb: string*/
      'site.pkey'                                                 : 'info.SitePKey', /*gocdb: string*/
      'site.endpointPKey'                                         : 'info.SiteEndpointPKey', /*gocdb: string*/
      'entityName'                                                : 'info.GLUE2EntityName',/*glue2.1: string*/
      'entityCreationTime'                                        : 'info.GLUE2EntityCreationTime',/*glue2.1: string*/
      'entityValidity'                                            : 'info.GLUE2EntityValidity',/*glue2.1: string*/
      'shareID'                                                   : 'info.GLUE2ShareID',/*glue2.1: string*/
      'description'                                               : 'info.GLUE2ShareDescription',/*glue2.1: string*/
      'serviceForeignKey'                                         : 'info.GLUE2ShareServiceForeignKey',/*glue2.1: string*/
      'endpointForeignKey'                                        : 'info.GLUE2ShareEndpointForeignKey',/*glue2.1: string*/
      'cloudComputingendpointForeignKey'                          : 'info.GLUE2CloudComputingShareCloudComputingEndpointForeignKey',/*glue2.1: string*/
      'cloudComputingServiceForeignKey'                           : 'info.GLUE2CloudComputingShareCloudComputingServiceForeignKey',/*glue2.1: string*/
      'instanceMaxCPU'                                            : 'info.GLUE2CloudComputingShareInstanceMaxCPU',/*glue2.1: integer*/
      'instanceMaxRAM'                                            : 'info.GLUE2CloudComputingShareInstanceMaxRAM',/*glue2.1: integer*/
      'SLA'                                                       : 'info.GLUE2CloudComputingShareSLA',/*glue2.1: string*/
      'totalVM'                                                   : 'info.GLUE2CloudComputingShareTotalVM',/*glue2.1: integer*/
      'runningVM'                                                 : 'info.GLUE2CloudComputingShareRunningVM',/*glue2.1: integer*/
      'pendingVM'                                                 : 'info.GLUE2CloudComputingSharePendingVM',/*glue2.1: integer*/
      'suspendedVM'                                               : 'info.GLUE2CloudComputingShareSuspendedVM',/*glue2.1: integer*/
      'haltedVM'                                                  : 'info.GLUE2CloudComputingShareHaltedVM',/*glue2.1: integer*/
      'maxVM'                                                     : 'info.GLUE2CloudComputingShareMaxVM',/*glue2.1: integer*/
      'networkInfo'                                               : 'info.GLUE2CloudComputingShareNetworkInfo',/*glue2.1: string*/
      'defaultNetworkType'                                        : 'info.GLUE2CloudComputingShareDefaultNetworkType',/*glue2.1: string*/
      'publicNetworkName'                                         : 'info.GLUE2CloudComputingSharePublicNetworkName',/*glue2.1: string*/
      'projectID'                                                 : 'info.GLUE2CloudComputingShareProjectID',/*glue2.1: string*/
      'VO'                                                        : 'info.ShareVO',/*glue2.1: string*/
      'policy'                                                    : 'info.SharePolicy',/*glue2.1: string*/
      'hash'                                                      : 'info.hash', /*infosys: string*/
    },
    relationMap         : {
      'site'            : {
                            name: 'Site',
                            relationType: 'belongsTo',
                            relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'},
                            sharedFields: {'name': 'site.name', 'pkey': 'site.pkey'}
                          },
      'service'         : {
                            name: 'SiteService',
                            relationType: 'belongsTo',
                            relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'},
                            sharedFields: {'pkey': 'service.endpointPKey'}
                          },
      'endpoints'       : {
                            name: 'SiteServiceEndpoint',
                            relationType: 'hasMany',
                            relationOn: {key: 'info.GLUE2ShareEndpointForeignKey', foreignKey: 'info.GLUE2EndpointID'}
                          },
      'images'          : {
                            name: 'SiteServiceImage',
                            relationType: 'hasMany',
                            relationOn: {key: 'info.GLUE2ShareID', foreignKey: 'info.GLUE2CloudComputingImageCloudComputingShareForeignKey'}
                          },
      'templates'       : {
                            name: 'SiteServiceTemplate',
                            relationType: 'hasMany',
                            relationOn: {key: 'info.GLUE2ShareID', foreignKey: 'info.GLUE2CloudComputingInstanceTypeCloudComputingShareForeignKey'}
                          },
      'serviceStatuses' : {
                            name: 'SiteServiceStatus',
                            relationType: 'hasOne',
                            relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}
                          },
      'serviceDowntimes': {
                            name: 'SiteServiceDowntime',
                            relationType: 'hasMany',
                            relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}
                          }
    },
    postProcessFields : {
      'info.images'     : (doc) => doc.map(d => ({_id: 'egi.top.vaproviders.images.' + d.hash, info: d})),
      'info.templates'  : (doc) => doc.map(d => ({_id: 'egi.top.vaproviders.templates.' + d.hash, info: d}))
    }
  });
}

export default SiteServiceShareModel;