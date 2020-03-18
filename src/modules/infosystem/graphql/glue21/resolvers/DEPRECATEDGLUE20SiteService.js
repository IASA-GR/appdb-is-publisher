import {resolveAs, prepareItemResolverArgs, resolveMapDataWith} from '../../utils';

const DeprecatedGLUE20SiteServiceResolver = {
  Query: {
    siteServices: resolveAs.collectionWith('deprecatedGLUE20SiteService')
  },
  DEPRECATEDGLUE20SiteService: {
    site: resolveAs.itemWith('deprecatedGLUE20SiteService#getSite'),
    images: resolveAs.collectionWith('deprecatedGLUE20SiteService#getImages'),
    templates: resolveAs.collectionWith('deprecatedGLUE20SiteService#getTemplates')
  }
};

export default DeprecatedGLUE20SiteServiceResolver;