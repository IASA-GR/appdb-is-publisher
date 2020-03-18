import {resolveAs} from '../../utils';

const DeprecatedGLUE20SiteServiceTemplateResolver = {
  Query: {
    siteServiceTemplates: resolveAs.collectionWith('deprecatedGLUE20SiteServiceTemplate#getAll')
  }
};

export default DeprecatedGLUE20SiteServiceTemplateResolver;