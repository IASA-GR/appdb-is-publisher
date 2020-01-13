import initModel from './model';
import {getArgsWithBaseFilter} from '../../utils';
import _ from 'lodash';

function _initSiteService(context) {
  const _SiteServiceModel = initModel(context);

  const SiteService = {};

  SiteService.getById = (id, context) => _SiteServiceModel.getById(id, context);

  SiteService.getBySitePKey = (pkey, fields, context) => _SiteServiceModel.findOne({filter: {'site.pkey': pkey}, fields: fields}, context);

  SiteService.getByServiceID = (serviceID, fields, context) => _SiteServiceModel.findOne({filter: {'serviceID': serviceID}, fields: fields}, context);

  SiteService.getAll = ({root, args, context}) => _SiteServiceModel.findMany(args, context);

  SiteService.getSite = ({root, args, context}) => context.api('site').getByGocDBPKey(_.get(root, 'site.pkey'), args.fields,  context);

  SiteService.getSiteServiceShares = ({root, args, context}) =>
    context.api('siteServiceShare').getAll({
      root,
      args: getArgsWithBaseFilter({'serviceID': root.serviceID}, args),
      context
    });

  SiteService.getSiteServiceManagers = ({root, args, context}) =>
    context.api('siteServiceManager').getAll({
      root,
      args: getArgsWithBaseFilter({'serviceID': root.serviceID}, args),
      context
    });

  SiteService.getSiteServiceEndpoints = ({root, args, context}) =>
    context.api('siteServiceEndpoint').getAll({
      root,
      args: getArgsWithBaseFilter({'service.serviceID': root.serviceID}, args),
      context
    });

  SiteService.getSiteServiceImages = ({root, args, context}) =>
    context.api('siteServiceImage').getAll({
      root,
      args: getArgsWithBaseFilter({'serviceID': root.serviceID}, args),
      context
    });

  SiteService.getSiteServiceTemplates = ({root, args, context}) =>
    context.api('siteServiceTemplate').getAll({
      root,
      args: getArgsWithBaseFilter({'serviceID': root.serviceID}, args),
      context
    });
  //SiteService.getSiteServiceDowntimes = ({root, args, context}) => context.api('siteServiceDowntime').getBySiteServiceEndpointPKey(root.endpointPKey, args.fields || ["_id", "info"], context);

  //SiteService.getSiteServiceStatus = ({root, args, context}) => context.api('siteServiceStatus').getByEndpointPKey(root.endpointPKey, args.fields, context);

  SiteService.getModel = () => _SiteServiceModel;

  return SiteService;
}

export default _initSiteService;