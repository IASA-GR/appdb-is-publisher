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
import SiteServiceStatus from './SiteServiceStatus';


export const useRouter = (router, {openAPIDefinitions}) => {

  openAPIDefinitions.registerGetPath("/cloud/computing/statuses/{statusId}/endpoint",{
    "summary": "The cloud computing endpoint that the status refers to.",
    "tags": ["SiteServiceStatus"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "statusId",
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
    '/cloud/computing/statuses/:statusId/endpoint',
    [ItemMetaData({ entityType: 'SiteCloudComputingEndpoint' })],
    (req, res) => {
      let statusId = _.trim(req.params.statusId);

      _handleRequest(SiteServiceStatus.getEndpoint(statusId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/cloud/computing/statuses/{statusId}/site',{
    "summary": "The site that the specific status entry refers to.",
    "tags": ["SiteServiceStatus"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "statusId",
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
    '/cloud/computing/statuses/:statusId/site',
    [ItemMetaData({ entityType: 'Site' })],
    (req, res) => {
      let statusId = _.trim(req.params.statusId);

      _handleRequest(SiteServiceStatus.getSite(statusId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/cloud/computing/statuses/{statusId}", {
    "summary": "A service endpoint status entry in the information system.",
    "tags": ["SiteServiceStatus"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "statusId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": '#/components/schemas/SiteServiceStatusItemResponse'})
    }
  });
  router.get(
    '/cloud/computing/statuses/:statusId',
    [ItemMetaData({ entityType: 'SiteServiceStatus' })],
    (req, res) => {
      let statusId = _.trim(req.params.statusId);

      _handleRequest(SiteServiceStatus.getByIdentifier(statusId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/cloud/computing/statuses", {
    "summary": "Return the list of service endpoint statuses",
    "tags": ["SiteServiceStatus"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters(),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({
        "ref": '#/components/schemas/SiteServiceStatusListResponse',
      })
    }
  })
  router.get(
    '/cloud/computing/statuses',
    [CollectionMetaData({ entityType: 'SiteServiceStatus' })],
    (req, res) => {
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteServiceStatus.getAll(params), req, res);
    }
  );
}

export default {
  useRouter
}