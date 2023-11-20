// document.addEventListener('DOMContentLoaded', function () {
//   document.getElementById('openNotifications').addEventListener('click', function () {
//     // Check if the GitHub notifications tab is already open
//     chrome.tabs.query({ url: 'https://github.com/notifications*' }, function (tabs) {
//       if (tabs.length > 0) {
//         // If the tab is open, activate it
//         console.log('GitHub notifications tab is already open. Activating...');
//         chrome.tabs.update(tabs[0].id, { active: true });
//         chrome.tabs.executeScript(tabs[0].id, { file: 'contentScript.js' }, function (result) {
//           if (chrome.runtime.lastError) {
//             console.error('Error executing content script:', chrome.runtime.lastError);
//           } else {
//             console.log('Content script executed successfully.');
//           }
//         });
//       } else {
//         // If the tab is not open, create a new one
//         console.log('GitHub notifications tab is not open. Creating a new tab...');
//         chrome.tabs.create({ url: 'https://github.com/notifications?query=repo%3Ahuggingface%2Ftransformers' }, function (tab) {
//           console.log('New tab created. Executing content script...');
//           // Execute the content script in the newly created tab
//           chrome.tabs.executeScript(tab.id, { file: 'contentScript.js' }, function (result) {
//             if (chrome.runtime.lastError) {
//               console.error('Error executing content script:', chrome.runtime.lastError);
//             } else {
//               console.log('Content script executed successfully.');
//             }
//           });
//         });
//       }
//     });
//   });
// });
chrome.browserAction.onClicked.addListener(function () {
      chrome.tabs.query({ url: 'https://github.com/notifications*' }, function (tabs) {
      if (tabs.length > 0) {
        // If the tab is open, activate it
        console.log('GitHub notifications tab is already open. Activating...');
        chrome.tabs.update(tabs[0].id, { active: true });
        chrome.tabs.executeScript(tabs[0].id, { file: 'contentScript.js' }, function (result) {
          if (chrome.runtime.lastError) {
            console.error('Error executing content script:', chrome.runtime.lastError);
          } else {
            console.log('Content script executed successfully.');
          }
        });
      } else {
        // If the tab is not open, create a new one
        console.log('GitHub notifications tab is not open. Creating a new tab...');
        chrome.tabs.create({ url: 'https://github.com/notifications?query=repo%3Ahuggingface%2Ftransformers' }, function (tab) {
          console.log('New tab created. Executing content script...');
          // Execute the content script in the newly created tab
          chrome.tabs.executeScript(tab.id, { file: 'contentScript.js' }, function (result) {
            if (chrome.runtime.lastError) {
              console.error('Error executing content script:', chrome.runtime.lastError);
            } else {
              console.log('Content script executed successfully.');
            }
          });
        });
      }
    });
});