import initModel from './model';
import {getArgsWithBaseFilter} from '../../utils';
import _ from 'lodash';

function _initSiteServiceEndpoint(context) {
  const _SiteServiceEndpointModel = initModel(context);

  const SiteServiceEndpoint = {};

  SiteServiceEndpoint.getById = (id, context) => _SiteServiceEndpointModel.getById(id, context);

  SiteServiceEndpoint.getByEndpointPKey = (pkey, fields, context) => _SiteServiceEndpointModel.findOne({filter: {'endpointPKey': pkey}, fields: fields}, context);

  SiteServiceEndpoint.getByEndpointID = (endpointID, fields, context) => _SiteServiceEndpointModel.findMany({filter: {'endpointID': endpointID}, fields: fields}, context);

  SiteServiceEndpoint.getAll = ({root, args, context}) => {
    console.log('[SiteServiceEndpoint.getAll] ' , args);
    return _SiteServiceEndpointModel.findMany(args, context);
  };

  SiteServiceEndpoint.getSite = ({root, args, context}) => context.api('site').getByGocDBPKey(_.get(root, 'site.pkey'), args.fields,  context);

  SiteServiceEndpoint.getSiteService = ({root, args, context}) => context.api('siteService').getByServiceID(_.get(root, 'service.serviceID'), args.fields, context);

  SiteServiceEndpoint.getSiteServiceEndpointTemplates = ({root, args, context}) =>
    context.api('siteServiceTemplate').getAll({
      root,
      args: getArgsWithBaseFilter({'service.endpointPKey': root.endpointPKey}, args),
      context
    });

  SiteServiceEndpoint.getSiteServiceEndpointImages = ({root, args, context}) =>
    context.api('siteServiceImage').getAll({
      root,
      args: getArgsWithBaseFilter({'service.endpointPKey': root.endpointPKey}, args),
      context
    });

  SiteServiceEndpoint.getSiteServiceEndpointDowntimes = ({root, args, context}) => context.api('siteServiceDowntime').getBySiteServiceEndpointPKey(root.endpointPKey, args.fields || ["_id", "info"], context);

  SiteServiceEndpoint.getSiteServiceEndpointStatus = ({root, args, context}) => context.api('siteServiceStatus').getByEndpointPKey(root.endpointPKey, args.fields, context);

  SiteServiceEndpoint.getModel = () => _SiteServiceEndpointModel;

  return SiteServiceEndpoint;
}

export default _initSiteServiceEndpoint;