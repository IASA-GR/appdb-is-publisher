import _ from 'lodash';
import {query, TEMPLATE_COLLECTION_HEADER} from '../restModel';
import {asyncFilterToGraphQL,resultHandlerByPath} from '../utils';
import SiteCloudComputingImage, {TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_COLLECTION_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS} from './SiteCloudComputingImage';
import SiteCloudComputingEndpoint, { TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_COLLECTION_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS} from './SiteCloudComputingEndpoint';
import SiteCloudComputingTemplate, { TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_COLLECTION_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS } from './SiteCloudComputingTemplate';
import SiteCloudComputingShare, { TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_DETAILS_FIELDS } from './SiteCloudComputingShare';
import SiteCloudComputingManager, { TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_COLLECTION_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_DETAILS_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS } from './SiteCloudComputingManager';


export const TEMPLATE_SITE_ITEM_FIELDS = () => `
id
pkey
name
shortName
officialName
description
gocdbPortalUrl
homeUrl
giisUrl
countryCode
country
tier
subgrid
roc
prodInfrastructure
certStatus
timezone
latitude
longitude
domainName
`;

export const TEMPLATE_SITE_DETAILS_FIELDS =  () => `
${TEMPLATE_SITE_ITEM_FIELDS()}
serviceStatuses {
  id
  type
  endpointGroup
  value
  timestamp
  endpoint {
    id
    endpointPKey
    endpointURL
  }
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
  endpoint {
    id
    endpointPKey
    endpointURL
  }
}
cloudComputingServices(skip: 0, limit: 100000) {
  totalCount
  items {
    id
    entityName
    entityCreationTime
    entityValidity
    entityOtherInfo
    serviceID
    qualityLevel
    statusInfo
    serviceType
    serviceAdminDomainForeignKey
    capabilities
    complexity
    AUP
    totalVM
    haltedVM
    runningVM
    suspendedVM
  }
}
cloudComputingEndpoints(skip: 0, limit: 100000) {
  totalCount
  items {
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
  }
}`;

export const getCallerByIdentifier = (id, onlyQuery = false) => {
  if (id.indexOf('gocdb:') === 0) {
    id = id.replace('gocdb:', '');

    if (onlyQuery) {
      return `pkey: "${id}"`;
    } else {
      return `siteByGocDBPKey(id: "${id}")`;
    }

  } else if (id.indexOf('name:') === 0) {
    id = id.replace('name:', '');

    if (onlyQuery) {
      return `name: {eq: "${id}"}`;
    }else {
      return `siteByName(name: "${id}")`;
    }
  } else {
    if (onlyQuery) {
      return `id: {eq: "${id}"}`;
    }else {
      return `siteById(id: "${id}")`;
    }
  }
};

export default function Site({openAPIDefinitions}) {

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteDetails',
    description: '',
    graphQLType: 'Site',
    graphQLFields: TEMPLATE_SITE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteItemResponse',
    wrapperOf: 'SiteDetails'
  });
  const getByIdentifier = (id) => {
    let caller = getCallerByIdentifier(id);
    return query(`{
      data: ${caller} {
        ${TEMPLATE_SITE_DETAILS_FIELDS()}
      }
    }`);
  }

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteItem',
    description: '',
    graphQLType: 'Site',
    graphQLFields: TEMPLATE_SITE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteListResponse',
    wrapperOf: 'SiteItem'
  });
  const getAll = ({filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(flt => {
      return query(`
        {
          data: sites(filter: ${flt}, limit: ${limit}, skip: ${skip}) {
            totalCount
            count
            limit
            skip
            items {
              ${TEMPLATE_SITE_ITEM_FIELDS()}
            }
          }
        }
      `);
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
  const getAllSiteCloudComputingEndpoints = (siteId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(flt => {
      let siteCaller = getCallerByIdentifier(siteId);
      let endpointsQuery = `
        cloudComputingEndpoints(filter: ${flt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            ${TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS()}
          }
        }`;
      return query(`{
        data: ${siteCaller} {
          id
          ${endpointsQuery}
        }
      }`).then(doc => {
        return Promise.resolve(_.get(doc, 'data.cloudComputingEndpoints', doc));
      });
    });
  };

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
  const getSiteCloudComputingEndpoint = (siteId, endpointId) => {
    let siteCaller = getCallerByIdentifier(siteId);
    let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
    let endpointsQuery = `
      cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
        items {
          ${TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS()}
        }
      }`;
    return query(`{
      data: ${siteCaller} {
        id
        ${endpointsQuery}
      }
    }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0'));
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingTemplateItem',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingTemplateListResponse',
    wrapperOf: 'SiteCloudComputingTemplateItem'
  });
  const getAllSiteCloudComputingEndpointTemplates = (siteId, endpointId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(templatesFlt => {
      let siteCaller = getCallerByIdentifier(siteId);
      let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
      let templatesQuery = `templates(filter: ${templatesFlt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_COLLECTION_FIELDS()}
        }`;
      let endpointsQuery = `
        cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            id
            ${templatesQuery}
          }
        }`;

      return query(`{
        data: ${siteCaller} {
          id
          ${endpointsQuery}
        }
      }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.templates'));
    });
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingTemplateDetails',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingTemplateItemResponse',
    wrapperOf: 'SiteCloudComputingTemplateDetails'
  });
  const getSiteCloudComputingEndpointTemplate = (siteId, endpointId, templateId) => {
    let siteFlt = getCallerByIdentifier(siteId, true);
    let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
    let templateFlt = SiteCloudComputingTemplate.getCallerByIdentifier(templateId, true);

    return SiteCloudComputingTemplate.getFirst(`{site: {${siteFlt}}, endpoint: {${endpointFlt}}, ${templateFlt}}`);
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingImageItem',
    description: '',
    graphQLType: 'SiteCloudComputingImage',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingImageListResponse',
    wrapperOf: 'SiteCloudComputingImageItem'
  });
  const getAllSiteCloudComputingEndpointImages = (siteId, endpointId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(imagesFlt => {
      let siteCaller = getCallerByIdentifier(siteId);
      let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
      let imagesQuery = `images(filter: ${imagesFlt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_COLLECTION_FIELDS()}
        }`;
      let endpointsQuery = `
        cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            id
            ${imagesQuery}
          }
        }`;

      return query(`{
        data: ${siteCaller} {
          id
          ${endpointsQuery}
        }
      }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.images'));
    });
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingImageDetails',
    description: '',
    graphQLType: 'SiteCloudComputingImage',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingImageItemResponse',
    wrapperOf: 'SiteCloudComputingImageDetails'
  });
  const getSiteCloudComputingEndpointImage = (siteId, endpointId, imageId) => {
    let siteCaller = getCallerByIdentifier(siteId);
    let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
    let imageFlt = SiteCloudComputingImage.getCallerByIdentifier(imageId, true);

    let imageQuery = `
      cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
        items {
          images(filter: {${imageFlt}}, limit: 1, skip: 0) {
            items {
              ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS()}
            }
          }
        }
      }`;

    return query(`{
      data: ${siteCaller} {
        id
        ${imageQuery}
      }
    }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.images.items.0'));
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingManagerItem',
    description: '',
    graphQLType: 'SiteCloudComputingManager',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingManagerListResponse',
    wrapperOf: 'SiteCloudComputingManagerItem'
  });
  const getAllSiteCloudComputingEndpointManagers = (siteId, endpointId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(managersFlt => {
      let siteCaller = getCallerByIdentifier(siteId);
      let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
      let managersQuery = `managers(filter: ${managersFlt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          ${TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_COLLECTION_FIELDS()}
        }`;
      let endpointsQuery = `
        cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            id
            ${managersQuery}
          }
        }`;

      return query(`{
        data: ${siteCaller} {
          id
          ${endpointsQuery}
        }
      }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.managers'));
    });
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingManagerTemplateDetails',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingManagerTemplateItemResponse',
    wrapperOf: 'SiteCloudComputingManagerTemplateDetails'
  });
  const getSiteCloudComputingEndpointManagerTemplate = (siteId, endpointId, managerId, templateId) => {
    let siteCaller = getCallerByIdentifier(siteId);
    let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
    let managerFlt = SiteCloudComputingManager.getCallerByIdentifier(managerId, true);
    let templateFlt = SiteCloudComputingManager.getCallerByIdentifier(templateId, true);
    let managerQuery = `
      cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
        items {
          managers(filter: {${managerFlt}}, limit: 1, skip: 0) {
            items {
              templates(filter: {${templateFlt}}, limit: 1, skip: 0) {
                items {
                  ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS()}
                }
              }
            }
          }
        }
      }`;

    return query(`{
      data: ${siteCaller} {
        id
        ${managerQuery}
      }
    }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.managers.items.0.templates.items.0'));
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingManagerTemplateItem',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingManagerTemplateListResponse',
    wrapperOf: 'SiteCloudComputingManagerTemplateItem'
  });
  const getAllSiteCloudComputingEndpointManagerTemplates = (siteId, endpointId, managerId) => {
    let siteCaller = getCallerByIdentifier(siteId);
    let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
    let managerFlt = SiteCloudComputingManager.getCallerByIdentifier(managerId, true);

    let managerQuery = `
      cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
        items {
          managers(filter: {${managerFlt}}, limit: 1, skip: 0) {
            items {
              templates {
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
      data: ${siteCaller} {
        id
        ${managerQuery}
      }
    }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.managers.items.0.templates'));
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingManagerDetails',
    description: '',
    graphQLType: 'SiteCloudComputingManager',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingManagerItemResponse',
    wrapperOf: 'SiteCloudComputingManagerDetails'
  });
  const getSiteCloudComputingEndpointManager = (siteId, endpointId, managerId) => {
    let siteCaller = getCallerByIdentifier(siteId);
    let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
    let managerFlt = SiteCloudComputingManager.getCallerByIdentifier(managerId, true);

    let managerQuery = `
      cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
        items {
          managers(filter: {${managerFlt}}, limit: 1, skip: 0) {
            items {
              ${TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_DETAILS_FIELDS()}
            }
          }
        }
      }`;

    return query(`{
      data: ${siteCaller} {
        id
        ${managerQuery}
      }
    }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.managers.items.0'));
  };


  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingShareItem',
    description: '',
    graphQLType: 'SiteCloudComputingShare',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingShareListResponse',
    wrapperOf: 'SiteCloudComputingShareItem'
  });
  const getAllSiteCloudComputingEndpointShares = (siteId, endpointId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(sharesFlt => {
      let siteCaller = getCallerByIdentifier(siteId);
      let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
      let sharesQuery = `shares(filter: ${sharesFlt}, limit: ${limit}, skip: ${skip}) {
          ${TEMPLATE_COLLECTION_HEADER}
          items {
            ${TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS()}
          }
        }`;
      let endpointsQuery = `
        cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
          items {
            id
            ${sharesQuery}
          }
        }`;

      return query(`{
        data: ${siteCaller} {
          id
          ${endpointsQuery}
        }
      }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.shares'));
    });
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingShareDetails',
    description: '',
    graphQLType: 'SiteCloudComputingShare',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingShareItemResponse',
    wrapperOf: 'SiteCloudComputingShareDetails'
  });
  const getSiteCloudComputingEndpointShare = (siteId, endpointId, shareId) => {
    let siteCaller = getCallerByIdentifier(siteId);
    let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
    let shareFlt = SiteCloudComputingShare.getCallerByIdentifier(shareId, true);
    let shareQuery = `
      cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
        items {
          shares(filter: {${shareFlt}}, limit: 1, skip: 0) {
            items {
              ${TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_DETAILS_FIELDS()}
            }
          }
        }
      }`;

    return query(`{
      data: ${siteCaller} {
        id
        ${shareQuery}
      }
    }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.shares.items.0'));
  };


  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingImageItem',
    description: '',
    graphQLType: 'SiteCloudComputingImage',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingImageListResponse',
    wrapperOf: 'SiteCloudComputingImageItem'
  });
  const getAllSiteCloudComputingEndpointShareImages = (siteId, endpointId, shareId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(imagesFlt => {
      let siteCaller = getCallerByIdentifier(siteId);
      let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
      let shareFlt = SiteCloudComputingShare.getCallerByIdentifier(shareId, true);
      let imagesQuery = `
        cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
          items {
            id
            shares(filter: {${shareFlt}}, limit: 1, skip: 0) {
              items {
                shareID
                images(filter: ${imagesFlt}, limit: ${limit}, skip: ${skip}) {
                  ${TEMPLATE_COLLECTION_HEADER}
                  ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_COLLECTION_FIELDS()}
                }
              }
            }
          }
        }`;

      return query(`{
        data: ${siteCaller} {
          id
          ${imagesQuery}
        }
      }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.shares.items.0.images'));
    });
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingImageDetails',
    description: '',
    graphQLType: 'SiteCloudComputingImage',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingImageItemResponse',
    wrapperOf: 'SiteCloudComputingImageDetails'
  });
  const getSiteCloudComputingEndpointShareImage = (siteId, endpointId, shareId, imageId) => {
    let siteCaller = getCallerByIdentifier(siteId);
    let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
    let shareFlt = SiteCloudComputingShare.getCallerByIdentifier(shareId, true);
    let imageFlt = SiteCloudComputingImage.getCallerByIdentifier(imageId, true);

    let imageQuery = `
      cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
        items {
          id
          shares(filter: {${shareFlt}}, limit: 1, skip: 0) {
            items {
              id
              images(filter: {${imageFlt}}, limit: 1, skip: 0) {
                items {
                  ${TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS()}
                }
              }
            }
          }
        }
      }`;

    return query(`{
      data: ${siteCaller} {
        id
        ${imageQuery}
      }
    }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.shares.items.0.images.items.0'));
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingTemplateItem',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingTemplateListResponse',
    wrapperOf: 'SiteCloudComputingTemplateItem'
  });
  const getAllSiteCloudComputingEndpointShareImageTemplates = (siteId, endpointId, shareId, imageId, {filter = {}, limit = 0, skip = 0} = {filter:{}, limit: 0, skip: 0}) => {
    return asyncFilterToGraphQL(filter).then(templatesFlt => {
      let siteCaller = getCallerByIdentifier(siteId);
      let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
      let shareFlt = SiteCloudComputingShare.getCallerByIdentifier(shareId, true);
      let imageFlt = SiteCloudComputingImage.getCallerByIdentifier(imageId, true);
      let templatesQuery = `
        cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
          items {
            id
            shares(filter: {${shareFlt}}, limit: 1, skip: 0) {
              items {
                images(filter: {${imageFlt}}, limit: 1, skip: 0) {
                  items {
                    templates(filter: ${templatesFlt}, limit: ${limit}, skip: ${skip}) {
                      ${TEMPLATE_COLLECTION_HEADER}
                      ${TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_COLLECTION_FIELDS()}
                    }
                  }
                }
              }
            }
          }
        }`;

      return query(`{
        data: ${siteCaller} {
          id
          ${templatesQuery}
        }
      }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.shares.items.0.images.items.0.templates'));
    });
  };

  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingTemplateDetails',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingTemplateItemResponse',
    wrapperOf: 'SiteCloudComputingTemplateDetails'
  });
  const getSiteCloudComputingEndpointShareImageTemplate = (siteId, endpointId, shareId, imageId, templateId) => {
    let siteCaller = getCallerByIdentifier(siteId);
    let endpointFlt = SiteCloudComputingEndpoint.getCallerByIdentifier(endpointId, true);
    let shareFlt = SiteCloudComputingShare.getCallerByIdentifier(shareId, true);
    let imageFlt = SiteCloudComputingImage.getCallerByIdentifier(imageId, true);
    let templateFlt = SiteCloudComputingTemplate.getCallerByIdentifier(templateId, true);
    let templateQuery = `
      cloudComputingEndpoints(filter: {${endpointFlt}}, limit: 1, skip: 0) {
        items {
          id
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
        }
      }`;

    return query(`{
      data: ${siteCaller} {
        id
        ${templateQuery}
      }
    }`).then(resultHandlerByPath('data.cloudComputingEndpoints.items.0.shares.items.0.images.items.0.templates.items.0'));

  };

  return {
    getAll,
    getByIdentifier,
    getAllSiteCloudComputingEndpoints,
    getSiteCloudComputingEndpoint,
    getAllSiteCloudComputingEndpointTemplates,
    getSiteCloudComputingEndpointTemplate,
    getAllSiteCloudComputingEndpointImages,
    getSiteCloudComputingEndpointImage,
    getAllSiteCloudComputingEndpointManagers,
    getSiteCloudComputingEndpointManager,
    getAllSiteCloudComputingEndpointManagerTemplates,
    getSiteCloudComputingEndpointManagerTemplate,
    getAllSiteCloudComputingEndpointShares,
    getSiteCloudComputingEndpointShare,
    getAllSiteCloudComputingEndpointShareImages,
    getSiteCloudComputingEndpointShareImage,
    getAllSiteCloudComputingEndpointShareImageTemplates,
    getSiteCloudComputingEndpointShareImageTemplate
  };
}
const getItemResponseType = (entityName, component) => {
  return {
    "type": "object",
    "properties": {
      "entityType": {
        "type": "string",
        "description": "The entity type wrapped in the data section. Eg Site, SiteCloudComputingEndpoint etc"
      },
      "dataType": {
        "type": "string",
        "enum": ["item", "collection"],
        "description": "Indicates if the data section is a collection of entities or a single entity"
      },
      "httpStatus": {
        "type": "integer",
        "default": 200,
        "description": "The returning HTTP status of the response"
      },
      "data": {
        "type": "object",
        "$ref": "#/components/schemas/" + component
      }
    }
  }
};

const getCollectionResponseType = (entityName, component) => {
  return {
    "type": "object",
    "properties": {
      "entityType": {
        "type": "string",
        "description": "The entity type wrapped in the data section. Eg Site, SiteCloudComputingEndpoint etc"
      },
      "dataType": {
        "type": "string",
        "enum": ["item", "collection"],
        "description": "Indicates if the data section is a collection of entities or a single entity"
      },
      "httpStatus": {
        "type": "integer",
        "default": 200,
        "description": "The returning HTTP status of the response"
      },
      "totalCount": {
        "type": "integer",
        "description": "The total entries of items in the backend"
      },
      "count": {
        "type": "integer",
        "description": "The number of entries in the response"
      },
      "limit": {
        "type": "integer",
        "description": "The requested maximum number of entries to return in this request"
      },
      "skip": {
        "type": "integer",
        "description": "The requested number of items to skip before returning the results."
      },
      "data": {
        "type": "array",
        "description": "An array of items of the " + entityName + " type",
        "items": {
          "$ref": "#/components/schemas/" + component
        }
      }
    }
  }
};

export const getSwaggerComponents = () => {
  let Site = {
    "type": "object",
    "properties": {
      "id": {
        "type": "string"
      },
      "pkey": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "shortName": {
        "type": "string"
      },
      "officialName": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "gocdbPortalUrl": {
        "type": "string"
      },
      "homeUrl": {
        "type": "string"
      },
      "giisUrl": {
        "type": "string"
      },
      "countryCode": {
        "type": "string"
      },
      "country": {
        "type": "string"
      },
      "tier": {
        "type": "string"
      },
      "subgrid": {
        "type": "string"
      },
      "roc": {
        "type": "string"
      },
      "prodInfrastructure": {
        "type": "string"
      },
      "certStatus": {
        "type": "string"
      },
      "timezone": {
        "type": "string"
      },
      "latitude": {
        "type": "string"
      },
      "longitude": {
        "type": "string"
      },
      "domainName": {
        "type": "string"
      }
    }
  };

  return {
    "SiteItem": Site,
    "SiteDetails": Object.assign({}, {"type": "object", "properties": Object.assign({}, Site.properties)}),
    "SiteCollection": getCollectionResponseType("Site", "SiteItem"),
    "Site" : getItemResponseType("Site", "SiteDetails")
  }
}
