import initModel from './model';
import _ from 'lodash';

function _initDeprecatedGLUE20SiteServiceTemplate(context) {
  const _DeprecatedSiteServiceTemplateModel = initModel(context);

  const DeprecatedSiteServiceTemplate = {};

  DeprecatedSiteServiceTemplate.getById = (id, context) => _DeprecatedSiteServiceTemplateModel.getById(id, context);

  DeprecatedSiteServiceTemplate.getAll = ({root, args, context}) => _DeprecatedSiteServiceTemplateModel.findMany(args, context);

  DeprecatedSiteServiceTemplate.getSite = ({root, args, context}) => context.api('site').getByGocDBPKey(_.get(root, 'site.pkey'), args.fields, context);

  DeprecatedSiteServiceTemplate.getSiteService = ({root, args, context}) => context.api('deprecatedGLUE20SiteService').getByEndpointPKey(_.get(root, 'service.endpointPKey'), args.fields, context);

  DeprecatedSiteServiceTemplate.getSiteServiceImages = ({root, args, context}) => context.api('deprecatedGLUE20SiteService').getSiteServiceImages({
    root: {endpointPKey: _.get(root, 'service.endpointPKey')},
    args,
    context
  });

  DeprecatedSiteServiceTemplate.getModel = () => _DeprecatedSiteServiceTemplateModel;

  return DeprecatedSiteServiceTemplate;
}

export default _initDeprecatedGLUE20SiteServiceTemplate;