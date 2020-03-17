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

  openAPIDefinitions.registerGetPath("/monitoring/statuses/{statusId}/endpoint",{
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
    '/monitoring/statuses/:statusId/endpoint',
    [ItemMetaData({ entityType: 'SiteCloudComputingEndpoint' })],
    (req, res) => {
      let statusId = _.trim(req.params.statusId);

      _handleRequest(SiteServiceStatus.getEndpoint(statusId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/monitoring/statuses/{statusId}/site',{
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
    '/monitoring/statuses/:statusId/site',
    [ItemMetaData({ entityType: 'Site' })],
    (req, res) => {
      let statusId = _.trim(req.params.statusId);

      _handleRequest(SiteServiceStatus.getSite(statusId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/monitoring/statuses/{statusId}", {
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
    '/monitoring/statuses/:statusId',
    [ItemMetaData({ entityType: 'SiteServiceStatus' })],
    (req, res) => {
      let statusId = _.trim(req.params.statusId);

      _handleRequest(SiteServiceStatus.getByIdentifier(statusId), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/monitoring/statuses", {
    "summary": "Return the list of service endpoint statuses",
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
    '/monitoring/statuses',
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