import _ from 'lodash';
import {query, TEMPLATE_COLLECTION_HEADER} from '../restModel';
import {asyncFilterToGraphQL, resultHandlerByPath} from '../utils';
import { TEMPLATE_SITE_DETAILS_FIELDS } from "./Site";
import { TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS } from "./SiteCloudComputingEndpoint";
import { TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_DETAILS_FIELDS,TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS } from "./SiteCloudComputingShare";
import SiteCloudComputingTemplate, { TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS } from "./SiteCloudComputingTemplate";

export const TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS = () =>`
id
entityName
entityCreationTime
entityValidity
entityOtherInfo
endpointID
imageID
description
version
OSPlatform
OSFamily
OSName
OSVersion
diskSize
shareVO
`;

export const TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS = () =>`
${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS()}
templateID
minCPU
recommendedCPU
minRAM
recommendedRAM
accessInfo
contextualizationName
installedsoftware
marketPlaceURL
imageBaseMpUri
imageContentType
imageVoVmiInstanceId
imageVmiInstanceId
imageVoVmiInstanceVO
imageAppDBVAppID
managerForeignKey
managerName
endpointForeignKey
shareForeignKey
sharePolicy
share {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS()}
}
`;

export const TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_COLLECTION_FIELDS =  () =>`
items {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS()}
}
`;

export const GRAPHQL_COLLECTION_ENDPOINT = 'siteCloudComputingImages';
export const GRAPHQL_COLLECTION_DETAILS_FIELDS = () => TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS();
export const GRAPHQL_COLLECTION_ITEM_FIELDS = () => TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS();

export const getFirst = (filter = '{}', fields = null, ctx) => {
  let usedFields = _.trim((_.isFunction(fields)) ? fields() : fields);
  usedFields = usedFields || GRAPHQL_COLLECTION_DETAILS_FIELDS();

  return getFiltered({filter, fields: usedFields, includePaging: false, resolver: 'data.items.0 as data'}, ctx);
};

export const getFiltered = ({filter = '{}', limit = -1, skip = 0, fields = null, includePaging = true, resolver = null} = {filter:'{}', limit: 1, skip: 0, fields: null, includePaging: true, resolver: null}, ctx) => {
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
  `, {}, ctx).then(resultHandlerByPath(resolver || 'data'))
}

export const getByIdentifier = (id, ctx) => {
  let caller = getCallerByIdentifier(id);
  return query(`{
    data: ${caller} {
      ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS()}
    }
  }`);
};

export const getCallerByIdentifier = (id, onlyQuery = false) => {
  if (onlyQuery) {
    return `id: {eq: "${id}"}`;
  }else {
    return `siteCloudComputingImageById(id: "${id}")`;
  }
};

export const getAll = ({filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}, ctx) => {
  return asyncFilterToGraphQL(filter).then(flt => {
    return query(`
      {
        data: siteCloudComputingImages(filter: ${flt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS()}
          }
        }
      }
    `, {}, ctx).then(resultHandlerByPath('data'));
  });
};

export const getSite = (imageId, ctx) => {
  let caller = getCallerByIdentifier(imageId);

  return query(`{
    data: ${caller} {
      id
      site {
        ${TEMPLATE_SITE_DETAILS_FIELDS()}
      }
    }
  }`, {}, ctx).then(resultHandlerByPath('data.site'));
};

export const getEndpoint = (imageId, ctx) => {
  let caller = getCallerByIdentifier(imageId);

  return query(`{
    data: ${caller} {
      id
      endpoint {
        ${TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS()}
      }
    }
  }`, {}, ctx).then(resultHandlerByPath('data.endpoint'));
};

export const getShare = (imageId, ctx) => {
  let caller = getCallerByIdentifier(imageId);

  return query(`{
    data: ${caller} {
      id
      share {
        ${TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_DETAILS_FIELDS()}
      }
    }
  }`, {}, ctx).then(resultHandlerByPath('data.share'));
};

export const getAllTemplates = (imageId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}, ctx) => {
  return asyncFilterToGraphQL(filter).then(templatesFlt => {
    let imageCaller = getCallerByIdentifier(imageId);
    let templatesQuery = `
      templates(filter: ${templatesFlt}, limit: ${limit}, skip: ${skip}) {
        ${TEMPLATE_COLLECTION_HEADER}
        items {
          ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()}
        }
      }
    `;

    return query(`{
      data: ${imageCaller} {
        id
        ${templatesQuery}
      }
    }`, {}, ctx).then(resultHandlerByPath('data.templates'));
  });
};

export const getTemplate = (imageId, templateId, ctx) => {
  let imageCaller = getCallerByIdentifier(imageId);
  let templateFlt = SiteCloudComputingTemplate.getCallerByIdentifier(templateId, true);

  let templateQuery = `
    templates(filter: {${templateFlt}}, limit: 1, skip: 0) {
      items {
        ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS()}
      }
    }
  `;

  return query(`{
    data: ${imageCaller} {
      id
      ${templateQuery}
    }
  }`, {}, ctx).then(resultHandlerByPath('data.templates.items.0'));
};

export default {
  getByIdentifier,
  getCallerByIdentifier,
  getFirst,
  getFiltered,
  getAll,
  getSite,
  getEndpoint,
  getShare,
  getAllTemplates,
  getTemplate
}