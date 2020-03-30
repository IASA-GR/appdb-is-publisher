import _ from 'lodash';
import {
  DEFAULT_LIMIT,
  RequestMetaData,
  CollectionMetaData,
  ListMetaData,
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
import Site from './Site';

export const useRouter = (router, {openAPIDefinitions}) => {

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/shares/{shareId}/images/{imageId}/templates/{templateId}',{
    "summary": "An applicable template entry to the given VM imageunder the given share entry provided by the cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/shares/:shareId/images/:imageId/templates/:templateId',
    [ItemMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let shareId = _.trim(req.params.shareId);
      let imageId = _.trim(req.params.imageId);
      let templateId = _.trim(req.params.templateId);

      _handleRequest(Site.getSiteCloudComputingEndpointShareImageTemplate(siteId, endpointId, shareId, imageId, templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/shares/{shareId}/images/{imageId}/templates',{
    "summary": "A list of applicable templates to the given VM image under the given share provided by the cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/shares/:shareId/images/:imageId/templates',
    [CollectionMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let shareId = _.trim(req.params.shareId);
      let imageId = _.trim(req.params.imageId);
      let params = getCollectionRequestParams(req);

      _handleRequest(Site.getAllSiteCloudComputingEndpointShareImageTemplates(siteId, endpointId, shareId, imageId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/shares/{shareId}/images/{imageId}',{
    "summary": "An image entry provided under the specific share entry of the current cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/shares/:shareId/images/:imageId',
    [ItemMetaData({ entityType: 'SiteCloudComputingImage' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let shareId = _.trim(req.params.shareId);
      let imageId = _.trim(req.params.imageId);

      _handleRequest(Site.getSiteCloudComputingEndpointShareImage(siteId, endpointId, shareId, imageId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/shares/{shareId}/images',{
    "summary": "A list of images provided under the specific share entry of the current cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/shares/:shareId/images',
    [CollectionMetaData({ entityType: 'SiteCloudComputingImage' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let shareId = _.trim(req.params.shareId);
      let params = getCollectionRequestParams(req);

      _handleRequest(Site.getAllSiteCloudComputingEndpointShareImages(siteId, endpointId, shareId, params), req, res);
    }
    );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/shares/{shareId}',{
    "summary": "A share entry provided by the cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/shares/:shareId',
    [ItemMetaData({ entityType: 'SiteCloudComputingShare' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let shareId = _.trim(req.params.shareId);

      _handleRequest(Site.getSiteCloudComputingEndpointShare(siteId, endpointId, shareId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/shares',{
    "summary": "List of shares supported by the current cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/shares',
    [CollectionMetaData({ entityType: 'SiteCloudComputingShare' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let params = getCollectionRequestParams(req);

      _handleRequest(Site.getAllSiteCloudComputingEndpointShares(siteId, endpointId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/managers/{managerId}/templates/{templateId}',{
    "summary": "A template details managed from the given manager provided by the cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/managers/:managerId/templates/:templateId',
    [ItemMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let managerId = _.trim(req.params.managerId);
      let templateId = _.trim(req.params.templateId);

      _handleRequest(Site.getSiteCloudComputingEndpointManagerTemplate(siteId, endpointId, managerId, templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/managers/{managerId}/templates',{
    "summary": "A list of templates managed from the given manager provided by the cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingTemplateItemResponse"})
    }
  });
  router.get(
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/managers/:managerId/templates',
    [CollectionMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let managerId = _.trim(req.params.managerId);
      let params = getCollectionRequestParams(req);

      _handleRequest(Site.getAllSiteCloudComputingEndpointManagerTemplates(siteId, endpointId, managerId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/managers/{managerId}',{
    "summary": "A manager entry provided by the cloud computing endpoint. Can be retrieved by the information system ID.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/managers/:managerId',
    [ItemMetaData({ entityType: 'SiteCloudComputingManager' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let managerId = _.trim(req.params.managerId);

      _handleRequest(Site.getSiteCloudComputingEndpointManager(siteId, endpointId, managerId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/managers',{
    "summary": "List of managers supported by the current cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/managers',
    [CollectionMetaData({ entityType: 'SiteCloudComputingManager' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let params = getCollectionRequestParams(req);

      _handleRequest(Site.getAllSiteCloudComputingEndpointManagers(siteId, endpointId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/images/{imageId}',{
    "summary": "A VM image entry in the information system.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/images/:imageId',
    [ItemMetaData({ entityType: 'SiteCloudComputingImage' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let imageId = _.trim(req.params.imageId);

      _handleRequest(Site.getSiteCloudComputingEndpointImage(siteId, endpointId, imageId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/images',{
    "summary": "List of VM images provided by the current cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/images',
    [CollectionMetaData({ entityType: 'SiteCloudComputingImage' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let params = getCollectionRequestParams(req);

      _handleRequest(Site.getAllSiteCloudComputingEndpointImages(siteId, endpointId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/templates/{templateId}',{
    "summary": "Return a template entry of a specific cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/templates/:templateId',
    [ItemMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let templateId = _.trim(req.params.templateId);

      _handleRequest(Site.getSiteCloudComputingEndpointTemplate(siteId, endpointId, templateId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/templates',{
    "summary": "List of templates provided by the current cloud computing endpoint.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
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
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/templates',
    [CollectionMetaData({ entityType: 'SiteCloudComputingTemplate' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let params = getCollectionRequestParams(req);

      _handleRequest(Site.getAllSiteCloudComputingEndpointTemplates(siteId, endpointId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}',{
    "summary": "Return a specific cloud computing endpoint of a specific site.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:\<sitename\>", or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      },
      {
        "in": "path",
        "name": "endpointId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the primary key as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingEndpointItemResponse"})
    }
  });
  router.get(
    '/sites/:siteId/cloud/computing/endpoints/:endpointId',
    [ItemMetaData({ entityType: 'SiteCloudComputingEndpoint' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);

      _handleRequest(Site.getSiteCloudComputingEndpoint(siteId, endpointId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints',{
    "summary": "Return the list of cloud computing endpoints of a specific site.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:<sitename>", or the pkey as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingEndpointListResponse"})
    }
  });
  router.get(
    '/sites/:siteId/cloud/computing/endpoints',
    [CollectionMetaData({ entityType: 'SiteCloudComputingEndpoint' })],
    (req, res) => {
      let params = getCollectionRequestParams(req);
      let siteId = _.trim(req.params.siteId);

      _handleRequest(Site.getAllSiteCloudComputingEndpoints(siteId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/monitoring/status',{
    "summary": "Return the list of servics statuses for the the specific site as reported from argo monitoring service",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:<sitename>", or the pkey as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteServiceStatusArrayResponse"})
    }
  });
  router.get(
    '/sites/:siteId/monitoring/status',
    [ListMetaData({ entityType: 'SiteServiceStatus' })],
    (req, res) => {
      let params = getCollectionRequestParams(req);
      let siteId = _.trim(req.params.siteId);

      _handleRequest(Site.getServiceStatuses(siteId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/monitoring/downtimes',{
    "summary": "Return the list of ongoing or scheduled service downtimes for the specific site as reported in gocdb",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, or the name of the site if given in the form of  "name:<sitename>", or the pkey as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteServiceDowntimeArrayResponse"})
    }
  });
  router.get(
    '/sites/:siteId/monitoring/downtimes',
    [ListMetaData({ entityType: 'SiteServiceDowntime' })],
    (req, res) => {
      let params = getCollectionRequestParams(req);
      let siteId = _.trim(req.params.siteId);

      _handleRequest(Site.getServiceDowntimes(siteId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/sites/{siteId}", {
    "summary": "Returns specific site infromation.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "siteId",
        "required": true,
        "type": "string",
        "description": `Can be the information system ID, the name of the site if given in the form of  "name:<sitename>", or the pkey as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": '#/components/schemas/SiteItemResponse'})
    }
  });
  router.get(
    '/sites/:siteId',
    [ItemMetaData({ entityType: 'Site' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);

      _handleRequest(Site.getByIdentifier(siteId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/sites", {
    "summary": "Returns a list of sites registered in GocDB service.",
    "tags": ["Site"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters(),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({
        "ref": '#/components/schemas/SiteListResponse',
        "description": "List of sites in the information system.Each site may contain one or more services. If the site has at least one cloud service, it may also contain VM images and cloud execution templates."
      })
    }
  })
  router.get(
    '/sites',
    [CollectionMetaData({ entityType: 'Site' })],
    (req, res) => {
      let params = getCollectionRequestParams(req);

      _handleRequest(Site.getAll(params), req, res);
    }
  );
}

export default {
  useRouter
}