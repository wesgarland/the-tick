/**
 * Main module - this module is run on page load.
 */
module.declare(['./patch-config', './ui', './fake-worker'],
	       async function mainModule(require, exports, module) {
  const wallet = require('dcp/wallet');
  
  const { Inventory } = require('dcp/utils').Inventory;
  const { fetch, fobOff } = require('./fake-worker');
  const fakeCPUs = 100;
  const fakeGPUs = 5;
  var slices;
  
  require('./ui').init();
		 
  wallet.addId(await (new wallet.Keystore(null, '')));
  //	slices = require('./fake-worker').fetchTask(fakeCPUs, fakeGPUs);
  f=(a = new (require('./fake-worker').FakeSupervisor)(5,1,5)).fetchTask(fakeCPUs)
});
