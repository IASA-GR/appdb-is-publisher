import _ from 'lodash';
import {query, TEMPLATE_COLLECTION_HEADER} from '../restModel';
import {asyncFilterToGraphQL, resultHandlerByPath} from '../utils';
import {TEMPLATE_SITE_DETAILS_FIELDS} from './Site';
import {TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS} from './SiteCloudComputingEndpoint';

export const TEMPLATE_SITE_SERVICE_STATUS_ITEM_FIELDS = () => `
  id
  type
  endpointGroup
  value
  timestamp
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

export const TEMPLATE_SITE_SERVICE_STATUS_DETAILS_FIELDS = () => `
id
type
endpointGroup
value
timestamp
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

export const TEMPLATE_SITE_SERVICE_STATUS_COLLECTION_FIELDS = () => `
  items {
    ${TEMPLATE_SITE_SERVICE_STATUS_ITEM_FIELDS}
  }
`;

export const getCallerByIdentifier = (id, onlyQuery = false) => {
  if (onlyQuery) {
    return `id: {eq: "${id}"}`;
  }else {
    return `siteServiceStatusById(id: "${id}")`;
  }
};

export const getByIdentifier = (id) => {
  let caller = getCallerByIdentifier(id);

  return query(`{
    data: ${caller} {
      ${TEMPLATE_SITE_SERVICE_STATUS_DETAILS_FIELDS()}
    }
  }`);
};

export const getSite = (id) => {
  let caller = getCallerByIdentifier(id);
  return query(`{
    data: ${caller} {
      id
      site {
        ${TEMPLATE_SITE_DETAILS_FIELDS()}
      }
    }
  }`).then(resultHandlerByPath('data.site as data'));
};

export const getEndpoint = (id, imageId) => {
  let caller = getCallerByIdentifier(id);

  return query(`{
    data: ${caller} {
      id
      endpoint{
        ${TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS()}
      }
    }
  }`).then(resultHandlerByPath('data.endpoint as data'));
};

export const getAll = ({filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
  return asyncFilterToGraphQL(filter).then(flt => {
    return query(`
      {
        data: siteServiceStatuses(filter: ${flt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            ${TEMPLATE_SITE_SERVICE_STATUS_ITEM_FIELDS()}
          }
        }
      }
    `).then(resultHandlerByPath('data'));
  });
};

export default {
  getAll,
  getCallerByIdentifier,
  getByIdentifier,
  getSite,
  getEndpoint,
  TEMPLATE_SITE_SERVICE_STATUS_ITEM_FIELDS,
  TEMPLATE_SITE_SERVICE_STATUS_DETAILS_FIELDS,
  TEMPLATE_SITE_SERVICE_STATUS_COLLECTION_FIELDS
}