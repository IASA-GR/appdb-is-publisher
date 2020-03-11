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
import SiteCloudComputingEndpointInitHandler from './SiteCloudComputingEndpoint';


export const useRouter = (router, {openAPIDefinitions}) => {

  const SiteCloudComputingEndpoint = SiteCloudComputingEndpointInitHandler({openAPIDefinitions});

  openAPIDefinitions.registerGetPath('/cloud/computing/endpoints/{endpointId}/site',{
    "summary": "Returns information about the site that provides the specific cloud computing endpoint.",
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
    "summary": "Returns specific cloud computing endpoint infromation.",
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