import {resolveAs} from '../../utils';

const DeprecatedGLUE20SiteServiceImageResolver = {
  Query: {
    siteServiceImages: resolveAs.collectionWith('deprecatedGLUE20SiteServiceImage#getAll')
  },
  DEPRECATEDGLUE20SiteServiceImage: {
    site: resolveAs.itemWith('deprecatedGLUE20SiteService#getSite'),
    service: resolveAs.itemWith('deprecatedGLUE20SiteServiceImage#getSiteService'),
    templates: resolveAs.collectionWith('deprecatedGLUE20SiteServiceImage#getSiteServiceTemplates')
  }
};

export default DeprecatedGLUE20SiteServiceImageResolver;