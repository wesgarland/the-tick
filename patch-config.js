/**
 * Patch portal2 dcpConfig to work with production network
 */
const { DcpURL } = require('dcp/dcp-url');
const prod = new DcpURL('https://scheduler.distributed.computer');

for (let key of Object.keys(dcpConfig.scheduler.services))
{
  let svc = dcpConfig.scheduler.services[key];
  if (!svc.hasOwnProperty('location'))
    continue;
  
  svc.location = new DcpURL(prod.origin + svc.location.pathname);
}
console.log('patched dcpConfig to use services on', prod.origin);

module.declare([], (require, exports, module) => {}); /* end of module */
