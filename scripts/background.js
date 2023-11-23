// Define the content script logic outside of the event handler
function openNotificationTabs() {
    Array.from(document.getElementsByClassName('notifications-list-item'))
        .map(e => e.children[0])
        .map(e => e.children[0])
        .map(e => e.children[1].href)
        .forEach(e => setTimeout(function () { window.open(e, "_blank") }, 500));
}

// Automatically match the icon to the library beeing watched
function updateIcon(repoId) {
    // Extract repository name from repoId
    const [_, repoName] = repoId.split('/');
    // Set badge text and color based on the repository
    let iconPath = `assets/${repoName}.png`;
    // Set the badge text and background color
    // Fallback to default.png if the image does not exist
    try {
        // Set the badge text and background color
        chrome.action.setIcon({ path: { "16": iconPath } });
    } catch (error) {
        console.error(`Error setting icon: ${error}`);
        // Fallback to default.png
        chrome.action.setIcon({ path: { "16": "assets/default.png" } });
    }
}

chrome.action.setTitle({
    title: "Press `Alt + Space` to automatically press `done` and go to the previous notifications"
});
// Listen for changes in chrome.storage.sync to update the icon
chrome.storage.onChanged.addListener(function (changes, namespace) {
    // Check if 'repoId' has changed
    if (changes.repoId && namespace === 'sync') {
        const newRepoId = changes.repoId.newValue || 'huggingface/transformers';
        updateIcon(newRepoId);
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Received message:", message, "sender", sender, "tab id", message.tabId);
    if (message.command === "closeTab" && sender.tab.id) {
        chrome.tabs.remove(sender.tab.id, function() {
            if (chrome.runtime.lastError) {
                console.error("Error closing tab:", chrome.runtime.lastError);
            } else {
                console.log("Tab closed successfully");
            }
        });
    }
    // Return false or nothing to indicate that no response will be sent
    return false;
});

chrome.runtime.onInstalled.addListener(function () {
    console.log("GitHub Tip Extension installed.");
    // Set up keyboard shortcut using chrome.commands
    chrome.commands.onCommand.addListener(function (command) {
        if (command === "executeTip") {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // Switch to the next tab
                const currentTab = tabs[0];
                // Send a message to the content script to execute the tip
                console.log("Sending messages to the  :", currentTab.id)
                chrome.tabs.sendMessage(currentTab.id, { command: "executeTip" });
                console.log("Sent.")
                chrome.tabs.query({ windowId: currentTab.windowId }, function (allTabs) {
                    const nextTabIndex = (currentTab.index - 1) % allTabs.length;
                    chrome.tabs.update(allTabs[nextTabIndex].id, { active: true });
                });

            });
        }
    });
});


chrome.action.onClicked.addListener(function () {
    chrome.storage.sync.get(['repoId'], function (result) {
        const repoId = result.repoId || 'huggingface/transformers';
        chrome.tabs.query({ url: 'https://github.com/notifications?*query=repo%3*' }, function (tabs) {
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
                const [owner, repo] = repoId.split('/')
                chrome.tabs.create({ url: `https://github.com/notifications?query=repo%3A${owner}%2F${repo}` }, function (tab) {
                    if (chrome.runtime.lastError) {
                        console.error('Error creating tab:', chrome.runtime.lastError);
                        return;
                    }
                    console.log('New tab created. Executing content script...');
                    // Execute the content script in the newly created tab
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        function: openNotificationTabs,
                    }).then(() => console.log("Running the script"));
                });
            }
        });
    });
});