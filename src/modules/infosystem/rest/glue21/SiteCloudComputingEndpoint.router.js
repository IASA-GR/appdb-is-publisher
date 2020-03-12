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
import SiteCloudComputingEndpoint from './SiteCloudComputingEndpoint';

export const useRouter = (router, {openAPIDefinitions}) => {

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/shares/{shareId}/images/{imageId}/templates/{templateId}',{
    "summary": "An image entry provided under the specific share entry of the current cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "shareId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing share`
      },
      {
        "in": "path",
        "name": "imageId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing image`
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
    '/cloud/computing/endpoints/:endpointId/shares/:shareId/images/:imageId/templates/:templateId',
    [ItemMetaData({ entityType: 'SiteCloudComputindTemplate' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let shareId = _.trim(req.params.shareId);
      let imageId = _.trim(req.params.imageId);
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingEndpoint.getShareImageTemplate(endpointId, shareId, imageId, templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/shares/{shareId}/images/{imageId}/templates',{
    "summary": "A list of applicable templates to the given VM image under the given share provided by the cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "shareId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing share`
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
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingTemplateListResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/shares/:shareId/images/:imageId/templates',
    [ItemMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let shareId = _.trim(req.params.shareId);
      let imageId = _.trim(req.params.imageId);
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingEndpoint.getAllShareImageTemplates(endpointId, shareId, imageId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/shares/{shareId}/images/{imageId}',{
    "summary": "An image entry provided under the specific share entry of the current cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "shareId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing share`
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
    '/cloud/computing/endpoints/:endpointId/shares/:shareId/images/:imageId',
    [ItemMetaData({ entityType: 'SiteCloudComputindImage' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let shareId = _.trim(req.params.shareId);
      let imageId = _.trim(req.params.imageId);

      _handleRequest(SiteCloudComputingEndpoint.getShareImage(endpointId, shareId, imageId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/shares/{shareId}/images',{
    "summary": "A list of images provided under the specific share entry of the current cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "shareId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing share`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingImageListResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/shares/:shareId/images',
    [ItemMetaData({ entityType: 'SiteCloudComputingImage' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let shareId = _.trim(req.params.shareId);
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingEndpoint.getAllShareImages(endpointId, shareId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/shares/{shareId}',{
    "summary": "A share entry provided by the cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "shareId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing share`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingShareItemResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/shares/:shareId',
    [ItemMetaData({ entityType: 'SiteCloudComputingShare' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let shareId = _.trim(req.params.shareId);

      _handleRequest(SiteCloudComputingEndpoint.getShare(endpointId, shareId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/shares',{
    "summary": "List of shares supported by the current cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingShareListResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/shares',
    [ItemMetaData({ entityType: 'SiteCloudComputingShare' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingEndpoint.getAllShares(endpointId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/managers/{managerId}/templates/{templateId}',{
    "summary": "A template details managed from the given manager provided by the cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "managerId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing manager`
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
    '/cloud/computing/endpoints/:endpointId/managers/:managerId/templates/:templateId',
    [ItemMetaData({ entityType: 'SiteCloudComputingManager' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let managerId = _.trim(req.params.managerId);
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingEndpoint.getManagerTemplate(endpointId, managerId, templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/managers/{managerId}/templates',{
    "summary": "A list of templates managed from the given manager provided by the cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "managerId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing manager`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingTemplateListResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/managers/:managerId/templates',
    [ItemMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let managerId = _.trim(req.params.managerId);
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingEndpoint.getAllManagerTemplates(endpointId, managerId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/managers/{managerId}',{
    "summary": "A manager entry provided by the cloud computing endpoint. Can be retrieved by the information system ID.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "managerId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing manager`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingManagerItemResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/managers/:managerId',
    [ItemMetaData({ entityType: 'SiteCloudComputingManager' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let managerId = _.trim(req.params.managerId);

      _handleRequest(SiteCloudComputingEndpoint.getManager(endpointId, managerId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/managers',{
    "summary": "List of managers supported by the current cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingManagerListResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/managers',
    [ItemMetaData({ entityType: 'SiteCloudComputingManager' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingEndpoint.getAllManagers(endpointId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/templates/{templateId}',{
    "summary": "Return a template entry of a specific cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "templateId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the template`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingTemplateItemResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/templates/:templateId',
    [ItemMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingEndpoint.getTemplate(endpointId, templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/templates',{
    "summary": "List of templates provided by the current cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingTemplateListResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/templates',
    [CollectionMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingEndpoint.getAllTemplates(endpointId, params), req, res);
    }
  );

    openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/images/{imageId}/templates/{templateId}',{
    "summary": "An applicable template entry for the specific VM image provided from the current cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "imageId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the cloud computing image`
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
    '/cloud/computing/endpoints/:endpointId/images/:imageId/templates/:templateId',
    [ItemMetaData({ entityType: 'SiteCloudComputindTemplate' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let imageId = _.trim(req.params.imageId);
      let templateId = _.trim(req.params.templateId);

      _handleRequest(SiteCloudComputingEndpoint.getImageTemplate(endpointId, imageId, templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/images/{imageId}/templates',{
    "summary": "A list of applicable templates for the given VM image from the cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
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
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingTemplateListResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/images/:imageId/templates',
    [ItemMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let imageId = _.trim(req.params.imageId);
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingEndpoint.getAllImageTemplates(endpointId, imageId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/images/{imageId}',{
    "summary": "A VM image entry in the information system.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },

      {
        "in": "path",
        "name": "imageId",
        "required": true,
        "type": "string",
        "description": `The information system ID of the VM Image`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingImageItemResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/images/:imageId',
    [ItemMetaData({ entityType: 'SiteCloudComputingImage' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let imageId = _.trim(req.params.imageId);

      _handleRequest(SiteCloudComputingEndpoint.getImage(endpointId, imageId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/images',{
    "summary": "List of VM images provided by the current cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingImageListResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/images',
    [CollectionMetaData({ entityType: 'SiteCloudComputingImage' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingEndpoint.getAllImages(endpointId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/site',{
    "summary": "Returns information about the site that provides the specific cloud computing endpoint.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the pkey as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteItemResponse"})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId/site',
    [ItemMetaData({ entityType: 'Site' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);

      _handleRequest(SiteCloudComputingEndpoint.getSite(endpointId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/cloud/computing/endpoints/{endpointId}", {
    "summary": "Returns specific cloud computing endpoint information.",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the pkey as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": '#/components/schemas/SiteCloudComputingEndpointItemResponse'})
    }
  });
  router.get(
    '/cloud/computing/endpoints/:endpointId',
    [ItemMetaData({ entityType: 'SiteCloudComputingEndpoint' })],
    (req, res) => {
      let endpointId = _.trim(req.params.endpointId);

      _handleRequest(SiteCloudComputingEndpoint.getByIdentifier(endpointId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/cloud/computing/endpoints", {
    "summary": "Return the list of available cloud computing endpoints",
    "tags": ["SiteCloudComputingEndpoint"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters(),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({
        "ref": '#/components/schemas/SiteCloudComputingEndpointListResponse',
      })
    }
  })
  router.get(
    '/cloud/computing/endpoints',
    [CollectionMetaData({ entityType: 'SiteCloudComputingEndpoint' })],
    (req, res) => {
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteCloudComputingEndpoint.getAll(params), req, res);
    }
  );
}

export default {
  useRouter
}