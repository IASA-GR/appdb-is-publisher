import initModel from './model';
import _ from 'lodash';

function _initSiteServiceStatus(context) {
  const _SiteServiceStatusModel = initModel(context);

  const SiteServiceStatus = {};

  SiteServiceStatus.getById = (id, context) => _SiteServiceStatusModel.getById(id, context);

  SiteServiceStatus.getAll = ({root, args, context}) => _SiteServiceStatusModel.findMany(args, context);

  SiteServiceStatus.getByEndpointPKey = (pkey, fields, context) => _SiteServiceStatusModel.findOne({filter: {'endpointPKey': pkey}, fields: fields || ["_id","info"]}, context);

  SiteServiceStatus.getBySiteName = (name, fields, context) => _SiteServiceStatusModel.findMany({filter: {'site.name': name}, fields: fields}, context);

  SiteServiceStatus.getSite = ({root, args, context}) => context.api('site').getByName(_.get(root, 'site.name'), args.fields, context);

  /**
   * Since we do not get any information regarding the parent service of the endpoint
   * we must first get the endpoint refered from argo data and then get its service ID
   */
  SiteServiceStatus.getSiteService = ({root, args, context}) => {
    return context.api('siteServiceEndpoint').getByEndpointPKey(_.get(root, 'endpointPKey'), ['service.serviceID'], context)
      .then(data => {
        let serviceID = _.get(data, 'service.serviceID');

        if (!serviceID) {
          return null;
        }

        return context.api('siteService').getByServiceID(serviceID, args.fields, context);
      })
  }

  SiteServiceStatus.getSiteServiceEndpoint = ({root, args, context}) => context.api('siteServiceEndpoint').getByEndpointPKey(_.get(root, 'endpointPKey'), args.fields, context);

  SiteServiceStatus.getModel = () => _SiteServiceStatusModel;

  return SiteServiceStatus;
}

export default _initSiteServiceStatus;