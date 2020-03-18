import EntityModel from '../../EntityModel';

function SiteServiceTemplateModel(context) {
  return EntityModel.create({
    name                : 'DeprecatedGLUE20SiteServiceTemplate',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.top.vaproviders.templates' } },
    baseFields          : ['_id', 'info.SiteName', 'info.SitePKey', 'info.SiteEndpointPKey'],
    excludeFields       : ['site', 'service'],
    propertyMap         : {
      'id'                                              : '_id',
      'site.name'                                       : 'info.SiteName',
      'site.pkey'                                       : 'info.SitePKey',
      'service.endpointPKey'                            : 'info.SiteEndpointPKey',
      'entityName'                                      : 'info.GLUE2EntityName',
      'resourceID'                                      : 'info.GLUE2ResourceID',
      'resourceManager'                                 : 'info.GLUE2ResourceManagerForeignKey',
      'executionEnvironmentMainMemorySize'              : 'info.GLUE2CloudComputingInstanceTypeRAM',
      'executionEnvironmentPhysicalCPUs'                : 'info.GLUE2CloudComputingInstanceTypeCPU',
      'executionEnvironmentLogicalCPUs'                 : 'info.GLUE2CloudComputingInstanceTypeCPU',
      //'executionEnvironmentCPUMultiplicity'             : 'info.GLUE2ExecutionEnvironmentCPUMultiplicity',
      'executionEnvironmentCPUMultiplicity'             : 'info.NO_VALUE', // does not exist in GLUE2.1
      //'executionEnvironmentOSFamily'                    : 'info.GLUE2ExecutionEnvironmentOSFamily',
      'executionEnvironmentOSFamily'                    : 'info.NO_VALUE', // does not exist in GLUE2.1
      'executionEnvironmentConnectivityIn'              : 'info.GLUE2CloudComputingInstanceTypeNetworkIn',
      'executionEnvironmentConnectivityOut'             : 'info.GLUE2CloudComputingInstanceTypeNetworkOut',
      'executionEnvironmentCPUModel'                    : 'info.GLUE2ExecutionEnvironmentCPUModel',
      'executionEnvironmentDiskSize'                    : 'info.GLUE2ExecutionEnvironmentDiskSize',
      'executionEnvironmentPlatform'                    : 'info.GLUE2CloudComputingInstanceTypePlatform',
      //'executionEnvironmentCPUVendor'                   : 'info.GLUE2ExecutionEnvironmentCPUVendor',
      'executionEnvironmentCPUVendor'                   : 'info.NO_VALUE', // does not exist in GLUE2.1
      //'executionEnvironmentVirtualMachine'              : 'info.GLUE2ExecutionEnvironmentVirtualMachine',
      'executionEnvironmentVirtualMachine'              : 'info.NO_VALUE', // does not exist in GLUE2.1
      'executionEnvironmentComputingManagerForeignKey'  : 'info.GLUE2CloudComputingInstanceTypeCloudComputingManagerForeignKey',
      'resourceManagerForeignKey'                       : 'info.GLUE2ResourceManagerForeignKey',
      'entityOtherInfo'                                 : 'info.GLUE2EntityOtherInfo',
      'hash'                                            : 'info.hash'
    },
    relationMap         : {
      'site'            : { name: 'Site', relationType: 'belongsTo', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey' }, sharedFields: {'name': 'site.name', 'pkey': 'site.pkey'}},
      'service'         : { name: 'DeprecatedGLUE20SiteService', relationType: 'belongsTo', relationOn: {key: 'info.SiteEndpointPKey', foreignKey:  'info.SiteEndpointPKey'}, sharedFields: {'endpointPKey': 'service.endpointPKey'}},
      'images'          : { name: 'DeprecatedGLUE20SiteServiceImage', relationType: 'manyToMany', relationOn: {key: 'info.SiteEndpointPKey', foreignKey:  'info.SiteEndpointPKey'}}
    }
  });
}

export default SiteServiceTemplateModel;
