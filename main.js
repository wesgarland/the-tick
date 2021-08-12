/**
 * Main module - this module is run on page load.
 */
module.declare(['./patch-config', './ui', './fake-worker'], async function mainModule(require, exports, module) {
  const wallet = require('dcp/wallet');
  const output = require('./output');

  const { Inventory } = require('dcp/utils').Inventory;
  const { fetch, fobOff } = require('./fake-worker');
  const fakeCPUs = 2;
  const fakeGPUs = 0;
  var fs, ks;
  
  await require('./ui').init();
  wallet.addId(await (new wallet.Keystore(null, '')));
  bankKs = await wallet.get('default');
  await bankKs.unlock(undefined, 1800, true);
  
  fs = new (require('./fake-worker').FakeSupervisor)(fakeCPUs, fakeGPUs, fakeCPUs);
  fs.on('fetchingTask',    (ev) => output.log('fetching task...'));
  fs.on('fetchedTask',     (ev) => fs.subcontractWork());
  fs.on('fetchTaskFailed', (error) => console.error(error));
  fs.fetchTask(fakeCPUs);
});
