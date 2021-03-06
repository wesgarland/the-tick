'use strict';

module.declare((require, exports, module) => {
  const wallet = require('dcp/wallet');

  var iframeIdx = [];

  /* jQuery, the good parts */
  function $(s) {
    return document.querySelector(s);
  }

  /* Receive messages sent to this window, figure out which iframe they 
   * came from, and relay to the receiveMessage handler in the correct
   * instance of SubcontractorManager
   */
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
  });

  /** 
   * @constructor
   * Manages an iframe which is running subcontractor.html / subcontractor.js.
   */
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
   * ready -> ready for wo
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
        slicesJSON: JSON.stringify(this.slices),
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
