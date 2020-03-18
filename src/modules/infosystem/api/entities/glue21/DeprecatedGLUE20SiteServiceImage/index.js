import initModel from './model';
import _ from 'lodash';

function _initDeprecatedGLUE20SiteServiceImage(context) {
  const _DeprecatedSiteServiceImageModel = initModel(context);

  const DeprecatedSiteServiceImage = {};

  DeprecatedSiteServiceImage.getById = (id, context) => _DeprecatedSiteServiceImageModel.getById(id, context);

  DeprecatedSiteServiceImage.getAll = ({root, args, context}) => _DeprecatedSiteServiceImageModel.findMany(args, context);

  DeprecatedSiteServiceImage.getSite =  ({root, args, context}) => context.api('site').getByGocDBPKey(_.get(root, 'site.pkey'), args.fields, context);

  DeprecatedSiteServiceImage.getSiteService =  ({root, args, context}) => context.api('deprecatedGLUE20SiteService').getByEndpointPKey(_.get(root, 'endpointPKey'), args.fields, context);

  DeprecatedSiteServiceImage.getSiteServiceTemplates = ({root, args, context}) => context.api('deprecatedGLUE20SiteService').getSiteServiceTemplates({
    root: {endpointPKey: _.get(root, 'service.endpointPKey')},
    args,
    context
  });

  DeprecatedSiteServiceImage.getModel = () => {
    return _DeprecatedSiteServiceImageModel;
  };

  return DeprecatedSiteServiceImage;
}

export default _initDeprecatedGLUE20SiteServiceImage;