import _ from 'lodash';
import {query, TEMPLATE_COLLECTION_HEADER} from '../restModel';
import {asyncFilterToGraphQL, resultHandlerByPath} from '../utils';
import {TEMPLATE_SITE_DETAILS_FIELDS} from './Site';
import {TEMPLATE_SITE_SERVICE_DETAILS_FIELDS} from './SiteService';
import {TEMPLATE_SITE_SERVICE_TEMPLATE_COLLECTION_FIELDS, TEMPLATE_SITE_SERVICE_TEMPLATE_DETAILS_FIELDS} from './SiteServiceTemplate';
import SiteServiceTemplate from './SiteServiceTemplate';

export const TEMPLATE_SITE_SERVICE_IMAGE_COLLECTION_FIELDS = `
id
entityName
applicationEnvironmentID
applicationEnvironmentRepository
applicationEnvironmentAppName
applicationEnvironmentAppVersion
`;
export const TEMPLATE_SITE_SERVICE_IMAGE_DETAILS_FIELDS =`
id
entityName
applicationEnvironmentID
applicationEnvironmentRepository
applicationEnvironmentAppName
applicationEnvironmentAppVersion
applicationEnvironmentDescription
applicationEnvironmentComputingManagerForeignKey
imageBaseMpUri
imageContentType
imageVoVmiInstanceId
imageVmiInstanceId
imageAppDBVAppID
hash
site {
  id
  pkey
  name
}
service {
  id
  endpointPKey
  isInProduction
  endpointURL
}
`;

export const getCallerByIdentifier = (id, onlyQuery = false) => {
  if (onlyQuery) {
    return `id: {eq: "${id}"}`;
  }else {
    return `siteServiceImageById(id: "${id}")`;
  }
};

export const getAll = ({filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
  return asyncFilterToGraphQL(filter).then(flt => {
    return query(`
      {
        data: siteServiceImages(filter: ${flt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
          ${TEMPLATE_SITE_SERVICE_IMAGE_COLLECTION_FIELDS}
          }
        }
      }
    `);
  });
};

export const getByIdentifier = (id) => {
  let caller = getCallerByIdentifier(id);

  return query(`{
    data: ${caller} {
      ${TEMPLATE_SITE_SERVICE_IMAGE_DETAILS_FIELDS}
    }
  }`);
};

export const getSiteService = (imageId) => {
  let caller = getCallerByIdentifier(imageId);
  return query(`{
    data: ${caller} {
      id
      service {
        ${TEMPLATE_SITE_SERVICE_DETAILS_FIELDS}
      }
    }
  }`).then(resultHandlerByPath('data.service as data'));
};

export const getSite = (imageId) => {
  let caller = getCallerByIdentifier(imageId);
  return query(`{
    data: ${caller} {
      id
      site {
        ${TEMPLATE_SITE_DETAILS_FIELDS}
      }
    }
  }`).then(resultHandlerByPath('data.site as data'));
};

export const getAllSiteServiceTemplates =   (imageId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
  return asyncFilterToGraphQL(filter).then(templatesFlt => {
    let caller = getCallerByIdentifier(imageId);
    let templatesQuery = `
      templates(filter: ${templatesFlt}, limit: ${limit}, skip: ${skip}) {
        ${TEMPLATE_COLLECTION_HEADER}
        items {
        ${TEMPLATE_SITE_SERVICE_TEMPLATE_COLLECTION_FIELDS}
        }
      }
    `;
    return query(`{
      data: ${caller} {
        id
        ${templatesQuery}
      }
    }`).then(resultHandlerByPath('data.templates'));
  });
};

export const getSiteServiceTemplate = (imageId, templateId) => {
  let caller = getCallerByIdentifier(imageId);
  let templateQuery = SiteServiceTemplate.getCallerByIdentifier(templateId, true);

  return query(`{
    data: ${caller} {
      id
      templates(filter: {${templateQuery}}, limit: 1, skip: 0) {
        items {
          ${TEMPLATE_SITE_SERVICE_TEMPLATE_DETAILS_FIELDS}
        }
      }
    }
  }`).then(resultHandlerByPath('data.templates.items.0'));
};

export default {
  getCallerByIdentifier,
  getAll,
  getByIdentifier,
  getSiteService,
  getSite,
  getAllSiteServiceTemplates,
  getSiteServiceTemplate
};