# Google URL Scraper Extension

A Chrome extension that scrapes URLs from any webpage, with a focus on Google search results.

## Features

-   Automatically scrapes all URLs from the current webpage
-   Clean interface to view all scraped URLs
-   One-click copy of all URLs to clipboard
-   Filters out Google's internal links and duplicates

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing these files
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Navigate to any webpage (works best with Google search results)
2. Click the extension icon in your toolbar
3. View all scraped URLs in the popup window
4. Click "Copy All URLs" to copy the list to your clipboard

## Files

-   `manifest.json`: Extension configuration
-   `popup.html`: Extension popup interface
-   `popup.js`: Popup functionality
-   `content.js`: URL scraping logic

## Note

You'll need to add your own icon files in the `icons` directory with the following sizes:

-   `icon16.png` (16x16)
-   `icon48.png` (48x48)
-   `icon128.png` (128x128)
