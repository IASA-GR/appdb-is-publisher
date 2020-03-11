import Site from './Site';
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
  getCollectionRequestParams
} from '../httpUtils';

import SiteRouter from './Site.router';
import SiteCloudComputingEndpointRouter from './SiteCloudComputingEndpoint.router';

import OpenAPIDefinitions from '../OpenAPIDefinitions';

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

  SiteRouter.useRouter(router, {openAPIDefinitions});
  SiteCloudComputingEndpointRouter.useRouter(router, {openAPIDefinitions});

  //updateRouterDescription(SiteRouter.getRoutesDescription());
  updateSwaggerComponents(openAPIDefinitions.getAllOpenAPIComponents());
  updateSwaggerDocumentPaths(openAPIDefinitions.getAllOpenAPIPaths());

  require('fs').writeFileSync('generatedSwaggerSchema.json', JSON.stringify(SWAGGER_DOCUMENT, null, 2), 'utf-8');

  router.use('/', swaggerUi.serve);
  router.get('/', swaggerUi.setup(SWAGGER_DOCUMENT));

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
export const sserviceDescription = {
  '/rest': {
    description: 'Service to query the information system in a RESTful fashion',
    routes: {

      '/services': {
        description: 'List of services in the information system. Services may contain one or more VM image references and execution templates.'
      },
      '/services/[<id> | gocdb:<endpointpkey>]': {
        description: 'A service entry in the information system.Can be retrieved by the information system ID, or the endpoint pkey as provided by the gocdb portal API'
      },
      '/services/[<id> | gocdb:<endpointpkey>]/site': {
        description: 'Retrieve the site entry theat the current service belongs to.'
      },
      '/services/[<id> | gocdb:<endpointpkey>]/images': {
        description: 'Retrieve a list of VM images the current sevice provides.'
      },
      '/services/[<id> | gocdb:<endpointpkey>]/images/<id>': {
        description: 'A VM image entry provided by the current service.'
      },
      '/services/[<id> | gocdb:<endpointpkey>]/templates': {
        description: 'Retrieve a list of templates the current service provides.'
      },
      '/services/[<id> | gocdb:<endpointpkey>]/templates/<id>': {
        description: 'A template entry provided by the current service.'
      },
      '/images': {
        description: 'List of VM image entries in the information system.'
      },
      '/images/<id>': {
        description: 'A VM image entry in the information system. Can be retieved with the information system ID.'
      },
      '/images/<id>/service': {
        description: 'The service entry in the information system the current VM image belongs to.'
      },
      '/images/<id>/site': {
        description: 'The site entry in the information system the current VM image belongs to.'
      },
      '/images/<id>/temlates': {
        description: 'List of templates in the information system that can be used with the current VM image belongs to.'
      },
      '/images/<id>/templates/<id>': {
        description: 'A template entry that can be used with the current VM image.'
      },
      '/templates': {
        description: 'List of templates in the information system.'
      },
      '/templates/<id>': {
        description: 'A template entry in the information system. Can be retrieved with the information system ID.'
      },
      '/templates/<id>/service': {
        description: 'The service entry that the current template belongs to.'
      },
      '/templates/<id>/site': {
        description: 'The site entry that the current template belongs to.'
      },
      '/templates/<id>/images': {
        description: 'List of VM images that can use the current template.'
      },
      '/templates/<id>/images/<id>': {
        description: 'A VM image entry that can use the current template.'
      },
      '/statuses': {
        description: 'List of argo service status entries in the information system.'
      },
      '/statuses/<id>': {
        description: 'An argo service status entry in the information system. Can be retrieved with the information system ID.'
      },
      '/statuses/<id>/site': {
        description: 'The related site entry that the current argo entry refers to.'
      },
      '/statuses/<id>/service': {
        description: 'The related site service entry that the current argo entry refers to.'
      },
      '/downtimes': {
        description: 'List of GocDB downtime report entries in the information system.'
      },
      '/downtimes/<id>': {
        description: 'A GocDB downtime report entry in the information system. Can be retrieved with the information system ID.'
      },
      '/downtimes/<id>/site': {
        description: 'The related site entry that the current GocDB downtime report entry refers to.'
      },
      '/downtimes/<id>/service': {
        description: 'The related site service entry the current  GocDB downtime report entry refers to.'
      }
    }
  }
};
