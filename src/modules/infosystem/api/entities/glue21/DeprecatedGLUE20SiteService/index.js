import initModel from './model';
import {getArgsWithBaseFilter} from '../../utils';
import _ from 'lodash';

function _initDeprecatedGLUE20SiteService(context) {
  const _DeprecatedSiteService = initModel(context);

  const DeprecatedSiteService = {};

  DeprecatedSiteService.getById = (id, context) => _DeprecatedSiteService.getById(id, context);

  DeprecatedSiteService.getByEndpointPKey = (pkey, fields, context) => _DeprecatedSiteService.findOne({filter: {'endpointPKey': pkey}, fields: fields}, context);

  DeprecatedSiteService.getByEndpointID = (endpointID, fields, context) => _DeprecatedSiteService.findMany({filter: {'endpointID': endpointID}, fields: fields}, context);

  DeprecatedSiteService.getAll = ({root, args, context}) => _DeprecatedSiteService.findMany(args, context);

  DeprecatedSiteService.getSite = ({root, args, context}) => context.api('site').getByGocDBPKey(_.get(root, 'site.pkey'), args.fields,  context);

  DeprecatedSiteService.getSiteService = ({root, args, context}) => context.api('deprecatedGLUE20SiteService').getByServiceID(_.get(root, 'service.serviceID'), args.fields, context);

  DeprecatedSiteService.getTemplates = ({root, args, context}) =>
    context.api('deprecatedGLUE20SiteServiceTemplate').getAll({
      root,
      args: getArgsWithBaseFilter({'endpointPKey': root.endpointPKey}, args),
      context
    });

  DeprecatedSiteService.getImages = ({root, args, context}) =>
    context.api('deprecatedGLUE20SiteServiceImage').getAll({
      root,
      args: getArgsWithBaseFilter({'endpointPKey': root.endpointPKey}, args),
      context
    });

  DeprecatedSiteService.getSiteServiceEndpointDowntimes = ({root, args, context}) => context.api('siteServiceDowntime').getBySiteServiceEndpointPKey(root.endpointPKey, args.fields || ["_id", "info"], context);

  DeprecatedSiteService.getSiteServiceEndpointStatus = ({root, args, context}) => context.api('siteServiceStatus').getByEndpointPKey(root.endpointPKey, args.fields, context);

  DeprecatedSiteService.getModel = () => _DeprecatedSiteService;

  return DeprecatedSiteService;
}

export default _initDeprecatedGLUE20SiteService;