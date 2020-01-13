import {resolveAs, prepareItemResolverArgs} from '../../utils';

const SiteManagerResolver = {
  Query: {
    siteCloudComputingManagerById: (root, args, context, info) => context.api('siteServiceManager').getById(args.id, prepareItemResolverArgs(args, info).fields || [], context),
    siteCloudComputingManagers: resolveAs.collectionWith('siteServiceManager')
  },
  SiteCloudComputingManager: {
    site: resolveAs.itemWith('siteServiceManager#getSite'),
    service: resolveAs.itemWith('siteServiceManager#getSiteService'),
    endpoint: resolveAs.itemWith('siteServiceManager#getSiteServiceEndpoint'),
    images: resolveAs.collectionWith('siteServiceManager#getSiteServiceImages'),
    templates: resolveAs.collectionWith('siteServiceManager#getSiteServiceTemplates'),
  }
};

export default SiteManagerResolver;