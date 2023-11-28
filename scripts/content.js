// Function to simulate a click on the "Done" button
function clickDoneButton(id) {
    const doneButton = document.querySelector('button[aria-label="Done"]');
    if (doneButton) {
        doneButton.click();
    }
    // Close the tab after a 2-second delay
    setTimeout(function () {
        console.log("Sending message to close the tab :", id)
        chrome.runtime.sendMessage({ command: "closeTab"});
    }, 2000); // 2000 milliseconds (2 seconds) delay
}

console.log("Content script loaded");

// Execute the tip when receiving the executeTip command
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("received message from", sender.tab, sender.tabId);
    if (request.command === "executeTip") {
        console.log("Button was pressed! Tip received")
        clickDoneButton(sender.tabId);
    }
});


// Create a connection between the background script and content scripts
const port = chrome.runtime.connect({ name: "content-script" });

// Listen for messages from content scripts
chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name === "content-script");

    // Handle messages from content scripts
    port.onMessage.addListener((msg) => {
        console.log("received message:", msg);
        if (msg.command === "executeTip") {
            console.log("Button was pressed! Tip received");
            clickDoneButton(port.sender.tab.id);
        }
    });
});