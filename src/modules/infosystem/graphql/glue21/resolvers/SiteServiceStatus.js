import {resolveAs} from '../../utils';

const SiteServiceStatusResolver = {
  Query: {
    siteServiceStatusById: (root, args, context, info) => context.api('siteServiceStatus').getById(args.id, context),
    siteServiceStatuses: resolveAs.collectionWith('siteServiceStatus#getAll')
  },
  SiteServiceStatus: {
    site: resolveAs.itemWith('siteServiceStatus#getSite'),
    service: resolveAs.itemWith('siteServiceStatus#getSiteService'),
    endpoint: resolveAs.itemWith('siteServiceStatus#getSiteServiceEndpoint')
  }
};

export default SiteServiceStatusResolver;