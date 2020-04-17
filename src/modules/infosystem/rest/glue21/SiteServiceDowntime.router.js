import _ from 'lodash';
import {
  CollectionMetaData,
  ItemMetaData,
  _handleMissing,
  _handleRequest,
  getCollectionRequestParams
} from '../httpUtils';
import SiteServiceDowntime from './SiteServiceDowntime';

export const useRouter = (router, {openAPIDefinitions}) => {

  openAPIDefinitions.registerGetPath("/monitoring/downtimes/{downtimeId}/endpoint",{
    "summary": "The cloud computing endpoint that the downtime refers to.",
    "tags": ["Monitoring"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "downtimeId",
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
    '/monitoring/downtimes/:downtimeId/endpoint',
    [ItemMetaData({ entityType: 'SiteCloudComputingEndpoint' })],
    (req, res) => {
      let downtimeId = _.trim(req.params.downtimeId);

      _handleRequest(SiteServiceDowntime.getEndpoint(downtimeId, req), req, res);
    }
  );

  openAPIDefinitions.registerGetPath('/monitoring/downtimes/{downtimeId}/site',{
    "summary": "The site that the specific downtime entry refers to.",
    "tags": ["Monitoring"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "downtimeId",
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
    '/monitoring/downtimes/:downtimeId/site',
    [ItemMetaData({ entityType: 'Site' })],
    (req, res) => {
      let downtimeId = _.trim(req.params.downtimeId);

      _handleRequest(SiteServiceDowntime.getSite(downtimeId, req), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/monitoring/downtimes/{downtimeId}", {
    "summary": "A service downtime entry in the information system.",
    "tags": ["Monitoring"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPIItemParameters([
      {
        "in": "path",
        "name": "downtimeId",
        "required": true,
        "type": "string",
        "description": `The information system ID`
      }
    ]),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({"ref": '#/components/schemas/SiteServiceDowntimeItemResponse'})
    }
  });
  router.get(
    '/monitoring/downtimes/:downtimeId',
    [ItemMetaData({ entityType: 'SiteServiceDowntime' })],
    (req, res) => {
      let downtimeId = _.trim(req.params.downtimeId);

      _handleRequest(SiteServiceDowntime.getByIdentifier(downtimeId, req), req, res);
    }
  );

  openAPIDefinitions.registerGetPath("/monitoring/downtimes", {
    "summary": "Return the list of service downtimes as reported from gocdb service",
    "tags": ["Monitoring"],
    "description": "",
    "parameters": openAPIDefinitions.getOpenAPICollectionParameters(),
    "responses": {
      "200": openAPIDefinitions.getOpenAPI200Response({
        "ref": '#/components/schemas/SiteServiceDowntimeListResponse',
      })
    }
  }, {
    filter: {
      graphQLType: 'SiteServiceDowntime_Filter'
    }
  })
  router.get(
    '/monitoring/downtimes',
    [CollectionMetaData({ entityType: 'SiteServiceDowntime' })],
    (req, res) => {
      let params = getCollectionRequestParams(req);

      _handleRequest(SiteServiceDowntime.getAll(params, req), req, res);
    }
  );
}

export default {
  useRouter
}