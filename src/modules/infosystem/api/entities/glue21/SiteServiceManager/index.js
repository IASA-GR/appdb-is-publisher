import initModel from './model';
import {getArgsWithBaseFilter} from '../../utils';
import _ from 'lodash';

function _initSiteServiceManager(context) {
  const _SiteServiceManagerModel = initModel(context);

  const SiteServiceManager = {};

  SiteServiceManager.getById = (id, context) => _SiteServiceManagerModel.getById(id, context);

  SiteServiceManager.getAll = ({root, args, context}) => _SiteServiceManagerModel.findMany(args, context);

  SiteServiceManager.getSite =  ({root, args, context}) => context.api('site').getByGocDBPKey(_.get(root, 'site.pkey'), args.fields, context);

  SiteServiceManager.getSiteService =  ({root, args, context}) => context.api('siteService').getByServiceID(_.get(root, 'serviceID'), args.fields, context);

  SiteServiceManager.getSiteServiceEndpoint =  ({root, args, context}) => context.api('siteServiceEndpoint').getByEndpointPKey(_.get(root, 'endpointPKey'), args.fields, context);

  SiteServiceManager.getSiteServiceTemplates = ({root, args, context}) =>
    context.api('siteServiceTemplate').getAll({
      root,
      args: getArgsWithBaseFilter({'managerForeignKey': _.get(root, 'managerID')}, args),
      context
    });

  SiteServiceManager.getSiteServiceImages = ({root, args, context}) =>
    context.api('siteServiceImage').getAll({
      root,
      args: getArgsWithBaseFilter({'managerForeignKey': _.get(root, 'managerID')}, args),
      context
    });

  SiteServiceManager.getModel = () => _SiteServiceManagerModel;

  return SiteServiceManager;
}

export default _initSiteServiceManager;