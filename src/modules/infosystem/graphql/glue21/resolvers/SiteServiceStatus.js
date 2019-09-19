import {resolveAs} from '../../utils';

const SiteServiceStatusResolver = {
  Query: {
    siteServiceStatusById: (root, args, context, info) => context.api('siteServiceStatus').getById(args.id, context),
    siteServiceStatuses: resolveAs.collectionWith('siteServiceStatus#getAll')
  },
  SiteServiceStatus: {
    site: resolveAs.itemWith('siteServiceStatus#getSite'),
    siteEndpoint: resolveAs.itemWith('siteServiceStatus#getSiteService')
  }
};

//export default SiteServiceStatusResolver;
export default {};