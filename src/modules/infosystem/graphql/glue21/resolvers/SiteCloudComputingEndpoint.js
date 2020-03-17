import {resolveAs, prepareItemResolverArgs, resolveMapDataWith} from '../../utils';

const SiteEndpointResolver = {
  Query: {
    siteCloudComputingEndpointById: (root, args, context, info) => context.api('siteServiceEndpoint').getById(args.id, prepareItemResolverArgs(args, info).fields || [], context),
    siteCloudComputingEndpointByGocDBPKey: (root, args, context, info) => context.api('siteServiceEndpoint').getByEndpointPKey(args.id, prepareItemResolverArgs(args, info).fields || [], context),
    siteCloudComputingEndpoints: resolveAs.collectionWith('siteServiceEndpoint')
  },
  SiteCloudComputingEndpoint: {
    site: resolveAs.itemWith('siteServiceEndpoint#getSite'),
    service: resolveAs.itemWith('siteServiceEndpoint#getSiteService'),
    images: resolveAs.collectionWith('siteServiceEndpoint#getImages'),
    templates: resolveAs.collectionWith('siteServiceEndpoint#getTemplates'),
    managers: resolveAs.collectionWith('siteServiceEndpoint#getManagers'),
    shares: resolveAs.collectionWith('siteServiceEndpoint#getShares'),
    serviceDowntimes: resolveAs.arrayWith('siteServiceEndpoint#getSiteServiceEndpointDowntimes'),
    serviceStatus: resolveAs.itemWith('siteServiceEndpoint#getSiteServiceEndpointStatus'),
    imageList: resolveAs.mapArrayWith('siteServiceImage', 'imageList'),
    templateList: resolveAs.mapArrayWith('siteServiceTemplate', 'templateList'),
    managerList: resolveAs.mapArrayWith('siteServiceManager', 'managerList'),
    shareList: resolveAs.mapArrayWith('siteServiceShare', 'shareList')
  }
};

export default SiteEndpointResolver;