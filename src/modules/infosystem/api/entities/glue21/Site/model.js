import EntityModel from '../../EntityModel';

function SiteModel(context) {
  return EntityModel.create({
    name                : 'Site',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.goc.sites' } },
    baseFields          : ['_id', 'info.SitePKey', 'info.SiteName'],
    excludeFields       : ['services', 'images', 'templates', 'endpoints', 'shares', 'managers'],
    propertyMap         : {
      'id'                  : '_id',
      'pkey'                : 'info.SitePKey',
      'name'                : 'info.SiteName',
      'shortName'           : 'info.SiteShortName',
      'officialName'        : 'info.SiteOfficialName',
      'description'         : 'info.SiteDescription',
      'gocdbPortalUrl'      : 'info.SiteGocdbPortalUrl',
      'homeUrl'             : 'info.SiteHomeUrl',
      'giisUrl'             : 'info.SiteGiisUrl' ,
      'countryCode'         : 'info.SiteCountryCode',
      'country'             : 'info.SiteCountry',
      'tier'                : 'info.SiteTier',
      'subgrid'             : 'info.SiteSubgrid',
      'roc'                 : 'info.SiteRoc',
      'prodInfrastructure'  : 'info.SiteProdInfrastructure',
      'certStatus'          : 'info.SiteCertStatus',
      'timezone'            : 'info.SiteTimezone',
      'latitude'            : 'info.SiteLatitude',
      'longitude'           : 'info.SiteLongitude',
      'domainName'          : 'info.SiteDomainname',
      'hash'                : 'info.hash'
    },
    relationMap          : {
      'cloudComputingServices'  : {name: 'SiteService', relationType: 'hasMany', relationOn: {key: 'info.SitePKey', foreignKey:  'info.SitePKey'}},
      'cloudComputingEndpoints' : {name: 'SiteServiceEndpoint', relationType: 'hasMany', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'}},
      'cloudComputingShares'    : {name: 'SiteServiceShare', relationType: 'hasMany', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'}},
      'cloudComputingManagers'  : {name: 'SiteServiceManager', relationType: 'hasMany', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'}},
      'cloudComputingImages'    : {name: 'SiteServiceImage', relationType: 'hasMany', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'}},
      'cloudComputingTemplates' : {name: 'SiteServiceTemplate', relationType: 'hasMany', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'}},
      'serviceStatuses'  : {name: 'SiteServiceStatus', relationType: 'hasMany', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'}},
      'serviceDowntimes' : {name: 'SiteServiceDowntime', relationType: 'hasMany', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey'}}
    }
  });
}

export default SiteModel;