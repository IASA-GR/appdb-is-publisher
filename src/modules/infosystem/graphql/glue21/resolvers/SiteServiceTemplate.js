import {resolveAs} from '../../utils';

const SiteServiceTemplateResolver = {
  Query: {
    siteServiceTemplateById: (root, args, context, info) => context.api('siteServiceTemplate').getById(args.id, context),
    siteServiceTemplates: resolveAs.collectionWith('siteServiceTemplate#getAll')
  },
  SiteServiceTemplate: {
    site: resolveAs.itemWith('siteService#getSite'),
    siteEndpoint: resolveAs.itemWith('siteServiceTemplate#getSiteService'),
    images: resolveAs.collectionWith('siteServiceTemplate#getSiteServiceImages')
  }
};

//export default SiteServiceTemplateResolver;
export default {};