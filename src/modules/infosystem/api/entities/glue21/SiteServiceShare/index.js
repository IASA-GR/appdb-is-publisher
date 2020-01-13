import initModel from './model';
import {getArgsWithBaseFilter} from '../../utils';
import _ from 'lodash';

function _initSiteServiceShare(context) {
  const _SiteServiceShareModel = initModel(context);

  const SiteServiceShare = {};

  SiteServiceShare.getById = (id, context) => _SiteServiceShareModel.getById(id, context);

  SiteServiceShare.getAll = ({root, args, context}) => _SiteServiceShareModel.findMany(args, context);

  SiteServiceShare.getSite = ({root, args, context}) =>
    context.api('site').getByGocDBPKey(
      _.get(root, 'site.pkey'),
      args.fields,
      context
    );

  SiteServiceShare.getSiteService = ({root, args, context}) =>
    context.api('siteService').getByServiceID(
      _.get(root, 'serviceID'),
      args.fields,
      context
    );

  SiteServiceShare.getSiteServiceEndpoints = ({root, args, context}) =>
    context.api('siteServiceEndpoint').getAll({
        root,
        args: getArgsWithBaseFilter({'info.shares': {"$elemMatch": {"GLUE2ShareID" : root.shareID}}}, args),
        context
      });

  SiteServiceShare.getSiteServiceTemplates = ({root, args, context}) =>
    context.api('siteServiceTemplate').getAll({
      root,
      args: getArgsWithBaseFilter({'shareForeignKey': root.shareID}, args),
      context
    });

  SiteServiceShare.getSiteServiceImages = ({root, args, context}) =>
    context.api('siteServiceImage').getAll({
        root,
        args: getArgsWithBaseFilter({'shareForeignKey': root.shareID}, args),
        context
      });

  SiteServiceShare.getModel = () => _SiteServiceShareModel;

  return SiteServiceShare;
}

export default _initSiteServiceShare;