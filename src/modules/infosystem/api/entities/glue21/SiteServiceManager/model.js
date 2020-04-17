import EntityModel from '../../EntityModel';

function SiteServiceManagerModel(context) {
  return EntityModel.create({
    name                : 'SiteServiceManager',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.top.vaproviders.managers' } },
    baseFields          : ['_id', 'info.SiteName', 'info.SitePKey', 'info.SiteEndpointPKey', 'info.GLUE2ManagerID','info.GLUE2ManagerServiceForeignKey'],
    excludeFields       : ['site', 'images', 'templates'],
    propertyMap         : {
      'id'                                 : '_id', /*infosys: string*/
      'site.name'                          : 'info.SiteName', /*gocdb: string*/
      'site.pkey'                          : 'info.SitePKey', /*gocdb: string*/
      'endpointPKey'                       : 'info.SiteEndpointPKey', /*gocdb: string*/
      'serviceID'                          : 'info.GLUE2ManagerServiceForeignKey', /*glue2.1 string*/
      'managerID'                          : 'info.GLUE2ManagerID', /*glue2.1: string*/
      'cloudComputingServiceForeignKey'    : 'info.GLUE2CloudComputingManagerCloudComputingServiceForeignKey',
      'entityName'                         : 'info.GLUE2EntityName',
      'entityCreationTime'                 : 'info.GLUE2EntityCreationTime',
      'entityValidity'                     : 'info.GLUE2EntityValidity',
      'entityOtherInfo'                    : 'info.GLUE2EntityOtherInfo',
      'productName'                        : 'info.GLUE2ManagerProductName', /*glue2.1: string*/
      'productVersion'                     : 'info.GLUE2ManagerProductVersion', /*glue2.1: string*/
      'failover'                           : 'info.GLUE2CloudComputingManagerFailover', /*glue2.1: string*/
      'hypervisorName'                     : 'info.GLUE2CloudComputingManagerHypervisorName', /*glue2.1: string*/
      'hypervisorVersion'                  : 'info.GLUE2CloudComputingManagerHypervisorVersion', /*glue2.1: string*/
      'instanceMaxCPU'                     : 'info.GLUE2CloudComputingManagerInstanceMaxCPU', /*glue2.1: integer*/
      'instanceMaxDedicatedRAM'            : 'info.GLUE2CloudComputingManagerInstanceMaxDedicatedRAM', /*glue2.1: integer*/
      'instanceMaxRAM'                     : 'info.GLUE2CloudComputingManagerInstanceMaxRAM', /*glue2.1: integer*/
      'instanceMinCPU'                     : 'info.GLUE2CloudComputingManagerInstanceMinCPU', /*glue2.1: integer*/
      'instanceMinDedicatedRAM'            : 'info.GLUE2CloudComputingManagerInstanceMinDedicatedRAM', /*glue2.1: integer*/
      'instanceMinRAM'                     : 'info.GLUE2CloudComputingManagerInstanceMinRAM', /*glue2.1: integer*/
      'liveMigration'                      : 'info.GLUE2CloudComputingManagerLiveMigration', /*glue2.1: string*/
      'totalRAM'                           : 'info.GLUE2CloudComputingManagerTotalRAM', /*glue2.1: integer*/
      'totalCPUs'                          : 'info.GLUE2CloudComputingManagerTotalCPUs',
      'networkVirtualizationType'          : 'info.GLUE2CloudComputingManagerNetworkVirtualizationType',
      'CPUVirtualizationType'              : 'info.GLUE2CloudComputingManagerCPUVirtualizationType',
      'virtualdiskFormats'                 : 'info.GLUE2CloudComputingManagerVirtualdiskFormat',
      'VMBackupRestore'                    : 'info.GLUE2CloudComputingManagerVMBackupRestore', /*glue2.1: string*/
      'hash'                               : 'info.hash', /*infosys: string*/
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
                            relationOn: {key: 'info.GLUE2ManagerServiceForeignKey', foreignKey: 'info.GLUE2ServiceID'}
      },
      'endpoints' : {
                            name: 'SiteServiceEndpoint',
                            relationType: 'hasMany',
                            relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}
                          },
      'images'          : {
                            name: 'SiteServiceImage',
                            relationType: 'hasMany',
                            relationOn: {key: 'info.GLUE2ManagerID', foreignKey: 'info.GLUE2CloudComputingImageCloudComputingManagerForeignKey'}
                          },
      'templates'       : {
                            name: 'SiteServiceTemplate',
                            relationType: 'hasMany',
                            relationOn: {key: 'info.GLUE2ManagerID',foreignKey: 'info.GLUE2CloudComputingInstanceTypeCloudComputingManagerForeignKey'}
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
    },
    getLogger: context.getLogger
  });
}

export default SiteServiceManagerModel;