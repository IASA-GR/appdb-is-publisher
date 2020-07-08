var existsSync = require('fs').existsSync;
var _ = require('lodash');
var path = require('path');

var config = {
  "server": {
    "http": {
      "port": 80,
      "routes": {
        "infosystem":{
          "rest" : "/rest",
          "graphql": "/graphql",
          "graphiql": "/graphiql"
        },
        "couchDBProxy": "/couchdb"
      }
    }
  },
  "modules": {
    "infosystem": {
      "schema" : "glue20",
      "app": {
        "logger": {
          "info": {
            "file": "/var/log/is/publisher/info.log",
            "rotate": {
              "filename": "%DATE%.info.log",
              "datePattern": "YYYYMMDD",
              "zippedArchive": true,
              "maxSize": "10m",
              "maxFiles": "1d",
              "dirname": "/var/log/is/publisher/"
            }
          },
          "debug": {
            "file": "/var/log/is/publisher/debug.log",
            "rotate": {
              "filename": "%DATE%.debug.log",
              "datePattern": "YYYYMMDD",
              "zippedArchive": true,
              "maxSize": "10m",
              "maxFiles": "1d",
              "dirname": "/var/log/is/publisher/"
            }
          },
          "trace": {
            "file": "/var/log/is/publisher/trace.log"
          }
        }
      },
      "storage": {
        "_default": {
          "dialect": "couchdb",
          "options" :{
            "name": "_default",
            "url": "https://nouser:nouser@localhost:6984",
            "collection": "isappdb"
          }
        },
        "logger": {
          "info": {
            "file": "/var/log/is/publisher/info.log"
          },
          "debug": {
            "file": "/var/log/is/publisher/debug.log"
          },
          "trace": {
            "file": "/var/log/is/publisher/trace.log"
          }
        }
      },
      "api": {
        "logger": {
          "info": {
            "file": "/var/log/is/publisher/info.log"
          },
          "trace": {
            "file": "/var/log/is/publisher/trace.log"
          }
        }
      },
      "graphql": {
        "logger": {
          "info": {
            "file": "/var/log/is/publisher/info.log"
          },
          "debug": {
            "file": "/var/log/is/publisher/debug.log"
          },
          "trace": {
            "file": "/var/log/is/publisher/trace.log"
          }
        }
      },
      "rest": {
        "graphQLUrl": "local",
        "logger": {
          "info": {
            "file": "/var/log/is/publisher/info.log"
          },
          "debug": {
            "file": "/var/log/is/publisher/debug.log"
          },
          "trace": {
            "file": "/var/log/is/publisher/trace.log"
          }
        }
      }
    },
    "couchDBProxy": {
      "target": {
        "protocol"  : "https",
        "host"      : "localhost",
        "port"      : 6984,
        "username"  : "",
        "password"  : ""
      },
      "logpath"     : "/var/log/is/publisher/proxy"
    }
  }
};


function loadConfig() {
  var _instanceConfigPath = path.resolve(__dirname, './instance.config.js');
  var instanceConfig = {};

  if (existsSync(_instanceConfigPath)) {
    instanceConfig = require(_instanceConfigPath);
  }

  return _.merge(config, instanceConfig);
};


module.exports = loadConfig();
