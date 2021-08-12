'use strict';

module.declare((require, exports, module) => {
  const wallet = require('dcp/wallet');
  
  var iframeIdx = [];

  function $(s) {
    return document.querySelector(s);
  }

  window.addEventListener('message', function(ev) {
    for (let entry of iframeIdx)
    {
      if (ev.source === entry.iframe.contentWindow)
      {
	/* establish reply comms channel in advance */
        entry.instance.sendMessage = function SubcontractorManager$$sendMessage(message)
        {
          entry.iframe.contentWindow.postMessage(message, '*');
        }
        exports.SubcontractorManager.receiveMessage.call(entry.instance, ev.data);
        break;
      }
    }
  });

  exports.SubcontractorManager = function SubcontractorManager(jobDetails, slices)
  {
    var iframe = document.createElement('iframe');
    
    iframe.setAttribute('src', './subcontractor.html');
    iframe.className = 'subcontractor';
    iframeIdx.push({iframe, instance: this});

    $('#operate').appendChild(iframe);
 
    this.jobDetails = jobDetails;
    this.slices = slices;
  }

  /** 
   * "ready for work"
   * "have a result" 
   */
  exports.SubcontractorManager.receiveMessage = async function SubcontractorManage$$receiveMessage(message)
  {
    var bankKs, bankPk;
    
    bankKs = await wallet.get();
    await bankKs.unlock(undefined, 1800, true);
    bankPk = await bankKs.getPrivateKey();

    switch(message.type)
    {
      case 'ready': /* ready? send down the job and a way to pay for it */
      this.sendMessage({cmd: 'job', jobDetails: this.jobDetails, slices: this.slices, bankPkStr: bankPk.toString()});
      break;
      case 'result':
        alert('result: ' + JSON.stringify(message));
      break;
    }
  }
});
