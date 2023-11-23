// Function to simulate a click on the "Done" button
function clickDoneButton(id) {
    const doneButton = document.querySelector('button[aria-label="Done"]');
    if (doneButton) {
        doneButton.click();
    }
    // Close the tab after a 2-second delay
    setTimeout(function () {
        chrome.runtime.sendMessage({ command: "closeTab", tabId: id });
    }, 2000); // 2000 milliseconds (2 seconds) delay
}

console.log("Content script loaded");

// Execute the tip when receiving the executeTip command
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab, sender.tabId);
    if (request.command === "executeTip") {
        console.log("Button was pressed! Tip received")
        clickDoneButton(sender.tabId);
    }
});
