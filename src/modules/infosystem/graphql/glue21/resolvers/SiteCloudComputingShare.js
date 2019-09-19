import {resolveAs, prepareItemResolverArgs} from '../../utils';

const SiteEndpointResolver = {
  Query: {
    siteCloudComputingShareById: (root, args, context, info) => context.api('siteServiceShare').getById(args.id, prepareItemResolverArgs(args, info).fields || [], context),
    siteCloudComputingShares: resolveAs.collectionWith('siteServiceShare')
  },
  SiteCloudComputingShare: {
    site: resolveAs.itemWith('siteServiceShare#getSite'),
    service: resolveAs.itemWith('siteServiceShare#getSiteService'),
    endpoint: resolveAs.itemWith('siteServiceShare#getSiteServiceEndpoint'),
    images: resolveAs.collectionWith('siteServiceShare#getSiteServiceImages'),
    templates: resolveAs.collectionWith('siteServiceShare#getSiteServiceTemplates'),
  }
};

export default SiteEndpointResolver;