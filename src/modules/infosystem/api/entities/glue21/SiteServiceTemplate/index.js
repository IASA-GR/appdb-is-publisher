import initModel from './model';
import {getArgsWithBaseFilter} from '../../utils';
import _ from 'lodash';

function _initSiteServiceTemplate(context) {
  const _SiteServiceTemplateModel = initModel(context);

  const SiteServiceTemplate = {};

  SiteServiceTemplate.getById = (id, context) => _SiteServiceTemplateModel.getById(id, context);

  SiteServiceTemplate.getAll = ({root, args, context}) => _SiteServiceTemplateModel.findMany(args, context);

  SiteServiceTemplate.getSite = ({root, args, context}) =>
    context.api('site').getByGocDBPKey(
      _.get(root, 'site.pkey'),
      args.fields,
      context
    );

  SiteServiceTemplate.getSiteServiceEndpoint = ({root, args, context}) =>
    context.api('siteServiceEndpoint').getByEndpointPKey(
      _.get(root, 'endpointPKey'),
      args.fields,
      context
    );

  SiteServiceTemplate.getSiteService = ({root, args, context}) =>
    context.api('siteService').getByServiceID(
      _.get(root, 'serviceID'),
      args.fields,
      context
    );

  SiteServiceTemplate.getSiteServiceImages = ({root, args, context}) =>
    context.api('siteService').getSiteServiceImages({
      root: {endpointPKey: _.get(root, 'service.endpointPKey')},
      args,
      context
    });

  SiteServiceTemplate.getSiteServiceImagesByShare = ({root, args, context}) =>
    context.api('siteServiceImage').getAll({
      root,
      args: getArgsWithBaseFilter({'shareForeignKey': _.get(root, 'shareForeignKey')}, args),
      context
    });

  SiteServiceTemplate.getSiteServiceManager = ({root, args, context}) =>
    context.api('siteServiceManager').getByManagerID(_.get(root, 'managerForeignKey'), args.fields, context);

  SiteServiceTemplate.getSiteServiceShare = ({root, args, context}) =>
    context.api('siteServiceShare').getByGLUEShareID(_.get(root, 'shareForeignKey'), args.fields, context)

  SiteServiceTemplate.getModel = () => _SiteServiceTemplateModel;

  return SiteServiceTemplate;
}

export default _initSiteServiceTemplate;