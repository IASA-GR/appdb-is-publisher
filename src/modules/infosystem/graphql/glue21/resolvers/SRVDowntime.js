import {resolveAs} from '../../utils';

const SRVDowntimeResolver = {
  Query: {
    SRVDowntimeById: (root, args, context, info) => context.api('srvDowntime').getById(args.id, context),
    SRVDowntimes: resolveAs.collectionWith('srvDowntime#getAll')
  },
  SRVDowntime: {
    site: resolveAs.itemWith('srvDowntime#getSite'),
    siteEndpoint: resolveAs.itemWith('srvDowntime#getSiteService')
  }
};

//export default SRVDowntimeResolver;
export default {};