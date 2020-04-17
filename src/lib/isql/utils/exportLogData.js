import {v4 as uuid} from 'uuid';

export const exportLogDataFromRequest = (req, data) => {
  data = data || {};

  let requestSource = req.headers['x-request-source'] || ((data.module) ? 'infosys/' + data.module : 'infosys/app');
  let requestId = req.headers['x-request-id'] || uuid();
  let ip = (req.headers && req.connection) ?  req.headers['x-forwarded-for'] || req.connection.remoteAddress : '';

  let logData = {
      requestSource: requestSource,
      requestId: requestId,
      ip: ip,
      rid: requestSource + '/' + requestId,
      pid: process.pid
    };

  logData = Object.assign(logData, data || {});

  return logData;
};

export const exportLogDataFromLogData = (logData, newData) => {
  logData = logData || {};

  return Object.assign({}, logData, newData);
}