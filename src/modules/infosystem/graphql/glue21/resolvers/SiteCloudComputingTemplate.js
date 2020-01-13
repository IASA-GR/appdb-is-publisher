import {resolveAs} from '../../utils';

const SiteServiceTemplateResolver = {
  Query: {
    siteCloudComputingTemplateById: (root, args, context, info) => context.api('siteServiceTemplate').getById(args.id, context),
    siteCloudComputingTemplates: resolveAs.collectionWith('siteServiceTemplate#getAll')
  },
  SiteCloudComputingTemplate: {
    site: resolveAs.itemWith('siteServiceTemplate#getSite'),
    endpoint: resolveAs.itemWith('siteServiceTemplate#getSiteService'),
    images: resolveAs.collectionWith('siteServiceTemplate#getSiteServiceImages')
  }
};

export default SiteServiceTemplateResolver;
