
const helpButton = document.querySelector(".help-page");
if (helpButton) {
  helpButton.addEventListener("click", (e) => {
    const url = chrome.runtime.getURL("/html/hello.html");
    chrome.tabs.create({ url });
    window.close();
  });
}

const inputColor = document.querySelector(".input-color");
const buttonColor = document.querySelector(".color-button");
const deleteButton = document.querySelector(".delete-color-button");
let dyslexicBtn = document.querySelector('#dyslexicFriendly');
let readableBtn = document.querySelector('#readableFont');
let zoomBtn = document.querySelector('#zoom');

if (buttonColor) {
  buttonColor.addEventListener("click", async (e) => {
    const background = inputColor.value;
    chrome.tabs.update({}, async (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (color) => {
          const body = document.querySelector("body");
          let hasBackupStyle = body.hasAttribute("backup-style");
          let hasStyle = body.hasAttribute("style");
          let style = body.getAttribute("style");
          let backupStyle = body.getAttribute("backup-style");
          if (!hasBackupStyle) {
            if (hasStyle) {
              body.setAttribute("backup-style", style);
            } else {
              body.setAttribute("backup-style", "");
            }
          }

          if (color.trim() === "") {
            backupStyle = body.getAttribute("backup-style");
            if (backupStyle) {
              body.setAttribute("style", backupStyle);
            } else {
              body.removeAttribute("style");
            }
          } else {
            if (backupStyle) {
              body.setAttribute("style", `${backupStyle}; background-color: ${color} !important;`);
            } else {
              body.setAttribute("style", `background-color: ${color} !important;`);
            }
          }
        },
        args: [background],
      });
    });
  });
}

deleteButton.addEventListener("click", async (e) => {
  chrome.tabs.update({}, async (tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const body = document.querySelector("body");
        let hasBackupStyle = body.hasAttribute("backup-style");
        let hasStyle = body.hasAttribute("style");
        let style = body.getAttribute("style");
        let backupStyle = body.getAttribute("backup-style");
        if (hasBackupStyle) {
          body.setAttribute("style", backupStyle);
          body.removeAttribute("backup-style");
        } else {
          if (hasStyle) {
            body.removeAttribute("style");
          }
        }
      },
    });
  });
});

dyslexicBtn.addEventListener('change', (event) => {
  options.dyslexicBtn = event.target.checked;
  chrome.storage.session.set({options});
  console.log("clicked");
});

dyslexicBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // Find the current tab
  if (dyslexicBtn.checked) {
    // we want to make it into a friendly font
    chrome.scripting.executeScript({
      // Run the following script on our tab
      target: { tabId: tab.id },
      function: () => {
        let elems = document.querySelectorAll("*"); // Grab every element in the DOM
        for (var i = 0; i < elems.length; i++) {
          let currentStyles = elems[i].style.fontFamily;
          if (currentStyles.length === 2 || currentStyles.length === 0) {
            elems[i].style.fontFamily = "Comic Sans MS" + elems[i].style.fontFamily;
          } else {
            elems[i].style.fontFamily = "Comic Sans MS, " + elems[i].style.fontFamily;
          }
        }
      },
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        let elems = document.querySelectorAll("*");
        for (var i = 0; i < elems.length; i++) {
          let currentStyles = elems[i].style.fontFamily;
          let newStyles = currentStyles.replace(/Comic Sans MS, /g, '').replace(/Comic Sans MS/g, '');

          if (newStyles.length === 2) {
            elems[i].style.fontFamily = null;
          } else {
            elems[i].style.fontFamily = newStyles;
          }
        }
      },
    });
  }
});

readableBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); // Find the current tab
  if (readableBtn.checked) {
    // we want to make it into a friendly font
    chrome.scripting.executeScript({
      // Run the following script on our tab
      target: { tabId: tab.id },
      function: () => {
        let elems = document.querySelectorAll("*"); // Grab every element in the DOM
        for (var i = 0; i < elems.length; i++) {
          let currentStyles = elems[i].style.fontFamily;
          if (currentStyles.length === 2 || currentStyles.length === 0) {
            elems[i].style.fontFamily = "Verdana" + elems[i].style.fontFamily;
          } else {
            elems[i].style.fontFamily = "Verdana, " + elems[i].style.fontFamily;
          }
        }
      },
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        let elems = document.querySelectorAll("*");
        for (var i = 0; i < elems.length; i++) {
          let currentStyles = elems[i].style.fontFamily;
          let newStyles = currentStyles.replace(/Verdana, /g, '').replace(/Verdana/g, '');

          if (newStyles.length === 2) {
            elems[i].style.fontFamily = null;
          } else {
            elems[i].style.fontFamily = newStyles;
          }
        }
      },
    });
  }
});

//zoom in current tab
zoomBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (zoomBtn.checked) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        let elems = document.querySelectorAll("*"); // Выбираем все элементы в DOM
        for (let i = 0; i < elems.length; i++) {
          elems[i].style.zoom = "1.05"; // Увеличиваем размер элемента в 1.5 раза
        }
      },
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        let elems = document.querySelectorAll("*");
        for (let i = 0; i < elems.length; i++) {
          elems[i].style.zoom = "1";
        }
      },
    });
  }
});

//inverse colors #inverseColors
let inverseColors = document.querySelector("#inverseColors");
inverseColors.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (inverseColors.checked) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        let elems = document.querySelectorAll("*");
        for (let i = 0; i < elems.length; i++) {
          elems[i].style.filter = "invert(100%)";
        }
      },
    });
  } else {
    //reload a page
    chrome.tabs.reload(tab.id);

  }
});

//grayscale #grayscale
let grayscale = document.querySelector("#grayscale");
grayscale.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (grayscale.checked) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        let elems = document.querySelectorAll("*");
        for (let i = 0; i < elems.length; i++) {
          elems[i].style.filter = "grayscale(100%)";
        }
      },
    });
  } else {
    //reload a page
    chrome.tabs.reload(tab.id);
  }
});

//bigger font #biggerFont
let biggerFont = document.querySelector("#biggerFont");
biggerFont.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (biggerFont.checked) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        let elems = document.querySelectorAll("*");
        for (let i = 0; i < elems.length; i++) {
          elems[i].style.fontSize = "1.05em";
        }
      },
    });
  } else {
    //cancel bigger font
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        let elems = document.querySelectorAll("*");
        for (let i = 0; i < elems.length; i++) {
          elems[i].style.fontSize = "1em";
        }
      },
    });
  }
});