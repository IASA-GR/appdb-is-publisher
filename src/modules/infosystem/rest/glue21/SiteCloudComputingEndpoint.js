import _ from 'lodash';
import {query, TEMPLATE_COLLECTION_HEADER} from '../restModel';
import {asyncFilterToGraphQL, resultHandlerByPath} from '../utils';
import {TEMPLATE_SITE_DETAILS_FIELDS, TEMPLATE_SITE_ITEM_FIELDS} from './Site';
import SiteCloudComputingService, {TEMPLATE_SITE_CLOUD_COMPUTING_SERVICE_ITEM_FIELDS} from './SiteCloudComputingService';
import SiteCloudComputingImage, {TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS} from './SiteCloudComputingImage';
import SiteCloudComputingTemplate, {TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS} from './SiteCloudComputingTemplate';
import SiteCloudComputingShare, { TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_DETAILS_FIELDS } from './SiteCloudComputingShare';
import SiteCloudComputingManager, { TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_DETAILS_FIELDS } from './SiteCloudComputingManager';


export const TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS = () => `
id
endpointPKey
isInProduction
beta
gocPortalUrl
endpointServiceType
endpointURL
endpointID
endpointInterfaceName
endpointInterfaceVersion
endpointTechnology
endpointQualityLevel
endpointCapabilities
endpointServingState
endpointHealthState
endpointImplementor
endpointImplementationVersion
location {
  id
  longitude,
  latitude
  country
  domainForeignKey
}
computingEndpointComputingServiceForeignKey
endpointServiceForeignKey
managerID
managerProductName
managerProductVersion
computingManagerTotalLogicalCPUs
computingManagerWorkingAreaTotal
entityOtherInfo
`;

export const TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS = () => `
${TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS()}
serviceStatus {
  id
  type
  endpointGroup
  value
  timestamp
}
serviceDowntimes {
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
}
service {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_SERVICE_ITEM_FIELDS()}
}
shares: shareList {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS()}
}
managers: managerList {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS()}
}
images: imageList {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS()}
}
templates: templateList {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()}
}
site {
  id
  pkey
  name
}
`;


export const TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_COLLECTION_FIELDS = () => `
items {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS()}
}
`;

export const GRAPHQL_COLLECTION_ENDPOINT = () => 'siteCloudComputingEndpoints';
export const GRAPHQL_COLLECTION_ITEM_FIELDS = () => TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS();
export const GRAPHQL_COLLECTION_DETAILS_FIELDS = () => TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS();

export const getCallerByIdentifier = (id, onlyQuery = false) => {
  if (id.indexOf('gocdb:') === 0) {
    id = id.replace('gocdb:', '');
    if (onlyQuery) {
      return `endpointPKey: {eq: "${id}"}`;
    } else {
      return `siteCloudComputingEndpointByGocDBPKey(id: "${id}")`;
    }

  }  else {
    if (onlyQuery) {
      return `id: {eq: "${id}"}`;
    }else {
      return `siteCloudComputingEndpointById(id: "${id}")`;
    }
  }
};

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

export default function SiteCloudComputingEndpoint({openAPIDefinitions}) {

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingEndpointDetails',
    description: '',
    graphQLType: 'SiteCloudComputingEndpoint',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingEndpointItemResponse',
    wrapperOf: 'SiteCloudComputingEndpointDetails'
  });
  const getByIdentifier = (id) => {
    let caller = getCallerByIdentifier(id);
    return query(`{
      data: ${caller} {
        ${TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS()}
      }
    }`);
  };


  openAPIDefinitions.registerItemWrapperComponent({
    name: 'SiteItemResponse',
    wrapperOf: 'SiteDetails'
  });
  const getSite = (endpointId) => {
    let caller = getCallerByIdentifier(endpointId);

    return query(`{
      data: ${caller} {
        id
        site {
          ${TEMPLATE_SITE_DETAILS_FIELDS()}
        }
      }
    }`).then(resultHandlerByPath('data.site'));
  };

  const getAllImages = (endpointId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(imagesFlt => {
      let endpointCaller = getCallerByIdentifier(endpointId);
      let imagesQuery = `
        images(filter: ${imagesFlt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS()}
          }
        }
      `;
      return query(`{
        data: ${endpointCaller} {
          id
          ${imagesQuery}
        }
      }`).then(resultHandlerByPath('data.images'));
    });
  };

  const getImage = (endpointId, imageId) => {
    let endpointCaller = getCallerByIdentifier(endpointId);
    let imageFlt = SiteCloudComputingImage.getCallerByIdentifier(imageId, true);

    return query(`{
      data: ${endpointCaller} {
        id
        images(filter: {${imageFlt}}, limit: 1, skip: 0) {
          items {
            ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS()}
          }
        }
      }
    }`).then(resultHandlerByPath('data.images.items.0'));
  };


  const getAllImageTemplates = (endpointId, imageId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(templatesFlt => {
      let endpointCaller = getCallerByIdentifier(endpointId);
      let imageFlt = SiteCloudComputingImage.getCallerByIdentifier(imageId, true);

      let templatesQuery = `
        images(filter: {${imageFlt}}, limit: 1, skip: 0) {
          items {
            templates(filter: ${templatesFlt}, limit: ${limit}, skip: ${skip}) {
              ${TEMPLATE_COLLECTION_HEADER}
              items {
                ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()}
              }
            }
          }
        }
      `;
      return query(`{
        data: ${endpointCaller} {
          id
          ${templatesQuery}
        }
      }`).then(resultHandlerByPath('data.images.items.0.templates'));
    });
  };

  const getImageTemplate = (endpointId, imageId, templateId) => {
    let endpointCaller = getCallerByIdentifier(endpointId);
    let imageFlt = SiteCloudComputingImage.getCallerByIdentifier(imageId, true);
    let templateFlt = SiteCloudComputingTemplate.getCallerByIdentifier(templateId, true);

    let templateQuery = `
      images(filter: {${imageFlt}}, limit: 1, skip: 0) {
        items {
          templates(filter: {${templateFlt}}, limit: 1, skip: 0) {
            items {
              ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS()}
            }
          }
        }
      }

    `;

    return query(`{
      data: ${endpointCaller} {
        id
        ${templateQuery}
      }
    }`).then(resultHandlerByPath('data.images.items.0.templates.items.0'));
  };



  const getAllTemplates = (endpointId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(templatesFlt => {
      let endpointCaller = getCallerByIdentifier(endpointId);
      let templatesQuery = `
        templates(filter: ${templatesFlt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()}
          }
        }
      `;
      return query(`{
        data: ${endpointCaller} {
          id
          ${templatesQuery}
        }
      }`).then(resultHandlerByPath('data.templates'));
    });
  };

  const getTemplate = (endpointId, templateId) => {
    let endpointCaller = getCallerByIdentifier(endpointId);
    let templateQuery = SiteCloudComputingTemplate.getCallerByIdentifier(templateId, true);

    return query(`{
      data: ${endpointCaller} {
        id
        templates(filter: {${templateQuery}}, limit: 1, skip: 0) {
          items {
            ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS()}
          }
        }
      }
    }`).then(resultHandlerByPath('data.templates.items.0'));
  };

  const getShareImageTemplate = (endpointId, shareId, imageId, templateId) => {
    let endpointCaller = getCallerByIdentifier(endpointId);
    let shareFlt = SiteCloudComputingShare.getCallerByIdentifier(shareId, true);
    let imageFlt = SiteCloudComputingImage.getCallerByIdentifier(imageId, true);
    let templateFlt = SiteCloudComputingTemplate.getCallerByIdentifier(templateId, true);

    let templateQuery = `
      shares(filter: {${shareFlt}}, limit: 1, skip: 0) {
        items {
          images(filter: {${imageFlt}}, limit: 1, skip: 0) {
            items {
              templates(filter: {${templateFlt}}, limit: 1, skip: 0) {
                items {
                  ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS()}
                }
              }
            }
          }
        }
      }
    `;

    return query(`{
      data: ${endpointCaller} {
        id
        ${templateQuery}
      }
    }`).then(resultHandlerByPath('data.shares.items.0.images.items.0.templates.items.0'));
  };


  const getAllShareImageTemplates = (endpointId, shareId, imageId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(templatesFlt => {
      let endpointCaller = getCallerByIdentifier(endpointId);
      let sharesFlt = SiteCloudComputingShare.getCallerByIdentifier(shareId, true);
      let imagesFlt = SiteCloudComputingImage.getCallerByIdentifier(imageId, true);

      let templatesQuery = `
        shares(filter: {${sharesFlt}}, limit: 1, skip: 0) {
          items {
            images(filter: {${imagesFlt}}, limit: 1, skip: 0) {
              items {
                templates(filter: ${templatesFlt}, limit: ${limit}, skip: ${skip}) {
                  ${TEMPLATE_COLLECTION_HEADER}
                  items {
                    ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()}
                  }
                }
              }
            }
          }
        }`;

      return query(`{
        data: ${endpointCaller} {
          id
          ${templatesQuery}
        }
      }`).then(resultHandlerByPath('data.shares.items.0.images.items.0.templates'));
    });
  }

  const getShareImage = (endpointId, shareId, imageId) => {
    let endpointCaller = getCallerByIdentifier(endpointId);
    let shareFlt = SiteCloudComputingShare.getCallerByIdentifier(shareId, true);
    let imageFlt = SiteCloudComputingImage.getCallerByIdentifier(imageId, true);

    let imageQuery = `
      shares(filter: {${shareFlt}}, limit: 1, skip: 0) {
        items {
          images(filter: {${imageFlt}}, limit: 1, skip: 0) {
            items {
              ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS()}
            }
          }
        }
      }
    `;

    return query(`{
      data: ${endpointCaller} {
        id
        ${imageQuery}
      }
    }`).then(resultHandlerByPath('data.shares.items.0.images.items.0'));
  };

  const getAllShareImages = (endpointId, shareId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(imagesFlt => {
      let endpointCaller = getCallerByIdentifier(endpointId);
      let sharesFlt = SiteCloudComputingShare.getCallerByIdentifier(shareId, true);
      let imagesQuery = `
        shares(filter: {${sharesFlt}}, limit: 1, skip: 0) {
          items {
            images(filter: ${imagesFlt}, limit: ${limit}, skip: ${skip}) {
              ${TEMPLATE_COLLECTION_HEADER}
              items {
                ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS()}
              }
            }
          }
        }`;

      return query(`{
        data: ${endpointCaller} {
          id
          ${imagesQuery}
        }
      }`).then(resultHandlerByPath('data.shares.items.0.images'));
    });
  };

  const getShare = (endpointId, shareId) => {
    let endpointCaller = getCallerByIdentifier(endpointId);
    let shareFlt = SiteCloudComputingShare.getCallerByIdentifier(shareId, true);
    let shareQuery = `
      shares(filter: {${shareFlt}}, limit: 1, skip: 0) {
        items {
          ${TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_DETAILS_FIELDS()}
        }
      }
    `;

    return query(`{
      data: ${endpointCaller} {
        id
        ${shareQuery}
      }
    }`).then(resultHandlerByPath('data.shares.items.0'));
  };

  const getAllShares = (endpointId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(sharesFlt => {
      let endpointCaller = getCallerByIdentifier(endpointId);

      let shareQuery = `
        shares(filter: ${sharesFlt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
              ${TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS()}
            }
        }`;

      return query(`{
        data: ${endpointCaller} {
          id
          ${shareQuery}
        }
      }`).then(resultHandlerByPath('data.shares'));
    });
  };

  const getManagerTemplate = (endpointId, managerId, templateId) => {
    let endpointCaller = getCallerByIdentifier(endpointId);
    let managerFlt = SiteCloudComputingManager.getCallerByIdentifier(managerId, true);
    let templateFlt = SiteCloudComputingManager.getCallerByIdentifier(templateId, true);
    let templateQuery = `
      managers(filter: {${managerFlt}}, limit: 1, skip: 0) {
        items {
          templates(filter: {${templateFlt}}, limit: 1, skip: 0) {
            items {
              ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS()}
            }
          }
        }
      }
    `;

    return query(`{
      data: ${endpointCaller} {
        id
        ${templateQuery}
      }
    }`).then(resultHandlerByPath('data.managers.items.0.templates.items.0'));
  };

  const getAllManagerTemplates = (endpointId, managerId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(templatesFlt => {
      let endpointCaller = getCallerByIdentifier(endpointId);
      let managerFlt = SiteCloudComputingManager.getCallerByIdentifier(managerId, true);

      let templateQuery = `managers(filter: {${managerFlt}}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            templates(filter: ${templatesFlt}, limit: ${limit}, skip: ${skip}) {
              ${TEMPLATE_COLLECTION_HEADER}
              items {
                ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()}
              }
            }

          }
        }`;

        return query(`{
        data: ${endpointCaller} {
          id
          ${templateQuery}
        }
      }`).then(resultHandlerByPath('data.managers.items.0.templates'));
    });
  };

  const getManager = (endpointId, managerId) => {
    let endpointCaller = getCallerByIdentifier(endpointId);
    let managerFlt = SiteCloudComputingManager.getCallerByIdentifier(managerId, true);
    let managerQuery = `
      managers(filter: {${managerFlt}}, limit: 1, skip: 0) {
        items {
          ${TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_DETAILS_FIELDS()}
        }
      }
    `;

    return query(`{
      data: ${endpointCaller} {
        id
        ${managerQuery}
      }
    }`).then(resultHandlerByPath('data.managers.items.0'));
  }

  const getAllManagers = (endpointId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(managersFlt => {
      let endpointCaller = getCallerByIdentifier(endpointId);
      let managersQuery = `managers(filter: ${managersFlt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            ${TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS()}
          }
        }`;

      return query(`{
        data: ${endpointCaller} {
          id
          ${managersQuery}
        }
      }`).then(resultHandlerByPath('data.managers'));
    });
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingEndpointItem',
    description: '',
    graphQLType: 'SiteCloudComputingEndpoint',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingEndpointListResponse',
    wrapperOf: 'SiteCloudComputingEndpointItem'
  });
  const getAll = ({filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(flt => {
      return query(`
        {
          data: siteCloudComputingEndpoints(filter: ${flt}, limit: ${limit}, skip: ${skip}) {
            ${TEMPLATE_COLLECTION_HEADER}
            items {
              ${TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS()}
            }
          }
        }
      `);
    });
  };

  return  {
    getAll,
    getCallerByIdentifier,
    getByIdentifier,
    getFirst,
    getFiltered,
    getSite,
    getAllShares,
    getShare,
    getAllShareImages,
    getShareImage,
    getAllShareImageTemplates,
    getShareImageTemplate,
    getAllManagers,
    getManager,
    getAllManagerTemplates,
    getManagerTemplate,
    getAllImages,
    getImage,
    getAllImageTemplates,
    getImageTemplate,
    getAllTemplates,
    getTemplate,
    getAll
  };
}
SiteCloudComputingEndpoint.getCallerByIdentifier = getCallerByIdentifier;