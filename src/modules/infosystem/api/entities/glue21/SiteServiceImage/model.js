import EntityModel from '../../EntityModel';

function SiteServiceImageModel(context) {
  return EntityModel.create({
    name                : 'SiteServiceImage',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.top.vaproviders.images' } },
    baseFields          : ['_id', 'info.SiteName', 'info.SitePKey', 'info.SiteEndpointPKey', 'info.GLUE2ServiceID', 'info.GLUE2CloudComputingImageCloudComputingManagerForeignKey', 'info.GLUE2CloudComputingImageCloudComputingEndpointForeignKey', 'info.GLUE2CloudComputingImageCloudComputingShareForeignKey'],
    excludeFields       : ['site', 'service'],
    propertyMap         : {
      'id'                                                : '_id',
      'site.name'                                         : 'info.SiteName',
      'site.pkey'                                         : 'info.SitePKey',
      'service.endpointPKey'                              : 'info.SiteEndpointPKey',
      'endpointID'                                        : 'info.GLUE2EndpointID',
      'serviceID'                                         : 'info.GLUE2ServiceID',
      'entityName'                                        : 'info.GLUE2EntityName',
      'entityCreationTime'                                : 'info.GLUE2EntityCreationTime',
      'entityValidity'                                    : 'info.GLUE2EntityValidity',
      'entityOtherInfo'                                   : 'info.GLUE2EntityOtherInfo',
      'imageID'                                           : 'info.GLUE2CloudComputingImageID',
      'description'                                       : 'info.GLUE2CloudComputingImageDescription',
      'templateID'                                        : 'info.GLUE2CloudComputingImageTemplateID',
      'OSPlatform'                                        : 'info.GLUE2CloudComputingImageOSPlatform',
      'OSFamily'                                          : 'info.GLUE2CloudComputingImageOSFamily',
      'OSName'                                            : 'info.GLUE2CloudComputingImageOSName',
      'OSVersion'                                         : 'info.GLUE2CloudComputingImageOSVersion',
      'version'                                           : 'info.GLUE2CloudComputingImageVersion',
      'minCPU'                                            : 'info.GLUE2CloudComputingImageMinCPU',
      'recommendedCPU'                                    : 'info.GLUE2CloudComputingImageRecommendedCPU',
      'minRAM'                                            : 'info.GLUE2CloudComputingImageMinRAM',
      'recommendedRAM'                                    : 'info.GLUE2CloudComputingImageRecommendedRAM',
      'diskSize'                                          : 'info.GLUE2CloudComputingImageDiskSize',
      'accessInfo'                                        : 'info.GLUE2CloudComputingImageAccessInfo',
      'contextualizationName'                             : 'info.GLUE2CloudComputingImageContextualizationName',
      'installedsoftware'                                 : 'info.GLUE2CloudComputingImageInstalledsoftware',
      'marketPlaceURL'                                    : 'info.GLUE2CloudComputingImageMarketPlaceURL',
      'imageBaseMpUri'                                    : 'info.ImageBaseMpUri',
      'imageContentType'                                  : 'info.ImageContentType',
      'imageVoVmiInstanceVO'                              : 'info.ImageVoVmiInstanceVO',
      'imageVoVmiInstanceId'                              : 'info.ImageVoVmiInstanceId',
      'imageVmiInstanceId'                                : 'info.ImageVmiInstanceId',
      'imageAppDBVAppID'                                  : 'info.ImageAppDBVAppID',
      'managerName'                                       : 'info.ManagerName',
      'managerForeignKey'                                 : 'info.GLUE2CloudComputingImageCloudComputingManagerForeignKey',
      'endpointForeignKey'                                : 'info.GLUE2CloudComputingImageCloudComputingEndpointForeignKey',
      'shareForeignKey'                                   : 'info.GLUE2CloudComputingImageCloudComputingShareForeignKey',
      'shareVO'                                           : 'info.ShareVO',
      'sharePolicy'                                       : 'info.SharePolicy',
      'hash'                                              : 'info.hash'
    },
    relationMap         : {
      'site'            : { name: 'Site', relationType: 'belongsTo', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey' }, sharedFields: {'name': 'site.name', 'pkey': 'site.pkey'}},
      'service'         : { name: 'SiteService', relationType: 'belongsTo', relationOn: {key: 'info.GLUE2ServiceID', foreignKey: 'info.GLUE2ServiceID'}, sharedFields: {'endpointPKey': 'service.endpointPKey'}},
      'endpoint'        : { name: 'SiteServiceEndpoint', relationType: 'belongsTo', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}},
      'templates'       : { name: 'SiteServiceTemplate', relationType: 'manyToMany', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}}
    }
  });
}

export default SiteServiceImageModel;