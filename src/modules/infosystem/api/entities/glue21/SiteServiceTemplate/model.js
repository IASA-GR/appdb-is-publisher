import EntityModel from '../../EntityModel';

function SiteServiceTemplateModel(context) {
  return EntityModel.create({
    name                : 'SiteServiceTemplate',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.top.vaproviders.templates' } },
    baseFields          : ['_id', 'info.SiteName', 'info.SitePKey', 'info.SiteEndpointPKey'],
    excludeFields       : ['site', 'service'],
    propertyMap         : {
      'id'                               : '_id',
      'site.name'                        : 'info.SiteName',
      'site.pkey'                        : 'info.SitePKey',
      'endpointPKey'                     : 'info.SiteEndpointPKey',
      'endpointID'                       : 'info.GLUE2EndpointID',
      'entityName'                       : 'info.GLUE2EntityName',
      'entityCreationTime'               : 'info.GLUE2EntityCreationTime',
      'entityValidity'                   : 'info.GLUE2EntityValidity',
      'entityOtherInfo'                  : 'info.GLUE2EntityOtherInfo',
      'resourceID'                       : 'info.GLUE2ResourceID',
      'templateID'                       : 'info.GLUE2CloudComputingInstanceTypeTemplateID',
      'resourceManagerForeignKey'        : 'info.GLUE2ResourceManagerForeignKey',
      'marketplaceURL'                   : 'info.GLUE2CloudComputingInstanceTypeMarketplaceURL',
      'RAM'                              : 'info.GLUE2CloudComputingInstanceTypeRAM',
      'CPU'                              : 'info.GLUE2CloudComputingInstanceTypeCPU',
      'networkIn'                        : 'info.GLUE2CloudComputingInstanceTypeNetworkIn',
      'networkOut'                       : 'info.GLUE2CloudComputingInstanceTypeNetworkOut',
      'networkInfo'                      : 'info.GLUE2CloudComputingInstanceTypeNetworkInfo',
      'ephemeralStorage'                 : 'info.GLUE2CloudComputingInstanceTypeEphemeralStorage',
      'disk'                             : 'info.GLUE2CloudComputingInstanceTypeDisk',
      'platform'                         : 'info.GLUE2CloudComputingInstanceTypePlatform',
      'networkPortsIn'                   : 'info.GLUE2CloudComputingInstanceTypeNetworkPortsIn',
      'networkPortsOut'                  : 'info.GLUE2CloudComputingInstanceTypeNetworkPortsOut',
      'managerForeignKey'                : 'info.GLUE2CloudComputingInstanceTypeCloudComputingManagerForeignKey',
      'endpointForeignKey'               : 'info.GLUE2CloudComputingInstanceTypeCloudComputingEndpointForeignKey',
      'shareForeignKey'                  : 'info.GLUE2CloudComputingInstanceTypeCloudComputingShareForeignKey',
      'serviceID'                        : 'info.GLUE2ServiceID',
      'managerName'                      : 'info.ManagerName',
      'instanceTypeVO'                   : 'info.InstanceTypeVO',
      'shareVO'                          : 'info.ShareVO',
      'sharePolicy'                      : 'info.SharePolicy',
      'hash'                             : 'info.hash'
    },
    relationMap         : {
      'site'            : { name: 'Site', relationType: 'belongsTo', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey' }, sharedFields: {'name': 'site.name', 'pkey': 'site.pkey'}},
      'service'         : { name: 'SiteService', relationType: 'belongsTo', relationOn: {key: 'info.SiteEndpointPKey', foreignKey:  'info.SiteEndpointPKey'}, sharedFields: {'endpointPKey': 'service.endpointPKey'}},
      'images'          : { name: 'SiteServiceImage', relationType: 'manyToMany', relationOn: {key: 'info.SiteEndpointPKey', foreignKey:  'info.SiteEndpointPKey'}}
    }
  });
}

export default SiteServiceTemplateModel;