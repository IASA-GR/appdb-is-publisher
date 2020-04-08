import _ from 'lodash';
import fs from 'fs';
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
  getCollectionRequestParams
} from '../httpUtils';
import OpenAPILoadComponentDefinitions from './OpenAPILoadComponentDefinitions';
import OpenAPIDefinitions from '../OpenAPIDefinitions';
import SiteRouter from './Site.router';
import SiteCloudComputingEndpointRouter from './SiteCloudComputingEndpoint.router';
import SiteCloudComputingImageRouter from './SiteCloudComputingImage.router';
import SiteCloudComputingTemplateRouter from './SiteCloudComputingTemplate.router';
import SiteServiceStatusRouter from './SiteServiceStatus.router';
import SiteServiceDowntimeRouter from './SiteServiceDowntime.router';

const swaggerUi = require('swagger-ui-express');

// const DEFAULT_LIMIT = 20;
const SWAGGER_DOCUMENT = {
    "openapi": "3.0.0",
    "info": {
      "title": "EGI AppDB InfoSys Restful API",
      "description": "Access to EGI Fedcloud infrastructure information",
      "version": "0.1.1"
    },
    "servers": [
      {
        "url": "http://is-dev.marie.hellasgrid.gr/rest",
        "description": "Development server"
      },
      {
        "url": "http://is.marie.hellasgrid.gr/rest",
        "description": "Production server"
      }
    ],
    "paths": {},
    "components": {
      "schemas": {}
    }
};

if (process.env.NODE_ENV === 'development') {
  SWAGGER_DOCUMENT.servers.unshift({
    "url": "http://172.16.0.117:5050/rest",
    "description": "Localhost development instance"
  });
  SWAGGER_DOCUMENT.servers.unshift({
    "url": "http://localhost:5050/rest",
    "description": "Localhost development instance"
  });
}

const updateSwaggerDocumentPaths = (paths) => {
  SWAGGER_DOCUMENT.paths = Object.assign({}, SWAGGER_DOCUMENT.paths, paths || {});
};

const updateSwaggerComponents = (components) => {
  SWAGGER_DOCUMENT.components.schemas = Object.assign({}, SWAGGER_DOCUMENT.components.schemas, components || {})
};

const updateRouterDescription = (routerDescription) => {
  serviceDescription.routes = Object.assign({}, serviceDescription.routes, routerDescription);
};
export const expressRouter = function (router, config) {

  let openAPIDefinitions = new OpenAPIDefinitions();
  let swaggerUIOptions = {};

  OpenAPILoadComponentDefinitions({openAPIDefinitions});

  SiteRouter.useRouter(router, {openAPIDefinitions});
  SiteCloudComputingEndpointRouter.useRouter(router, {openAPIDefinitions});
  SiteCloudComputingImageRouter.useRouter(router, {openAPIDefinitions});
  SiteCloudComputingTemplateRouter.useRouter(router, {openAPIDefinitions});
  SiteServiceStatusRouter.useRouter(router, {openAPIDefinitions});
  SiteServiceDowntimeRouter.useRouter(router, {openAPIDefinitions});

  updateSwaggerComponents(openAPIDefinitions.getAllOpenAPIComponents());
  updateSwaggerDocumentPaths(openAPIDefinitions.getAllOpenAPIPaths());

  fs.writeFileSync('generatedSwaggerSchema.json', JSON.stringify(SWAGGER_DOCUMENT, null, 2), 'utf-8');

  fs.writeFileSync('dist/infosys.swaggerui.json', JSON.stringify({
    definitions: openAPIDefinitions.getAllGraphQLDefinitions(),
    filters: openAPIDefinitions.getAllFilters()
  }, null, 2), 'utf-8');

  router.get('/_assets/infosys.swaggerui.js', function(req, res) {
    fs.readFile(__dirname + '/infosys.swaggerui.js', {encoding: 'utf8'}, (error, data) => {
      if (error) {
        res.status(500);
        res.send(error);
      } else {
        fs.readFile('dist/infosys.swaggerui.json', {encoding: 'utf8'}, (error, jsondata) => {
          if (!error) {
            data += '\nINFOSYS=' + jsondata;
          }
          res.send(data);
        });
      }
    });
  });

  swaggerUIOptions.customJs = '/rest/_assets/infosys.swaggerui.js';


  router.use('/', swaggerUi.serve);
  router.get('/', swaggerUi.setup(SWAGGER_DOCUMENT, swaggerUIOptions));

  console.log('[infosystem:Rest] Inited');
  return router;
};

export const serviceDescription = {
  '/rest': {
    description: 'Service to query the information system in a RESTful fashion',
    routes: {
    }
  }
};

/**
 * Rest API service description.
 */
export const getServiceDescription = () => {
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