// Initialize badge
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeBackgroundColor({ color: "#4285f4" });
    chrome.action.setBadgeText({ text: "0" });
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        // Get stored URLs and update badge
        chrome.storage.local.get(["scrapedUrls"], (result) => {
            const urls = result.scrapedUrls || [];
            chrome.action.setBadgeText({ text: urls.length.toString() });
        });
    }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateBadge") {
        chrome.action.setBadgeText({ text: request.count.toString() });
    }
    return true;
});
