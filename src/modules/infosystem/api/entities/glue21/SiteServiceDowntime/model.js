import EntityModel from '../../EntityModel';

function SiteServiceDowntimeModel(context) {
  return EntityModel.create({
    name                : 'SiteServiceDowntime',
    dbName              : 'testdb',
    dbConnection        : () => context.storage,
    baseFilter          : { 'meta.collection': { '$eq': 'egi.goc.vadowntimes' } },
    baseFields          : ['id', 'info.SiteName', 'info.SitePKey', 'info.SiteEndpointPKey'],
    excludeFields       : ['site', 'service'],
    propertyMap         : {
      'id'                      : '_id',
      'endpointPKey'            : 'info.SiteEndpointPKey',
      'isInProduction'          : 'info.SiteEndpointInProduction',
      'site.name'               : 'info.SiteName',
      'site.pkey'               : 'info.SitePKey',
      'site.countryCode'        : 'info.SiteCountryCode',
      'site.country'            : 'info.SiteCountryCode',
      'site.roc'                : 'info.SiteRoc',
      'site.prodInfrastructure' : 'info.SiteProdInfrastructure',
      'downtimePKey'            : 'info.DowntimePKey',
      'classification'          : 'info.DowntimeClassification',
      'severity'                : 'info.DowntimeSeverity',
      'startDate'               : 'info.DowntimeStartDate',
      'endDate'                 : 'info.DowntimeEndDate',
      'formatedStartDate'       : 'info.DowntimeFormatedStartDate',
      'formatedEndDate'         : 'info.DowntimeFormatedEndDate',
      'serviceType'             : 'info.DowntimeServiceType',
      'gocPortalUrl'            : 'info.DowntimeGocPortalUrl',
      'outcome'                 : 'info.DowntimeOutcome'
    },
    relationMap         : {
      'site'            : {name: 'Site', relationType: 'belongsTo', relationOn: {key: 'info.SitePKey', foreignKey: 'info.SitePKey' },  sharedFields: {'name': 'site.name', 'pkey': 'site.pkey', 'countryCode': 'site.countryCode', 'country': 'site.country', 'roc': 'site.roc', 'prodInfrastructure': 'site.prodInfrastructure'}},
      'endpoint'        : {name: 'SiteServiceEndpoint', relationType: 'belongsTo', relationOn: {key: 'info.SiteEndpointPKey', foreignKey:  'info.SiteEndpointPKey'}, sharedFields: {'endpointPKey': 'endpointPKey', 'isInProduction': 'isInProduction'}}
    }
  });
}

export default SiteServiceDowntimeModel;
