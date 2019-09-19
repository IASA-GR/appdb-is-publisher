import {resolveAs, prepareItemResolverArgs} from '../../utils';

const SiteEndpointResolver = {
  Query: {
    siteCloudComputingEndpointById: (root, args, context, info) => context.api('siteServiceEndpoint').getById(args.id, prepareItemResolverArgs(args, info).fields || [], context),
    siteCloudComputingEndpointByGocDBPKey: (root, args, context, info) => context.api('siteServiceEndpoint').getByEndpointPKey(args.id, prepareItemResolverArgs(args, info).fields || [], context),
    siteCloudComputingEndpoints: resolveAs.collectionWith('siteServiceEndpoint')
  },
  SiteCloudComputingEndpoint: {
    site: resolveAs.itemWith('siteServiceEndpoint#getSite'),
    service: (root, args, context, info) => root.service,//resolveAs.itemWith('siteServiceEndpoint#getSiteService'),
    images: resolveAs.collectionWith('siteServiceEndpoint#getSiteServiceEndpointImages'),
    //templates: resolveAs.collectionWith('siteServiceEndpoint#getSiteServiceEndpointTemplates'),
    //serviceDowntimes: resolveAs.arrayWith('siteServiceEndpoint#getSiteServiceDowntimes'),
    //serviceStatus: resolveAs.itemWith('siteServiceEndpoint#getSiteServiceStatus'),
    imageList: resolveAs.mapArrayWith('siteServiceEndpoint', 'imageList'),
    //templateList: resolveAs.mapArrayWith('siteServiceTemplate', 'templateList')
  }
};

export default SiteEndpointResolver;