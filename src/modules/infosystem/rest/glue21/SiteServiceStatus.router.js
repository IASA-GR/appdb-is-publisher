import _ from 'lodash';
import {
  CollectionMetaData,
  ItemMetaData,
  _handleMissing,
  _handleRequest,
  getCollectionRequestParams,
} from '../httpUtils';
import SiteServiceStatus from './SiteServiceStatus';

export const useRouter = (router, {openAPIDefinitions}) => {

  openAPIDefinitions.registerGetPath("/monitoring/status/{statusId}/endpoint",{
    "summary": "The cloud computing endpoint that the status refers to.",
    "tags": ["Monitoring"],
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
    '/monitoring/status/:statusId/endpoint',
    [ItemMetaData({ entityType: 'SiteCloudComputingEndpoint' })],
    (req, res) => {
      let statusId = _.trim(req.params.statusId);

      _handleRequest(SiteServiceStatus.getEndpoint(statusId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/monitoring/status/{statusId}/site',{
    "summary": "The site that the specific status entry refers to.",
    "tags": ["Monitoring"],
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
    '/monitoring/status/:statusId/site',
    [ItemMetaData({ entityType: 'Site' })],
    (req, res) => {
      let statusId = _.trim(req.params.statusId);

      _handleRequest(SiteServiceStatus.getSite(statusId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/monitoring/status/{statusId}", {
    "summary": "A service endpoint status entry in the information system.",
    "tags": ["Monitoring"],
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
    '/monitoring/status/:statusId',
    [ItemMetaData({ entityType: 'SiteServiceStatus' })],
    (req, res) => {
      let statusId = _.trim(req.params.statusId);

      _handleRequest(SiteServiceStatus.getByIdentifier(statusId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/monitoring/status", {
    "summary": "Return the list of service statuses as reported from the argo monitoring service",
    "tags": ["Monitoring"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters(),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({
        "ref": '#/components/schemas/SiteServiceStatusListResponse',
      })
    }
  })
  router.get(
    '/monitoring/status',
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