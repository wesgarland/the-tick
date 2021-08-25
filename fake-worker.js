'use strict';

/** 
 * @file fake-worker.js
 *       Graft unto the Supervisor class so that we can reuse the fetchTask and recordResult machinery
 */
module.declare(['./output', 'subcontractor-manager'], function(require, exports, module) {
  const protocol         = require('dcp/protocol');
  const wallet           = require('dcp/wallet');
  const output           = require('./output');

  const { Supervisor }   = require('dcp/worker');
  const { EventEmitter } = require('dcp/dcp-events');
  const { SubcontractorManager } = require('./subcontractor-manager');
          
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
    this.cache = { jobs: [], jobDetails: {} };
    this.queuedSlices = [];
    this.authorizationMessages = {};
    this.slices = [];
    this.unallocatedSpace = Math.max(cpuCount, gpuCount, sboxCount, 5);
    
    this.taskDistributorConnection = new protocol.Connection(dcpConfig.scheduler.services.taskDistributor);
    this.taskDistributorConnection.on('close', () => {
      debugging() && console.debug('Lost connection to', config.location.href);
      this.taskDistributorConnection = new protocol.Connection(dcpConfig.scheduler.services.taskDistributor);
    });

    this.cache.store = (scope, jobAddress, jobDetails) => {
      const { publicName, publicDescription, computeGroups } = jobDetails.public;
      const computeGroupNames = computeGroups.map(cg => cg.name).join(' and ');

      output.log('got job', jobAddress,
                 'in', computeGroupNames, publicName + (publicDescription ? ` (${publicDescription})`: ''));
      this.cache.jobDetails[jobAddress] = jobDetails;
      if (!this.cache.seen)
        console.log(jobDetails);
      this.cache.seen = true;
      if (scope !== 'job')
        console.error('got weird scope', scope);
    };

    this.debug = true;
  }
  FakeSupervisor.prototype = new EventEmitter('FakeSupervisor');

  for (let methodName of stealMethods)
    FakeSupervisor.prototype[methodName] = Supervisor.prototype[methodName];

  FakeSupervisor.prototype.getStatisticsCPU = function FakeSupervisor$$getStatisticsCPU()
  {
    return {
      worker: this.workerOpaqueId,
      lCores: this.numCores * 2,
      pCores: this.numCores,
      sandbox: this.maxWorkingSandboxes,
    };
  }

  FakeSupervisor.prototype.subcontractWork = async function FakeSupervisor$$subcontractWork()
  {
    var i=0;

    output.log('subcontracting work for', Object.entries(this.cache.jobDetails).length, 'jobs');
    bankKs = await wallet.get();
    await bankKs.unlock(undefined, 1800, true);
    output.log('payment address is', bankKs.address);
    
    for (let jobAddress in this.cache.jobDetails)
    {
      let jobDetails = this.cache.jobDetails[jobAddress];
      setTimeout(() => this.subcontractorManager = new SubcontractorManager(bankKs, jobDetails, this.slices),
                 i++ * 2500 + 200); 

      if (i === 1)
      {
        output.log('Running one slice locally from', jobAddress);
        new SubcontractorManager(bankKs, jobDetails, [this.slices[0]] , true);
      }
      
      delete this.cache.jobDetails[jobAddress];

      if (i > 2)
        break;
    }
  }

  exports.FakeSupervisor = FakeSupervisor;
});
