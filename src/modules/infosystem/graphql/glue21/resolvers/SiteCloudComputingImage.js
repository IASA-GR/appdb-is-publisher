import {resolveAs} from '../../utils';

const SiteServiceImageResolver = {
  Query: {
    siteCloudComputingImageById: (root, args, context, info) => context.api('siteServiceImage').getById(args.id, context),
    siteCloudComputingImages: resolveAs.collectionWith('siteServiceImage#getAll')
  },
  SiteCloudComputingImage: {
    site: resolveAs.itemWith('siteServiceImage#getSite'),
    service: resolveAs.itemWith('siteServiceImage#getSiteService'),
    endpoint: resolveAs.itemWith('siteServiceImage#getSiteServiceEndpoint')
    //templates: resolveAs.collectionWith('siteServiceImage#getSiteServiceTemplates')
  }
};

export default SiteServiceImageResolver;