import {resolveAs} from '../../utils';

const SiteServiceTemplateResolver = {
  Query: {
    siteCloudComputingTemplateById: (root, args, context, info) => context.api('siteServiceTemplate').getById(args.id, context),
    siteCloudComputingTemplates: resolveAs.collectionWith('siteServiceTemplate#getAll')
  },
  SiteCloudComputingTemplate: {
    site: resolveAs.itemWith('siteServiceTemplate#getSite'),
    service: resolveAs.itemWith('siteServiceTemplate#getSiteService'),
    endpoint: resolveAs.itemWith('siteServiceTemplate#getSiteServiceEndpoint'),
    images: resolveAs.collectionWith('siteServiceTemplate#getSiteServiceImagesByShare'),
    share: resolveAs.itemWith('siteServiceTemplate#getSiteServiceShare'),
    manager: resolveAs.itemWith('siteServiceTemplate#getSiteServiceManager')
  }
};

export default SiteServiceTemplateResolver;
