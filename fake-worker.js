module.declare([], function(require, exports, module) {
  const protocol         = require('dcp/protocol');
  const wallet           = require('dcp/wallet');
  const { Supervisor }   = require('dcp/worker');
  const { EventEmitter } = require('dcp/dcp-events');
  
  const debugging = require('dcp/debugging').scope('fake-worker');
  const stealMethods = [ 'fetchTask', 'workerOpaqueId', 'generateWorkerComputeGroups' ];

  function FakeSupervisor(cpuCount, gpuCount, sboxCount)
  {
    this.capabilities = {};
    this.options = {};
    this.numCores = cpuCount;
    this.defaultMaxGPUs = gpuCount;
    this.maxWorkingSandboxes = sboxCount;
    this.paymentAddress = new wallet.Address('0x762cca1f37365097de14f12aea70c06cb8e58ef8');
    this.cache = { jobs: [] };
    this.queuedSlices = [];
    this.authorizationMessages = {};
    this.slices = [];
    this.unallocatedSpace = Math.max(cpuCount, gpuCount, sboxCount, 5);
    
    this.taskDistributorConnection = new protocol.Connection(dcpConfig.scheduler.services.taskDistributor);
    this.taskDistributorConnection.on('close', () => {
      debugging() && console.debug('Lost connection to', config.location.href);
      this.taskDistributorConnection = new protocol.Connection(dcpConfig.scheduler.services.taskDistributor);
    });

    this.cache.store = function(wordJob, jobAddress, jobStuff) {
      console.log('got job', jobAddress, jobStuff);
    };
  }
  FakeSupervisor.prototype = new EventEmitter('FakeSupervisor');

  for (let methodName of stealMethods)
    FakeSupervisor.prototype[methodName] = Supervisor.prototype[methodName];

  FakeSupervisor.prototype.getStatisticsCPU = function FakeSupervisor$$getStatisticsCPU()
  {
    return {
      worker: this.workerOpaqueId,
      lCores: this.numCores,
      pCores: this.numCores,
      sandbox: this.maxWorkingSandboxes,
    };
  }

  exports.fetchTask = function fakeWorker$$fetchTask()
  {
  }

  window.XXX = FakeSupervisor;
  exports.FakeSupervisor = FakeSupervisor;
});
