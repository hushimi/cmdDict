function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}


function render(filename, argsObj) {
  let page = HtmlService.createTemplateFromFile(filename)
  
  if(argsObj) {
    let keys = Object.keys(argsObj)
    keys.map(key => page[key] = argsObj[key])
  }
  
  let output = page.evaluate()
  
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  output.addMetaTag('viewport', 'width=device-width, initial-scale=1')
  output.setTitle("cmd_dict")
  return output
}


function getUrl() {
  return ScriptApp.getService().getUrl()
}


function escapeHtml(string) {
  if(typeof string !== 'string') {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function(match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match]
  });
}