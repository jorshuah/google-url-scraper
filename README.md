# Google URL Scraper Extension

A powerful Chrome extension that automatically scrapes and accumulates URLs from web pages, with special optimization for Google search results. The extension features automatic pagination, URL persistence, and a clean interface.

## Features

-   **Automatic URL Scraping**

    -   Scrapes all unique URLs from the current webpage
    -   Filters out internal links, JavaScript links, and duplicates
    -   Shows real-time URL count on the extension icon
    -   Works on any webpage, optimized for Google search results

-   **Auto-Navigation**

    -   "Auto-Next Page" feature for Google search results
    -   Automatically navigates through search result pages
    -   Accumulates URLs from all visited pages
    -   Can be stopped at any time

-   **URL Management**

    -   Persists URLs across page navigation
    -   Automatically resets when starting a new search
    -   Clear all URLs with one click
    -   Copy all collected URLs to clipboard
    -   Shows total unique URL count

-   **Smart Features**
    -   Badge counter shows total unique URLs
    -   Automatic duplicate removal
    -   Persists data between browser sessions
    -   Works offline with previously collected URLs

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked" and select the extension directory
5. The URL Scraper icon should appear in your Chrome toolbar

## Usage

### Basic Usage

1. Navigate to any webpage (especially Google search results)
2. Click the extension icon to see scraped URLs
3. URLs are automatically collected and displayed
4. Total URL count is shown on the extension icon

### Auto-Navigation

1. On Google search results, click "Auto-Next Page"
2. The extension will:
    - Automatically navigate through pages
    - Collect URLs from each page
    - Accumulate unique URLs
    - Stop when reaching the last page
3. Click "Stop Auto-Next" to halt navigation

### URL Management

-   **Copy URLs**: Click "Copy All URLs" to copy to clipboard
-   **Clear URLs**: Click "Clear All" to reset the collection
-   **New Search**: URLs automatically reset on new Google searches
-   **View Count**: Check the badge on the extension icon or counter in popup

## Technical Details

### Files

-   `manifest.json`: Extension configuration and permissions
-   `popup.html`: Extension popup interface
-   `popup.js`: Popup functionality and user interface logic
-   `content.js`: URL scraping and page interaction logic
-   `background.js`: Badge updates and background tasks
-   `icons/`: Extension icons in various sizes

### Permissions

-   `activeTab`: For accessing the current tab
-   `scripting`: For running scripts on pages
-   `storage`: For persisting URLs
-   `tabs`: For tab management

## Notes

-   The extension works best with Google search results but can scrape URLs from any webpage
-   URLs are stored locally and persist until cleared or a new search is started
-   The auto-navigation feature only works on Google search results pages
-   The extension icon shows a badge with the current number of unique URLs collected

## Troubleshooting

If URLs aren't being collected:

1. Refresh the current page
2. Make sure you're on a webpage (not a chrome:// page)
3. Check if the extension has necessary permissions
4. Try clearing and starting a new collection

## Privacy

-   All data is stored locally in your browser
-   No data is sent to external servers
-   URLs are only collected from pages you visit
-   You can clear collected data at any time
