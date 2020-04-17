import LoggingSystem from './lib/isql/Logger';
import InformationSystem from './modules/infosystem';
import HttpServer from './server';

/**
 * Initialize sub modules/services and
 * starts ISPublisher application.
 */
async function _initApplication() {
  let infoSystem = null;
  try {
    //Initalize logging system
    let logger = LoggingSystem();

    //Initialize information system module

    infoSystem = await InformationSystem();

    //Initialize HTTP server. Passing ispublisher sub services.
    let server = await HttpServer({
      getLogger: infoSystem.getLogger,
      getGraphQL: infoSystem.getGraphQL,
      getApi: infoSystem.getApi
    });

    infoSystem.getLogger().info('IS Publisher service started');
    //console.log('\x1b[32m[ISPublisher]\x1b[0m: Started');
  } catch(e) {
    if (infoSystem && infoSystem.getMainLogger) {
      infoSystem.getLogger().error('IS Publisher service failed to start. ' + e);
    }
    console.log('\x1b[31m[ISPublisher][ERROR]\x1b[0m: ', e);
    process.exit(1);
  }
}

export default _initApplication;