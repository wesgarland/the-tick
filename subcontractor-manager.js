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
        return;
      }
    }
//    console.log('subcontractor-manager ignoring message', ev);
  });

  exports.SubcontractorManager = function SubcontractorManager(bankKs, jobDetails, slices, localExec)
  {
    var iframe = document.createElement('iframe');
    
    this.jobDetails = jobDetails;
    this.slices = slices;
    this.bankKs = bankKs;
    this.localExec = localExec;
    
    iframe.setAttribute('src', './subcontractor.html');
    iframe.className = 'subcontractor';
    iframeIdx.push({iframe, instance: this});
    
    $('#operate').appendChild(iframe);
  }

  /** 
   * "ready for work"
   * "have a result" 
   */
  exports.SubcontractorManager.receiveMessage = async function SubcontractorManage$$receiveMessage(message)
  {
    var bankPk = await this.bankKs.getPrivateKey();

    switch(message.type)
    {
      case 'ready': /* ready? send down the job and a way to pay for it */
      this.sendMessage({
        cmd:        'job',
        jobDetails: this.jobDetails,
        slices:     this.slices,
        bankPkStr:  bankPk.toString(),
        localExec:  this.localExec,
      });
      break;
      case 'result':
        alert('result: ' + JSON.stringify(message));
      break;
    }
  }
});
