
//open hello.html on install extension
chrome.runtime.onInstalled.addListener(async () => {
    //get url of hello.html
    let url = chrome.runtime.getURL("html/hello.html");
    //open new tab with hello.html
    let tab = await chrome.tabs.create({ url });
  });

  
  