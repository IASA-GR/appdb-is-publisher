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
import SiteCloudComputingImage from './SiteCloudComputingImage';


export const useRouter = (router, {openAPIDefinitions}) => {

  openAPIDefinitions.registerGetPath('/cloud/computing/images/{imageId}/templates/{templateId}',{
    "summary": "Template entry applicable to the specific cloud computing image.",
    "tags": ["SiteCloudComputingImage"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "imageId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      },
      {
        "in": "path",
        "name": "templateId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing template`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingTemplateItemResponse"})
    }
  });
  router.get(
    '/cloud/computing/images/:imageId/templates/:templateId',
    [ItemMetaData({ entityType: 'SiteCloudComputindTemplate' })],
    (req, res) => {
      let imageId = _.trim(req.params.imageId);
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingImage.getTemplate(imageId, templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/images/{imageId}/templates',{
    "summary": "A list of applicable templates for the specific cloud computing image",
    "tags": ["SiteCloudComputingImage"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "imageId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingTemplateListResponse"})
    }
  });
  router.get(
    '/cloud/computing/images/:imageId/templates',
    [ItemMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let imageId = _.trim(req.params.imageId);
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingImage.getAllTemplates(imageId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/images/{imageId}/manager',{
    "summary": "The manager entry related to the cloud computing image.",
    "tags": ["SiteCloudComputingImage"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "imageId",
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
    '/cloud/computing/images/:imageId/manager',
    [ItemMetaData({ entityType: 'SiteCloudComputingManager' })],
    (req, res) => {
      let imageId = _.trim(req.params.imageId);

      _handleRequest(SiteCloudComputingImage.getManager(imageId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/images/{imageId}/share',{
    "summary": "The share entry related to the cloud computing image.",
    "tags": ["SiteCloudComputingImage"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "imageId",
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
    '/cloud/computing/images/:imageId/share',
    [ItemMetaData({ entityType: 'SiteCloudComputingShare' })],
    (req, res) => {
      let imageId = _.trim(req.params.imageId);

      _handleRequest(SiteCloudComputingImage.getShare(imageId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/cloud/computing/images/{imageId}/endpoint",{
    "summary": "Returns the cloud computing endpoint that provides the sepecific VM image.",
    "tags": ["SiteCloudComputingImage"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "imageId",
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
    '/cloud/computing/images/:imageId/endpoint',
    [ItemMetaData({ entityType: 'SiteCloudComputingEndpoint' })],
    (req, res) => {
      let imageId = _.trim(req.params.imageId);

      _handleRequest(SiteCloudComputingImage.getEndpoint(imageId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/images/{imageId}/site',{
    "summary": "Returns information about the site that provides the specific cloud computing image.",
    "tags": ["SiteCloudComputingImage"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "imageId",
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
    '/cloud/computing/images/:imageId/site',
    [ItemMetaData({ entityType: 'Site' })],
    (req, res) => {
      let imageId = _.trim(req.params.imageId);

      _handleRequest(SiteCloudComputingImage.getSite(imageId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/cloud/computing/images/{imageId}", {
    "summary": "A VM image entry in the information system.",
    "tags": ["SiteCloudComputingImage"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "imageId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": '#/components/schemas/SiteCloudComputingImageItemResponse'})
    }
  });
  router.get(
    '/cloud/computing/images/:imageId',
    [ItemMetaData({ entityType: 'SiteCloudComputingImage' })],
    (req, res) => {
      let imageId = _.trim(req.params.imageId);

      _handleRequest(SiteCloudComputingImage.getByIdentifier(imageId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/cloud/computing/images", {
    "summary": "Return the list of available cloud computing images",
    "tags": ["SiteCloudComputingImage"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters(),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({
        "ref": '#/components/schemas/SiteCloudComputingImageListResponse',
      })
    }
  })
  router.get(
    '/cloud/computing/images',
    [CollectionMetaData({ entityType: 'SiteCloudComputingImage' })],
    (req, res) => {
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingImage.getAll(params), req, res);
    }
  );
}

export default {
  useRouter
}