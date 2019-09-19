
import Site from './Site';
import SiteService from './SiteService';
import SiteServiceImage from './SiteServiceImage';
import SiteServiceTemplate from './SiteServiceTemplate';
import SiteServiceStatus from './SiteServiceStatus';
import SiteServiceDowntime from './SiteServiceDowntime';
import SRVDowntime from './SRVDowntime';

let _entityInstances = null;

export function init(context) {
  _entityInstances = {
    site: Site(context),
    siteService: SiteService(context),
    siteServiceImage: SiteServiceImage(context),
    siteServiceTemplate: SiteServiceTemplate(context),
    siteServiceStatus: SiteServiceStatus(context),
    siteServiceDowntime: SiteServiceDowntime(context),
    srvDowntime: SRVDowntime(context)
  };

  return _entityInstances;
}
