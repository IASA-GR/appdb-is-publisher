import {resolveAs, prepareItemResolverArgs, resolveMapDataWith} from '../../utils';

const SiteCloudComputingServiceResolver = {
  Query: {
    siteCloudComputingServiceById: (root, args, context, info) => context.api('siteService').getById(args.id, prepareItemResolverArgs(args, info).fields || [], context),
    siteCloudComputingServiceByGocDBPKey: (root, args, context, info) => context.api('siteService').getByEndpointPKey(args.id, prepareItemResolverArgs(args, info).fields || [], context),
    siteCloudComputingServices: resolveAs.collectionWith('siteService')
  },
  SiteCloudComputingService: {
    site: resolveAs.itemWith('siteService#getSite'),
    endpoints: resolveAs.collectionWith('siteService#getSiteServiceEndpoints'),
    images: resolveAs.collectionWith('siteService#getSiteServiceImages'),
    templates: resolveAs.collectionWith('siteService#getSiteServiceTemplates'),
    serviceDowntimes: resolveAs.arrayWith('siteService#getSiteServiceDowntimes'),
    serviceStatus: resolveAs.itemWith('siteService#getSiteServiceStatus'),
    shares: resolveAs.collectionWith('siteService#getSiteServiceShares'),
    managers: resolveAs.collectionWith('siteService#getSiteServiceManagers')
    //imageList: resolveAs.mapArrayWith('siteServiceImage', 'imageList'),
    //templateList: resolveAs.mapArrayWith('siteServiceTemplate', 'templateList')
  }
};

export default SiteCloudComputingServiceResolver;