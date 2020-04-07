import _ from 'lodash';
import {
  DEFAULT_LIMIT,
  RequestMetaData,
  CollectionMetaData,
  ItemMetaData,
  applyMetaData,
  _handleMissing,
  getInvalidFilterFromError,
  getGraphqlErrors,
  handleInvalidFilterError,
  handleUnknownFilter,
  handleInvalidGraphQLFilterError,
  handleGenericGraphQLError,
  _handleRequest,
  getCollectionRequestParams,
  getOpenAPIItemParameters,
  getOpenAPICollectionParameters,
  getOpenAPI200Response
} from '../httpUtils';
import SiteCloudComputingTemplate from './SiteCloudComputingTemplate';

export const useRouter = (router, {openAPIDefinitions}) => {

  openAPIDefinitions.registerGetPath('/cloud/computing/templates/{templateId}/images/{imageId}',{
    "summary": "The cloud computing image that the specific template applies to.",
    "tags": ["SiteCloudComputingTemplate"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "templateId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      },
      {
        "in": "path",
        "name": "imageId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing image`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingImageItemResponse"})
    }
  });
  router.get(
    '/cloud/computing/templates/:templateId/images/:imageId',
    [ItemMetaData({ entityType: 'SiteCloudComputindImage' })],
    (req, res) => {
      let imageId = _.trim(req.params.imageId);
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingTemplate.getImage(templateId, imageId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/templates/{templateId}/images',{
    "summary": "A list of images that the specific cloud computing template can be applied",
    "tags": ["SiteCloudComputingTemplate"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "templateId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingImageListResponse"})
    }
  }, {
    filter: {
      graphQLType: 'SiteCloudComputingImage_Filter'
    }
  });
  router.get(
    '/cloud/computing/templates/:templateId/images',
    [CollectionMetaData({ entityType: 'SiteCloudComputingImage' })],
    (req, res) => {
      let templateId = _.trim(req.params.templateId);
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingTemplate.getAllImages(templateId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/templates/{templateId}/manager',{
    "summary": "The manager entry managing the specific cloud computing template.",
    "tags": ["SiteCloudComputingTemplate"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "templateId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingManagerItemResponse"})
    }
  });
  router.get(
    '/cloud/computing/templates/:templateId/manager',
    [ItemMetaData({ entityType: 'SiteCloudComputingManager' })],
    (req, res) => {
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingTemplate.getManager(templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/templates/{templateId}/share',{
    "summary": "The share entry related to the cloud computing template.",
    "tags": ["SiteCloudComputingTemplate"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "templateId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingShareItemResponse"})
    }
  });
  router.get(
    '/cloud/computing/templates/:templateId/share',
    [ItemMetaData({ entityType: 'SiteCloudComputingShare' })],
    (req, res) => {
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingTemplate.getShare(templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/cloud/computing/templates/{templateId}/endpoint",{
    "summary": "Returns the cloud computing endpoint that provides the sepecific template.",
    "tags": ["SiteCloudComputingTemplate"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "templateId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": '#/components/schemas/SiteCloudComputingEndpointItemResponse'})
    }
  });
  router.get(
    '/cloud/computing/templates/:templateId/endpoint',
    [ItemMetaData({ entityType: 'SiteCloudComputingEndpoint' })],
    (req, res) => {
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingTemplate.getEndpoint(templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/templates/{templateId}/site',{
    "summary": "Returns information about the site that provides the specific cloud computing template.",
    "tags": ["SiteCloudComputingTemplate"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "templateId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteItemResponse"})
    }
  });
  router.get(
    '/cloud/computing/templates/:templateId/site',
    [ItemMetaData({ entityType: 'Site' })],
    (req, res) => {
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingTemplate.getSite(templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/cloud/computing/templates/{templateId}", {
    "summary": "The template entry in the information system.",
    "tags": ["SiteCloudComputingTemplate"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "templateId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": '#/components/schemas/SiteCloudComputingTemplateItemResponse'})
    }
  });
  router.get(
    '/cloud/computing/templates/:templateId',
    [ItemMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingTemplate.getByIdentifier(templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/cloud/computing/templates", {
    "summary": "Return the list of available cloud computing templates",
    "tags": ["SiteCloudComputingTemplate"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters(),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({
        "ref": '#/components/schemas/SiteCloudComputingTemplateListResponse',
      })
    }
  }, {
    filter: {
      graphQLType: 'SiteCloudComputingTemplate_Filter'
    }
  })
  router.get(
    '/cloud/computing/templates',
    [CollectionMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingTemplate.getAll(params), req, res);
    }
  );
}

export default {
  useRouter
}