// Define the content script logic outside of the event handler
function openNotificationTabs() {
    Array.from(document.getElementsByClassName('notifications-list-item'))
        .map(e => e.children[0])
        .map(e => e.children[0])
        .map(e => e.children[1].href)
        .forEach(e => setTimeout(function () { window.open(e, "_blank") }, 500));
}

chrome.action.onClicked.addListener(function () {
    chrome.tabs.query({ url: 'https://github.com/notifications*' }, function (tabs) {
        if (tabs.length > 0) {
            // If the tab is open, activate it
            console.log('GitHub notifications tab is already open. Activating...');
            chrome.tabs.update(tabs[0].id, { active: true }, function (updatedTab) {
                console.log('Executing content script...');
                // Execute the content script in the updated tab
                chrome.scripting.executeScript({
                    target: { tabId: updatedTab.id },
                    function: openNotificationTabs
                }).then(() => console.log("Running the script"));
            });
        } else {
            // If the tab is not open, create a new one
            console.log('GitHub notifications tab is not open. Creating a new tab...');
            chrome.tabs.create({ url: 'https://github.com/notifications?query=repo%3Ahuggingface%2Ftransformers' }, function (tab) {
                if (chrome.runtime.lastError) {
                    console.error('Error creating tab:', chrome.runtime.lastError);
                    return;
                }
                console.log('New tab created. Executing content script...');
                // Execute the content script in the newly created tab
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: openNotificationTabs
                }).then(() => console.log("Running the script"));
            });
        }
    });
});