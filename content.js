// Function to extract URLs from Google search results
function extractUrls() {
    const urls = [];
    // Get all search result links
    const searchResults = document.querySelectorAll("a");

    searchResults.forEach((link) => {
        const href = link.href;
        // Filter out Google's internal links and empty URLs
        if (
            href &&
            !href.includes("google.com") &&
            !href.includes("javascript:") &&
            !href.startsWith("#") &&
            !href.includes("webcache.googleusercontent.com") &&
            !href.includes("chrome://") &&
            !href.includes("chrome-extension://")
        ) {
            urls.push(href);
        }
    });

    // Remove duplicates
    return [...new Set(urls)];
}

// Function to update badge via background script
function updateBadge(count) {
    chrome.runtime.sendMessage({
        action: "updateBadge",
        count: count,
    });
}

// Function to go to next page
function goToNextPage() {
    const nextButton = document.querySelector("#pnnext");
    if (nextButton) {
        nextButton.click();
        return true;
    }
    return false;
}

// Function to check if this is a new search
function isNewSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentQuery = urlParams.get("q");

    // Get the last search query from storage
    return new Promise((resolve) => {
        chrome.storage.local.get(["lastSearchQuery"], (result) => {
            const lastQuery = result.lastSearchQuery;
            // Update the last query
            chrome.storage.local.set({ lastSearchQuery: currentQuery });
            resolve(lastQuery !== currentQuery);
        });
    });
}

// Function to add new URLs to storage
function addNewUrls() {
    return new Promise((resolve) => {
        // Get current page URLs
        const newUrls = extractUrls();

        // Get existing URLs and combine with new ones
        chrome.storage.local.get(["scrapedUrls"], (result) => {
            const existingUrls = result.scrapedUrls || [];
            const combinedUrls = [...new Set([...existingUrls, ...newUrls])];

            // Store combined URLs
            chrome.storage.local.set({ scrapedUrls: combinedUrls }, () => {
                updateBadge(combinedUrls.length);
                resolve(combinedUrls);
            });
        });
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getUrls") {
        // Check if this is a new search
        isNewSearch().then((isNew) => {
            if (isNew) {
                // Clear stored URLs if this is a new search
                chrome.storage.local.set({ scrapedUrls: [] }, () => {
                    // After clearing, add new URLs
                    addNewUrls().then((urls) => {
                        sendResponse({ urls: urls });
                    });
                });
            } else {
                // Just add new URLs to existing ones
                addNewUrls().then((urls) => {
                    sendResponse({ urls: urls });
                });
            }
        });
        return true;
    } else if (request.action === "goToNextPage") {
        const hasNextPage = goToNextPage();
        sendResponse({ success: hasNextPage });
        return true;
    } else if (request.action === "clearUrls") {
        chrome.storage.local.set({ scrapedUrls: [] }, () => {
            updateBadge(0);
            sendResponse({ success: true });
        });
        return true;
    }
});

// Initialize when the content script loads
// Wait for page to be fully loaded
window.addEventListener("load", () => {
    // Small delay to ensure all content is loaded
    setTimeout(() => {
        addNewUrls();
    }, 1000);
});
