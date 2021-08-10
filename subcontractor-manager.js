module.declare((require, exports, module) => {
  var iframeIdx = [];

  function $(s) {
    return document.querySelector(s);
  }

  window.addEventListener('message', function(ev) {
    for (let entry of iframeIdx)
    {
      if (ev.source === entry.iframe.contentWindow)
      {
        exports.SubcontractorManager.receiveMessage.call(entry.instance, JSON.parse(ev.data));
        entry.instance.sendMessage = function SubcontractorManager$$sendMessage(message)
        {
          message = JSON.stringify(message);
          entry.iframe.contentWindow.postMessage(message, '*');
        }
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
   * "ready for slice" 
   * "here come results" 
   */
  exports.SubcontractorManager.receiveMessage = function SubcontractorManage$$receiveMessage(message)
  {
    console.log('MESSAGE', message, this);
    debugger;
    switch(message.type)
    {
      case 'ready':
      this.sendMessage({hooray: true});
      break;
    }
  }

});
