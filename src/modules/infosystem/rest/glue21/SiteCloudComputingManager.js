import { TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_COLLECTION_FIELDS } from "./SiteCloudComputingTemplate";

export const TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS = () => `
id
endpointPKey
serviceID
managerID
cloudComputingServiceForeignKey
entityName
entityCreationTime
entityValidity
entityOtherInfo
productName
productVersion
hypervisorName
hypervisorVersion
totalCPUs
totalRAM
instanceMaxCPU
instanceMinCPU
instanceMaxRAM
instanceMinRAM
instanceMaxDedicatedRAM
instanceMinDedicatedRAM
networkVirtualizationType
CPUVirtualizationType
virtualdiskFormats
failover
liveMigration
VMBackupRestore
`;

export const TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_DETAILS_FIELDS = () => `
  ${TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS()}
`;

export const TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_COLLECTION_FIELDS = () => `
items {
  ${TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS()}
}
`;

export const GRAPHQL_COLLECTION_ENDPOINT = 'siteCloudComputingManagers';
export const GRAPHQL_COLLECTION_DETAILS_FIELDS = () => TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_DETAILS_FIELDS();
export const GRAPHQL_COLLECTION_ITEM_FIELDS = () => TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS();

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
    return `siteCloudComputingManagerById(id: "${id}")`;
  }
};

export default {
  getCallerByIdentifier,
  getFirst,
  getFiltered
};