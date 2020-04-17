import winston from 'winston';
import _ from 'lodash';
import path from 'path';
require('winston-daily-rotate-file');

const _customLogLevels = Object.assign({trace: 100}, winston.config.syslog.levels);
const _logLevels = Object.keys(_customLogLevels);

const _catchAllLogger = winston.createLogger({
  levels: winston.config.npm,
  transports: [
    new winston.transports.Console()
  ],
  exitOnError: false
});

const _registry = {
  _default: _catchAllLogger
};

const _ensurePath = (filePath = __dirname) => {
  if (path.extname(filePath)) {
    filePath = path.dirname(filePath);
  }
};

const _createLogger = (name, conf = { error: null, warn: null, info: null, verbose: null, debug: null, silly: null }) => {
  name = _.trim(name) || 'app';

  let format = winston.format;
  let customFormat = format.printf((info) => {
    let logData = info.logData || {};
    let ip = (logData.ip) ? logData.ip + ' - ': '';
    let logDate = '[' + new Date().toISOString() + ']';
    let pid = (logData.pid) ? '[PID:' + logData.pid + ']' : '[PID:' + process.pid + ']';
    let rid = (logData.rid) ? '[RID:' + logData.rid + ']' : '';
    let module = (logData.module) ? '[' + _.trim(logData.module).toUpperCase() + ']' : '';
    let md5 = (logData.md5Hash) ? '[' + logData.md5Hash + ']' : '';
    let level = '[' + _.toUpper(info.level) + ']';

    return ip + logDate + pid + rid + module + level + md5 + ' ' + info.message;
  });

  let loggerTransports =_logLevels.reduce((acc, level) => {
    let logConf = _.isString(conf[level]) ? {file: conf[level]} : conf[level];
    let logFile = logConf ? logConf.file : null;
    let logRotate = logConf ? logConf.rotate : null;

    if (logFile && _.isString(logFile) && _.trim(logFile) ) {
      _ensurePath(logFile);
      if (_.isPlainObject(logRotate)) {
        let transport = new winston.transports.DailyRotateFile(
          Object.assign({ name: 'file_ ' + name + '_' + level, filename: logFile, level: level, json: false }, logRotate)
        );
        /*transport.on('new', function(oldName, newName) {
          console.log('ROTATINGF ' , newName, oldName)
        });*/
        acc.push(transport);
      } else {
        acc.push( new winston.transports.File( { name: 'file_ ' + name + '_' + level, filename: logFile, level: level, json: false } ) );
      }

    } else {
      acc.push( new winston.transports.Console( {name: 'console_ ' + name + '_' + level, level: level } ) );
    }
    return acc;
  }, []);


  return winston.createLogger({
    levels: _customLogLevels,
    transports: loggerTransports,
    format: customFormat,
    exitOnError: false
  });
};

const _registerLogger = (name, conf = {}) => {
  _registry[name] = _createLogger(name, conf);
  return _getRegisteredLogger(name);
};

const _hasRegisteredLogger = (name) => {
  return (_.has(_registry, name) && _registry[name]);
}

const _getRegisteredLogger = (name) => {
  if (_.trim(name)) {
    return _.get(_registry, name, _catchAllLogger);
  }
  return _catchAllLogger;
};

export default function() {
  return {
    register: _registerLogger,
    isRegistered: _hasRegisteredLogger,
    get: _getRegisteredLogger
  };
};
