document.addEventListener("DOMContentLoaded", function () {
    const urlList = document.getElementById("urlList");
    const copyButton = document.getElementById("copyUrls");
    const clearButton = document.getElementById("clearUrls");
    const autoNextButton = document.getElementById("autoNextPage");
    const urlCountSpan = document.getElementById("urlCount");
    let isAutoNavigating = false;

    function updateUrlCount(count) {
        urlCountSpan.textContent = `(${count})`;
    }

    function fetchUrls() {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                const currentTab = tabs[0];

                // First check if we can access the current tab
                if (
                    !currentTab ||
                    !currentTab.url ||
                    !currentTab.url.startsWith("http")
                ) {
                    urlList.innerHTML =
                        "<p>Extension only works on web pages.</p>";
                    updateUrlCount(0);
                    return;
                }

                // Try to get URLs from storage first
                chrome.storage.local.get(["scrapedUrls"], (result) => {
                    const storedUrls = result.scrapedUrls || [];

                    // Display stored URLs immediately
                    if (storedUrls.length > 0) {
                        displayUrls(storedUrls);
                        updateUrlCount(storedUrls.length);
                    }

                    // Then try to get fresh URLs from the page
                    chrome.tabs.sendMessage(
                        currentTab.id,
                        { action: "getUrls" },
                        function (response) {
                            if (chrome.runtime.lastError) {
                                // If there's an error but we have stored URLs, keep them displayed
                                if (storedUrls.length === 0) {
                                    urlList.innerHTML =
                                        "<p>Please refresh the page to start scraping URLs.</p>";
                                    updateUrlCount(0);
                                }
                                return;
                            }
                            if (response && response.urls) {
                                displayUrls(response.urls);
                                updateUrlCount(response.urls.length);
                            }
                        }
                    );
                });
            }
        );
    }

    // Initial fetch
    fetchUrls();

    // Auto-next page functionality
    autoNextButton.addEventListener("click", function () {
        if (isAutoNavigating) {
            isAutoNavigating = false;
            autoNextButton.textContent = "Auto-Next Page";
            autoNextButton.style.backgroundColor = "#28a745";
            return;
        }

        isAutoNavigating = true;
        autoNextButton.textContent = "Stop Auto-Next";
        autoNextButton.style.backgroundColor = "#dc3545";

        function navigateNext() {
            if (!isAutoNavigating) return;

            chrome.tabs.query(
                { active: true, currentWindow: true },
                function (tabs) {
                    if (!tabs[0]) return;

                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        { action: "goToNextPage" },
                        function (response) {
                            if (chrome.runtime.lastError) {
                                isAutoNavigating = false;
                                autoNextButton.textContent = "Auto-Next Page";
                                autoNextButton.style.backgroundColor =
                                    "#28a745";
                                return;
                            }
                            if (response && response.success) {
                                // Wait for page load and fetch new URLs
                                setTimeout(fetchUrls, 2000);
                                // Schedule next navigation
                                setTimeout(navigateNext, 3000);
                            } else {
                                isAutoNavigating = false;
                                autoNextButton.textContent = "Auto-Next Page";
                                autoNextButton.style.backgroundColor =
                                    "#28a745";
                            }
                        }
                    );
                }
            );
        }

        navigateNext();
    });

    // Clear button functionality
    clearButton.addEventListener("click", function () {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                if (!tabs[0]) return;

                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "clearUrls" },
                    function (response) {
                        if (chrome.runtime.lastError) {
                            // Clear storage directly if content script is not available
                            chrome.storage.local.set(
                                { scrapedUrls: [] },
                                () => {
                                    urlList.innerHTML =
                                        "<p>No URLs found on this page.</p>";
                                    updateUrlCount(0);
                                }
                            );
                            return;
                        }
                        if (response && response.success) {
                            urlList.innerHTML =
                                "<p>No URLs found on this page.</p>";
                            updateUrlCount(0);
                        }
                    }
                );
            }
        );
    });

    // Copy button functionality
    copyButton.addEventListener("click", function () {
        const urls = Array.from(urlList.getElementsByClassName("url-item"))
            .map((item) => item.textContent)
            .join("\n");

        if (urls.length > 0) {
            navigator.clipboard
                .writeText(urls)
                .then(() => {
                    copyButton.textContent = "Copied!";
                    setTimeout(() => {
                        copyButton.textContent = "Copy All URLs";
                    }, 2000);
                })
                .catch(() => {
                    copyButton.textContent = "Failed to copy";
                    setTimeout(() => {
                        copyButton.textContent = "Copy All URLs";
                    }, 2000);
                });
        }
    });
});

function displayUrls(urls) {
    const urlList = document.getElementById("urlList");
    urlList.innerHTML = "";

    if (!urls || urls.length === 0) {
        urlList.innerHTML = "<p>No URLs found on this page.</p>";
        return;
    }

    urls.forEach((url) => {
        const urlElement = document.createElement("div");
        urlElement.className = "url-item";
        urlElement.textContent = url;
        urlList.appendChild(urlElement);
    });
}
