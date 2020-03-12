import {TEMPLATE_SITE_DETAILS_FIELDS, TEMPLATE_SITE_ITEM_FIELDS} from './Site'
import {TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS} from './SiteCloudComputingEndpoint';
import {TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS} from './SiteCloudComputingImage';
import {TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS} from './SiteCloudComputingTemplate';
import {TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS, TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_DETAILS_FIELDS} from './SiteCloudComputingShare';
import {TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS} from './SiteCloudComputingManager';

export default function OpenAPILoadComponentDefinitions({openAPIDefinitions}) {
  openAPIDefinitions.registerComponentFromGraphQLQuery({
    name: 'SiteDetails',
    description: '',
    graphQLType: 'Site',
    graphQLFields: TEMPLATE_SITE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteItemResponse',
    wrapperOf: 'SiteDetails'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteItem',
    description: '',
    graphQLType: 'Site',
    graphQLFields: TEMPLATE_SITE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteListResponse',
    wrapperOf: 'SiteItem'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingEndpointItem',
    description: '',
    graphQLType: 'SiteCloudComputingEndpoint',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingEndpointListResponse',
    wrapperOf: 'SiteCloudComputingEndpointItem'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingEndpointDetails',
    description: '',
    graphQLType: 'SiteCloudComputingEndpoint',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_ENDPOINT_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingEndpointItemResponse',
    wrapperOf: 'SiteCloudComputingEndpointDetails'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingTemplateItem',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingTemplateListResponse',
    wrapperOf: 'SiteCloudComputingTemplateItem'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingTemplateDetails',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingTemplateItemResponse',
    wrapperOf: 'SiteCloudComputingTemplateDetails'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingImageItem',
    description: '',
    graphQLType: 'SiteCloudComputingImage',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingImageListResponse',
    wrapperOf: 'SiteCloudComputingImageItem'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingImageDetails',
    description: '',
    graphQLType: 'SiteCloudComputingImage',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingImageItemResponse',
    wrapperOf: 'SiteCloudComputingImageDetails'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingManagerItem',
    description: '',
    graphQLType: 'SiteCloudComputingManager',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingManagerListResponse',
    wrapperOf: 'SiteCloudComputingManagerItem'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingTemplateDetails',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingTemplateItemResponse',
    wrapperOf: 'SiteCloudComputingTemplateDetails'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingTemplateItem',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingTemplateListResponse',
    wrapperOf: 'SiteCloudComputingTemplateItem'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingManagerDetails',
    description: '',
    graphQLType: 'SiteCloudComputingManager',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_MANAGER_ITEM_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingManagerItemResponse',
    wrapperOf: 'SiteCloudComputingManagerDetails'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingShareItem',
    description: '',
    graphQLType: 'SiteCloudComputingShare',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingShareListResponse',
    wrapperOf: 'SiteCloudComputingShareItem'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingShareDetails',
    description: '',
    graphQLType: 'SiteCloudComputingShare',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_SHARE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingShareItemResponse',
    wrapperOf: 'SiteCloudComputingShareDetails'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingImageItem',
    description: '',
    graphQLType: 'SiteCloudComputingImage',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingImageListResponse',
    wrapperOf: 'SiteCloudComputingImageItem'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingImageDetails',
    description: '',
    graphQLType: 'SiteCloudComputingImage',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_IMAGE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingImageItemResponse',
    wrapperOf: 'SiteCloudComputingImageDetails'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingTemplateItem',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_ITEM_FIELDS()
  })
  .registerCollectionWrapperComponent({
    name: 'SiteCloudComputingTemplateListResponse',
    wrapperOf: 'SiteCloudComputingTemplateItem'
  })
  .registerComponentFromGraphQLQuery({
    name: 'SiteCloudComputingTemplateDetails',
    description: '',
    graphQLType: 'SiteCloudComputingTemplate',
    graphQLFields: TEMPLATE_SITE_CLOUD_COMPUTING_TEMPLATE_DETAILS_FIELDS()
  })
  .registerItemWrapperComponent({
    name: 'SiteCloudComputingTemplateItemResponse',
    wrapperOf: 'SiteCloudComputingTemplateDetails'
  });
}