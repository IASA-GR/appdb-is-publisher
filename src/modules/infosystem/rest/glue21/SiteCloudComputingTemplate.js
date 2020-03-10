import _ from 'lodash';
import {query, TEMPLATE_COLLECTION_HEADER} from '../restModel';
import {asyncFilterToGraphQL, resultHandlerByPath} from '../utils';
import {TEMPLATE_SITE_DETAILS_FIELDS} from './Site';
import {TEMPLATE_SITE_CLOUD_COMPUTING_SERVICE_ITEM_FIELDS} from './SiteCloudComputingService';
import {TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_COLLECTION_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS} from './SiteCloudComputingImage';
import {TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS} from './SiteCloudComputingShare';
import {TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS} from './SiteCloudComputingManager';
import { TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS } from './SiteCloudComputingEndpoint';

export const TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS = () =>`
id
entityName
entityCreationTime
entityValidity
entityOtherInfo
endpointPKey
endpointID
resourceID
templateID
resourceManagerForeignKey
marketplaceURL
RAM
CPU
networkIn
networkOut
networkInfo
ephemeralStorage
disk
platform
networkPortsIn
networkPortsOut
managerForeignKey
endpointForeignKey
shareForeignKey
serviceID
managerName
instanceTypeVO
shareVO
sharePolicy
`;
export const TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS = () =>`
${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()}
site {
  id
  pkey
  name
}
share {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS()}
}
manager {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS()}
}
`;

export const TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_COLLECTION_FIELDS = () =>`
items {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()}
}
`;

export const GRAPHQL_COLLECTION_ENDPOINT = 'siteCloudComputingTemplates';
export const GRAPHQL_COLLECTION_DETAILS_FIELDS = () => TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS();
export const GRAPHQL_COLLECTION_ITEM_FIELDS = () => TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS();

export const getFirst = (filter = '{}', fields = null) => {
  let usedFields = _.trim((_.isFunction(fields)) ? fields() : fields);
  usedFields = usedFields || GRAPHQL_COLLECTION_DETAILS_FIELDS();

  return getFiltered({filter, fields: usedFields, includePaging: false, resolver: 'data.items.0 as data'});
};

export const getFiltered = ({filter = '{}', limit = -1, skip = 0, fields = null, includePaging = true, resolver = null} = {filter:'{}', limit: 1, skip: 0, fields: null, includePaging: true, resolver: null}) => {
  let usedLimit = (limit) ? `, limit: ${limit}` : '';
  let usedSkip = (skip) ? `, skip: ${skip}` : '';
  let usedFilter = (_.trim(filter)) ? `filter: ${filter}`: '';
  let usedPaging = (includePaging === false) ? '' : TEMPLATE_COLLECTION_HEADER();
  let usedFields = _.trim((_.isFunction(fields)) ? fields() : fields);
  usedFields = usedFields || GRAPHQL_COLLECTION_ITEM_FIELDS();

  return query(`
    data: ${GRAPHQL_COLLECTION_ENDPOINT}(${usedFilter}${usedLimit}${usedSkip}) {
      ${usedPaging}
      items {
        ${usedFields}
      }
    }
  `).then(resultHandlerByPath(resolver || 'data'))
}


export const getCallerByIdentifier = (id, onlyQuery = false) => {
  if (onlyQuery) {
    return `id: {eq: "${id}"}`;
  }else {
    return `siteCloudComputingTemplateById(id: "${id}")`;
  }
};

export const getSiteServiceImage = (templateId, imageId) => {
  let caller = getCallerByIdentifier(templateId);
  let imagesQuery = SiteServiceImage.getCallerByIdentifier(imageId, true);

  return query(`{
    data: ${caller} {
      id
      images(filter: {${imagesQuery}}, limit: 1, skip: 0) {
        items {
          ${TEMPLATE_SITE_SERVICE_IMAGE_DETAILS_FIELDS}
        }
      }
    }
  }`).then(resultHandlerByPath('data.images.items.0'));
};

export const getAllSiteServiceImages = (templateId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
  return asyncFilterToGraphQL(filter).then(imagesFlt => {
    let caller = getCallerByIdentifier(templateId);
    let imagesQuery = `
      images(filter: ${imagesFlt}, limit: ${limit}, skip: ${skip}) {
        ${TEMPLATE_COLLECTION_HEADER}
        items {
        ${TEMPLATE_SITE_SERVICE_IMAGE_COLLECTION_FIELDS}
        }
      }
    `;
    return query(`{
      data: ${caller} {
        id
        ${imagesQuery}
      }
    }`).then(resultHandlerByPath('data.images'));
  });
};

export const getSite = (templateId) => {
  let caller = getCallerByIdentifier(templateId);
  return query(`{
    data: ${caller} {
      id
      site {
        ${TEMPLATE_SITE_DETAILS_FIELDS}
      }
    }
  }`).then(resultHandlerByPath('data.site as data'));
};

export const getSiteService = (templateId) => {
  let caller = getCallerByIdentifier(templateId);
  return query(`{
    data: ${caller} {
      id
      service {
        ${TEMPLATE_SITE_SERVICE_DETAILS_FIELDS}
      }
    }
  }`).then(resultHandlerByPath('data.service as data'));
};

export const getByIdentifier = (id) => {
  let caller = getCallerByIdentifier(id);

  return query(`{
    data: ${caller} {
      ${TEMPLATE_SITE_SERVICE_TEMPLATE_DETAILS_FIELDS}
    }
  }`);
};

export const getAll =  ({filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
  return asyncFilterToGraphQL(filter).then(flt => {
    return query(`
      {
        data: siteServiceTemplates(filter: ${flt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
          ${TEMPLATE_SITE_SERVICE_TEMPLATE_COLLECTION_FIELDS}
          }
        }
      }
    `);
  });
};

export default {
  getByIdentifier,
  getAll,
  getFirst,
  getFiltered,
  getCallerByIdentifier,
  getSiteServiceImage,
  getAllSiteServiceImages,
  getSiteService,
  getSite
};