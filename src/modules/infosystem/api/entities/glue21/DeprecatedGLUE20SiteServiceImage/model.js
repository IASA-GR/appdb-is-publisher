import EntityModel from '../../EntityModel';

function SiteServiceImageModel(context) {
  return EntityModel.create({
    name                : 'DeprecatedGLUE20SiteServiceImage',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.top.vaproviders.images' } },
    baseFields          : ['_id', 'info.SiteName', 'info.SitePKey', 'info.SiteEndpointPKey'],
    excludeFields       : ['site', 'service'],
    propertyMap         : {
      'id'                                                : '_id',
      'site.name'                                         : 'info.SiteName',
      'site.pkey'                                         : 'info.SitePKey',
      'endpointPKey'                                      : 'info.SiteEndpointPKey',
      'endpointID'                                        : 'info.GLUE2EndpointID',
      'entityName'                                        : 'info.GLUE2CloudComputingImageID',
      'applicationEnvironmentID'                          : 'info.GLUE2CloudComputingImageID',
      'applicationEnvironmentRepository'                  : 'info.GLUE2CloudComputingImageMarketPlaceURL',
      'applicationEnvironmentAppName'                     : 'info.GLUE2EntityName',
      'applicationEnvironmentAppVersion'                  : 'info.GLUE2CloudComputingImageVersion',
      'applicationEnvironmentDescription'                 : 'info.GLUE2CloudComputingImageDescription',
      'applicationEnvironmentComputingManagerForeignKey'  : 'info.GLUE2CloudComputingImageCloudComputingManagerForeignKey',
      'imageBaseMpUri'                                    : 'info.ImageBaseMpUri',
      'imageContentType'                                  : 'info.ImageContentType',
      'imageVoVmiInstanceId'                              : 'info.ImageVoVmiInstanceId',
      'imageVmiInstanceId'                                : 'info.ImageVmiInstanceId',
      'imageVoVmiInstanceVO'                              : 'info.ImageVoVmiInstanceVO',
      'imageAppDBVAppID'                                  : 'info.ImageAppDBVAppID',
      'hash'                                              : 'info.hash'
    },
    relationMap         : {
      'site'            : { name: 'Site', relationType: 'belongsTo', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey' }, sharedFields: {'name': 'site.name', 'pkey': 'site.pkey'}},
      'service'         : { name: 'DeprecatedGLUE20SiteService', relationType: 'belongsTo', relationOn: {key: 'info.SiteEndpointPKey', foreignKey:  'info.SiteEndpointPKey'}, sharedFields: {'endpointPKey': 'service.endpointPKey'}},
      'templates'       : { name: 'DeprecatedGLUE20SiteServiceTemplate', relationType: 'manyToMany', relationOn: {key: 'info.SiteEndpointPKey', foreignKey:  'info.SiteEndpointPKey'}}
    }
  });
}

export default SiteServiceImageModel;