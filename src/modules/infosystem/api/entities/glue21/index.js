import Site from './Site';
import SiteService from './SiteService';
import SiteServiceImage from './SiteServiceImage';
import SiteServiceTemplate from './SiteServiceTemplate';
import SiteServiceStatus from './SiteServiceStatus';
import SiteServiceDowntime from './SiteServiceDowntime';
import SRVDowntime from './SRVDowntime';
import SiteServiceEndpoint from './SiteServiceEndpoint';
import SiteServiceShare from './SiteServiceShare';
import SiteServiceManager from './SiteServiceManager';
import DeprecatedGLUE20SiteService from './DeprecatedGLUE20SiteService';
import DeprecatedGLUE20SiteServiceImage from './DeprecatedGLUE20SiteServiceImage';
import DeprecatedGLUE20SiteServiceTemplate from './DeprecatedGLUE20SiteServiceTemplate';

let _entityInstances = null;

export function init(context) {
  _entityInstances = {
    site: Site(context),
    siteService: SiteService(context),
    siteServiceEndpoint: SiteServiceEndpoint(context),
    siteServiceShare: SiteServiceShare(context),
    siteServiceManager: SiteServiceManager(context),
    siteServiceImage: SiteServiceImage(context),
    siteServiceTemplate: SiteServiceTemplate(context),
    siteServiceStatus: SiteServiceStatus(context),
    siteServiceDowntime: SiteServiceDowntime(context),
    srvDowntime: SRVDowntime(context),
    deprecatedGLUE20SiteService: DeprecatedGLUE20SiteService(context),
    deprecatedGLUE20SiteServiceImage: DeprecatedGLUE20SiteServiceImage(context),
    deprecatedGLUE20SiteServiceTemplate: DeprecatedGLUE20SiteServiceTemplate(context)
  };

  return _entityInstances;
}
