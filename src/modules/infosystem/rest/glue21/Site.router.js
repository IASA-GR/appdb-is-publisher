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
import SiteInitHandler from './Site';


export const useRouter = (router, {openAPIDefinitions}) => {
  //############################################
  //################## SITES ###################
  //############################################
  const Site = SiteInitHandler({openAPIDefinitions});

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/shares/{shareId}/images/{imageId}/templates/{templateId}',{
    "summary": "An applicable template entry to the given VM imageunder the given share entry provided by the cloud computing endpoint.",
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
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingShareImageTemplateItemResponse"})
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
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingShareImageTemplateListResponse"})
    }
  });
  router.get(
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/shares/:shareId/images/:imageId/templates',
    [ItemMetaData({ entityType: 'SiteCloudComputingTemplate' })],
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
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingShareImageItemResponse"})
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
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": "#/components/schemas/SiteCloudComputingShareImageListResponse"})
    }
  });
  router.get(
    '/sites/:siteId/cloud/computing/endpoints/:endpointId/shares/:shareId/images',
    [ItemMetaData({ entityType: 'SiteCloudComputingImage' })],
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
    [ItemMetaData({ entityType: 'SiteCloudComputingShare' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let params = getCollectionRequestParams(req);

      _handleRequest(Site.getAllSiteCloudComputingEndpointShares(siteId, endpointId, params), req, res);
    }
  );


  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/managers/{managerId}',{
    "summary": "A manager entry provided by the cloud computing endpoint. Can be retrieved by the information system ID.",
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
    [ItemMetaData({ entityType: 'SiteCloudComputingManager' })],
    (req, res) => {
      let siteId = _.trim(req.params.siteId);
      let endpointId = _.trim(req.params.endpointId);
      let params = getCollectionRequestParams(req);

      _handleRequest(Site.getAllSiteCloudComputingEndpointManagers(siteId, endpointId, params), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/sites/{siteId}/cloud/computing/endpoints/{endpointId}/images/{imageId}',{
    "summary": "A VM image entry in the information system.",
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
    "summary": "Return a specific cloud computing endpoint of a specific site.",
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

  openAPIDefinitions.registerGetPath("/sites/{siteId}", {
    "summary": "Returns specific site infromation.",
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


export const getSwaggerPaths = () => {
  return {
    "/sites": {
      "get": {
        "summary": "Returns a list of sites registered in GocDB service.",
        "description": "",
        "parameters": getOpenAPICollectionParameters(),
        "responses": {
          "200": {
            "description": "List of sites in the information system.Each site may contain one or more services. If the site has at least one cloud service, it may also contain VM images and cloud execution templates.",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": '#/components/schemas/SiteCollection'
                }
              }
            }
          }
        }
      }
    },
    "/sites/{siteId}": {
      "get": {
        "summary": "Returns specific site infromation.",
        "description": "",
        "parameters": getOpenAPIItemParameters([
          {
            "in": "path",
            "name": "siteId",
            "required": true,
            "type": "string",
            "description": `Can be the information system ID, the name of the site if given in the form of  "name:<sitename>", or the pkey as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
          }
        ]),
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": '#/components/schemas/Site'
                }
              }
            }
          }
        }
      }
    },
    '/sites/{siteId}/cloud/computing/endpoints': {
      "get": {
        "summary": "Return the list of cloud computing endpoints of a specific site.",
        "description": "",
        "parameters": getOpenAPICollectionParameters([
          {
            "in": "path",
            "name": "siteId",
            "required": true,
            "type": "string",
            "description": `Can be the information system ID, or the name of the site if given in the form of  "name:<sitename>", or the pkey as provided by the GocDB service if given in the form of "gocdb:<pkey>"`
          }
        ]),
        "responses": {
          "200": {
            "description": "",
            /*"content": {
              "application/json": {
                "schema": {
                  "$ref": '#/components/schemas/SiteCloudComputingEndpointCollection'
                }
              }
            }*/
          },
          "404": {
            "description": "Could not find a site with the given siteId"
          }
        }
      }
    }
  }
};

export const getSwaggerComponents = () => {
  return Object.assign({}, Site.getSwaggerComponents())
}


export const getRoutesDescription = (routesDescription) => {
  return {
    '/sites': {
      description: 'List of sites in the information system.Each site may contain one or more services. If the site has at least one cloud service, it may also contain VM images and cloud execution templates.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]': {
      description: 'A site entry in the information system. Can be retrieved by the information system ID, the name of the site, or the pkey as provided by the gocdb portal API'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints': {
      description: 'List of services provided by the current site. Services may contain one or more VM image references and execution templates.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <id>]': {
      description: 'A service entry in the information system. Can be retrieved by the information system ID, or the endpoint pkey as provided by the gocdb portal API'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/images': {
      description: 'List of VM images provided by the current cloud computing endpoint.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/images/<id>': {
      description: 'A VM image entry in the information system. Can be retrieved by the information system ID.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/templates': {
      description: 'List of templates provided by the current cloud computing endpoint.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/templates/<id>': {
      description: 'A template entry in the information system. Can be retrieved by the information system ID.'
    },
    //start glue 2.1 site additions
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/shares': {
      description: 'List of shares supported by the current cloud computing endpoint.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/shares/<id>': {
      description: 'A share entry provided by the cloud computing endpoint. Can be retrieved by the information system ID.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/shares/<id>/images': {
      description: 'A list of images provided under the specific share entry of the current cloud computing endpoint.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/shares/<id>/images/<id>': {
      description: 'An image entry provided under the specific share entry of the current cloud computing endpoint. Can be retrieved by the information system ID.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/shares/<id>/images/<id>/templates': {
      description: 'A list of templates available for the specific image of the specific share of the current cloud computing endpoint.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/shares/<id>/images/<id>/templates/<id>': {
      description: 'A template entry available for the specific image of the specific share of the current cloud computing endpoint. Can be retrieved by the information system ID.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/managers': {
      description: 'List of managers supported by the current cloud computing endpoint.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/managers/<id>': {
      description: 'A manager entry provided by the cloud computing endpoint. Can be retrieved by the information system ID.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/managers/<id>/templates': {
      description: 'A list of templates related to the specific manager entry provided by the cloud computing endpoint. Can be retrieved by the information system ID.'
    },
    '/sites/[<id> | name:<sitename> | gocdb:<pkey>]/cloud/computing/endpoints/[<id> | gocdb: <endpointpkey>]/managers/<id>/templates/<id>': {
      description: 'A template entry related to the specific manager entry provided by the cloud computing endpoint. Can be retrieved by the information system ID.'
    },
    //end glue 2.1 site additions
  };
}

export default {
  useRouter,
  getRoutesDescription
}