import EntityModel from '../../EntityModel';

function SiteServiceEndpointModel(context) {
  return EntityModel.create({
    name                : 'SiteServiceEndpoint',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.top.vaproviders' } },
    baseFields          : ['_id', 'info.SiteName', 'info.SitePKey', 'info.SiteEndpointPKey', 'info.GLUE2EndpointID', 'info.service.GLUE2ServiceID', 'info.service.SiteName', 'info.service.SitePKey'],
    excludeFields       : ['images', 'templates', 'managers', 'shares', 'serviceStatus', 'serviceDowntimes'],
    propertyMap         : {
      'id'                                                : '_id',
      'site.name'                                         : 'info.SiteName',
      'site.pkey'                                         : 'info.SitePKey',
      'endpointPKey'                                      : 'info.SiteEndpointPKey',
      'countryCode'                                       : 'info.SiteCountryCode',
      'country'                                           : 'info.SiteCountry',
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
      'endpointImplementationName'                        : 'info.GLUE2EndpointImplementationName',
      'endpointImplementationVersion'                     : 'info.GLUE2EndpointImplementationVersion',
      'endpointDowntimeInfo'                              : 'info.GLUE2EndpointDowntimeInfo',
      'endpointSemantics'                                 : 'info.GLUE2EndpointSemantics',
      'endpointAuthentication'                            : 'info.GLUE2EndpointAuthentication',
      'endpointIssuerCA'                                  : 'info.GLUE2EndpointIssuerCA',
      'endpointTrustedCA'                                 : 'info.GLUE2EndpointTrustedCA',
      'endpointServiceForeignKey'                         : 'info.GLUE2EndpointServiceForeignKey',
      'location.id'                                       : 'info.Location.GLUE2LocationID',
      'location.longitude'                                : 'info.Location.GLUE2LocationLongitude',
      'location.latitude'                                 : 'info.Location.GLUE2LocationLatitude',
      'location.country'                                  : 'info.Location.GLUE2LocationCountry',
      'location.countryCode'                              : 'info.Location.GLUE2LocationCountryCode',
      'entityName'                                        : 'info.GLUE2EntityName',
      'entityCreationTime'                                : 'info.GLUE2EntityCreationTime',
      'entityValidity'                                    : 'info.GLUE2EntityValidity',
      'entityOtherInfo'                                   : 'info.GLUE2EntityOtherInfo',
      'service.site.pkey'                                 : 'info.service.SitePKey',
      'service.site.name'                                 : 'info.service.SiteName',
      'service.entityName'                                : 'info.service.GLUE2EntityName',
      'service.entityCreationTime'                        : 'info.service.GLUE2EntityCreationTime',
      'service.entityValidity'                            : 'info.service.GLUE2EntityValidity',
      'service.entityOtherInfo'                           : 'info.service.GLUE2EntityOtherInfo',
      'service.serviceID'                                 : 'info.service.GLUE2ServiceID',
      'service.serviceQualityLevel'                       : 'info.service.GLUE2ServiceQualityLevel',
      'service.serviceStatusInfo'                         : 'info.service.GLUE2ServiceStatusInfo',
      'service.serviceType'                               : 'info.service.GLUE2ServiceType',
      'service.AUP'                                       : 'info.service.GLUE2CloudComputingServiceAUP',
      'service.haltedVM'                                  : 'info.service.GLUE2CloudComputingServiceHaltedVM',
      'service.runningVM'                                 : 'info.service.GLUE2CloudComputingServiceRunningVM',
      'service.suspendedVM'                               : 'info.service.GLUE2CloudComputingServiceSuspendedVM',
      'service.totalVM'                                   : 'info.service.GLUE2CloudComputingServiceTotalVM',
      'service.serviceAdminDomainForeignKey'              : 'info.service.GLUE2ServiceAdminDomainForeignKey',
      'service.capability'                                : 'info.service.GLUE2ServiceCapability',
      'service.complexity'                                : 'info.service.GLUE2ServiceComplexity',
      'imageList'                                         : 'info.images',
      'numberOfImages'                                    : 'meta.num_images',
      'templateList'                                      : 'info.templates',
      'numberOfTemplates'                                 : 'meta.num_templates',
      'shareList'                                         : 'info.shares',
      'numberOfManagers'                                  : 'meta.num_manager',
      'managerList'                                       : 'meta.managers',
      'numberOfShares'                                    : 'meta.num_shares',
      'hash'                                              : 'info.hash'
    },
    relationMap         : {
      'site'            : {name: 'Site', relationType: 'belongsTo', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'}, sharedFields: {'name': 'site.name', 'pkey': 'site.pkey'} },
      'service'         : {name: 'SiteService', relationType: 'belongsTo', relationOn: {key: 'info.GLUE2ServiceID', foreignKey: 'info.service.GLUE2ServiceID'},
        sharedFields: {
          'site.name'                   : 'service.site.name',
          'site.pkey'                   : 'service.site.pkey',
          'entityCreationTime'          : 'service.entityCreationTime',
          'entityValidity'              : 'service.entityValidity',
          'entityOtherInfo'             : 'service.entityOtherInfo',
          'serviceID'                   : 'service.serviceID',
          'serviceQualityLevel'         : 'service.serviceQualityLevel',
          'serviceStatusInfo'           : 'service.serviceStatusInfo',
          'serviceType'                 : 'service.serviceType',
          'AUP'                         : 'service.AUP',
          'haltedVM'                    : 'service.haltedVM',
          'runningVM'                   : 'service.runningVM',
          'suspendedVM'                 : 'service.suspendedVM',
          'totalVM'                     : 'service.totalVM',
          'serviceAdminDomainForeignKey': 'service.serviceAdminDomainForeignKey',
          'capability'                  : 'service.capability',
          'complexity'                  : 'service.complexity'
        },
        alwaysInclude: true
      },
      'images'          : {name: 'SiteServiceImage', relationType: 'hasMany', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}},
      'templates'       : {name: 'SiteServiceTemplate', relationType: 'hasMany', relationOn: {key: 'info.SiteEndpointPKey',foreignKey: 'info.SiteEndpointPKey'}},
      'managers'        : {name: 'SiteServiceManager', relationType: 'hasMany', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}},
      'shares'          : {name: 'SiteServiceShare', relationType: 'hasMany', relationOn: {key: 'info.GLUE2EndpointID', foreignKey: 'info.GLUE2ShareEndpointForeignKey'}},
      'serviceStatus'   : {name: 'SiteServiceStatus', relationType: 'hasOne', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}},
      'serviceDowntimes': {name: 'SiteServiceDowntime', relationType: 'hasMany', relationOn: {key: 'info.SiteEndpointPKey', foreignKey: 'info.SiteEndpointPKey'}}
    },
    postProcessFields : {
      'info.images'     : (doc) => doc.map(d => ({_id: 'egi.top.vaproviders.images.' + d.hash, info: d})),
      'info.templates'  : (doc) => doc.map(d => ({_id: 'egi.top.vaproviders.templates.' + d.hash, info: d})),
      'info.shares'     : (doc) => doc.map(d => ({_id: 'egi.top.vaproviders.shares.' + d.hash, info: d})),
      'info.managers'   : (doc) => doc.map(d => ({_id: 'egi.top.vaproviders.managers.' + d.hash, info: d}))
    }
  });
}

export default SiteServiceEndpointModel;