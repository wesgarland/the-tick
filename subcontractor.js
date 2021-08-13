/** main module for subcontractor iframes */
'use strict';
module.declare([/*'./patch-config',*/ './nodier', './output'], async (require, exports, module) =>
{
//  const compute = require('dcp/compute');
//  const wallet  = require('dcp/wallet');
//  const { fetchURI } = require('dcp/utils');
//
  
  const compute = dcp.compute;
  const wallet  = dcp.wallet;
  const { fetchURI } = dcp['utils'];
  
  const output  = require('./output');
  var idKs;
  
  output.log('initializing subcontractor...');
  require('./nodier').init();

  idKs = await (new wallet.IdKeystore(null, ''));
  wallet.addId(idKs);
  idKs = await wallet.getId();
  output.log('identity is', idKs.address);
  window.parent.postMessage({ type: 'ready' }, '*');

  window.on('message', function handleMessage(ev)
  {
    if (ev.source === ev.target)
    {
//      console.log('subcontractor ignoring message', ev);
      return;
    }

    try
    {
      const message = ev.data;
      console.log('subcontractor got message', message);
      
      switch(message.cmd)
      {
        case 'job':
          console.log('raw message:', ev.data);
          handleJob(message);
        break;
        default:
          throw new Error(`unknown command '${message.cmd}'`);
      }
    }
    catch(error)
    {
      console.log('Subcontractor received invalid message', error, ev);
    }
  });

  async function rewriteUri(uri)
  {
    if (typeof uri !== 'string')
      return uri;
    
    if (uri.startsWith('data:'))
      return await fetchURI(uri);
    else
      return new URL(uri);
  }

  async function handleJob({jobDetails, slicesJSON, bankPkStr, localExec}={})
  {
    var slices = JSON.parse(slicesJSON);
    var slice, arg;
    var job, inputSet = [], work, args, outputSet;
    var bankPk = new wallet.PrivateKey(bankPkStr);
    var bankKs = await (new wallet.AuthKeystore(bankPk, ''));

    output.log('source job is', jobDetails.address, `(${jobDetails.public.name + '; ' + jobDetails.public.description})`);
    output.log('job fragment has', slices.length, 'slices');

    bankKs.label='you should never see this'; /* not you */
    wallet.add(bankKs, 'default');
    
    output.log('payment account', (await wallet.get()).address);

    while ((slice = slices.pop()))
      inputSet.push(await rewriteUri(slice.datumUri));

    output.log('new job has', inputSet.length, 'slices');

    args = await rewriteUri(jobDetails.argumentsLocation);
    work = await rewriteUri(jobDetails.codeLocation);

    output.log('work function code is', work.length, 'chars long');
    output.log('args', args);
    
    job = compute.for(inputSet, work, args);
    job.on('error', function(error) { output.error('error:', error.message); console.error(error) });
    job.on('readystatechange', function(state) { output.log('ready state change:', state) });
    job.on('result', function() { output.log('got result') });
    job.on('accepted', () => {
      output.log(` - New job accepted by scheduler, waiting for results`);
      output.log(` - New job has id ${job.id}`);
    });
    job.on('result', (ev) => {
      output.log(' - Received result for slice ${ev.sliceNumber}');
      output.log(' * result:', ev.result);
    }); 
    
    Object.assign(job.public, jobDetails.public);
    job.public.name = 'MOOOOHOOOOOHAHAHAHAH ' + jobDetails.public.name;

    console.log('INPUT SET', inputSet);
    
    output.log('sending to scheduler', dcpConfig.scheduler.services.jobSubmit.location.origin);
    if (localExec)
      outputSet = await job.localExec();
    else
      outputSet = await job.exec();
    output.log(' - Finished job', job.id);
    console.log(outputSet);
  }
});
