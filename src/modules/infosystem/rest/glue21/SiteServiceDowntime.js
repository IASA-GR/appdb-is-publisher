import _ from 'lodash';
import {query, TEMPLATE_COLLECTION_HEADER} from '../restModel';
import {asyncFilterToGraphQL, resultHandlerByPath} from '../utils';
import {TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS}  from './SiteCloudComputingEndpoint';
import {TEMPLATE_SITE_DETAILS_FIELDS} from './Site';

export const TEMPLATE_SITE_SERVICE_DOWNTIME_ITEM_FIELDS = () => `
  id
  downtimePKey
  classification
  severity
  startDate
  endDate
  formatedStartDate
  formatedEndDate
  serviceType
  gocPortalUrl
  outcome
`;

export const TEMPLATE_SITE_SERVICE_DOWNTIME_DETAILS_FIELDS = () => `
  id
  downtimePKey
  classification
  severity
  startDate
  endDate
  formatedStartDate
  formatedEndDate
  serviceType
  gocPortalUrl
  outcome
  site {
    id
    pkey
    name
  }
  endpoint {
    id
    endpointPKey
    endpointURL
  }
`;

export const TEMPLATE_SITE_SERVICE_DOWNTIME_COLLECTION_FIELDS = () => `
  items {
    ${TEMPLATE_SITE_SERVICE_DOWNTIME_ITEM_FIELDS()}
  }
`;

export const getCallerByIdentifier = (id, onlyQuery = false) => {
  if (onlyQuery) {
    return `id: {eq: "${id}"}`;
  }else {
    return `SiteServiceDowntimeById(id: "${id}")`;
  }
};

export const getByIdentifier = (id, ctx) => {
  let caller = getCallerByIdentifier(id);

  return query(`{
    data: ${caller} {
      ${TEMPLATE_SITE_SERVICE_DOWNTIME_DETAILS_FIELDS()}
    }
  }`, {}, ctx);
};

export const getSite = (id, ctx) => {
  let caller = getCallerByIdentifier(id);
  return query(`{
    data: ${caller} {
      id
      site {
        ${TEMPLATE_SITE_DETAILS_FIELDS()}
      }
    }
  }`, {}, ctx).then(resultHandlerByPath('data.site as data'));
};

export const getEndpoint = (id, ctx) => {
  let caller = getCallerByIdentifier(id);

  return query(`{
    data: ${caller} {
      id
      endpoint {
        ${TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS()}
      }
    }
  }`, {}, ctx).then(resultHandlerByPath('data.endpoint as data'));
};

export const getAll = ({filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}, ctx) => {
  return asyncFilterToGraphQL(filter).then(flt => {
    return query(`
      {
        data: SiteServiceDowntimes(filter: ${flt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            ${TEMPLATE_SITE_SERVICE_DOWNTIME_ITEM_FIELDS()}
          }
        }
      }
    `, {}, ctx).then(resultHandlerByPath('data'));
  });
};

export default {
  getAll,
  getCallerByIdentifier,
  getByIdentifier,
  getSite,
  getEndpoint,
  TEMPLATE_SITE_SERVICE_DOWNTIME_ITEM_FIELDS,
  TEMPLATE_SITE_SERVICE_DOWNTIME_DETAILS_FIELDS,
  TEMPLATE_SITE_SERVICE_DOWNTIME_COLLECTION_FIELDS
}