# WebExtensions SearchEngines API Proposal by Geoffrey De Belie (Smile4ever)

This project contains the experimental implementation of the Firefox browser.searchengines API. Currently the implementation is read-only.

See
* https://bugzilla.mozilla.org/show_bug.cgi?id=1352598 Add an API to list installed search engines
* https://bugzilla.mozilla.org/show_bug.cgi?id=1268401 Add APIs to manage search engines for the web search bar/location bar

for more details.

This proposal has been based on several sources, the most important sources being:

* https://github.com/web-ext-experiments/logins (for this README and a great deal of the boilerplate code)
* https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsISearchEngine
* https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIBrowserSearchService

## Background

The search engines in Firefox are available to legacy (XUL) addons. This document is a proposal for offering a similar API for webextensions.

The XPCOM object on which the search engines are built is nsIBrowserSearchService.

## Proposal

This section details a proposed WebExtensions API for accessing the installed search engines. It is broken into a few high-level sections:

### Permissions

As with most existing WebExtensions APIs, this API will have a new top-level permission, “searchengines”. That is, the functions outlined below will not appear in an extension’s browser namespace unless the “searchengines” permission is included in the extension manifest. In this way, a user who installs an extension that uses this API can be offered a prompt (either at install time or at use time, see https://github.com/mozilla/addons/issues/51 for that debate) with a message such as “This extension may access your search engines, do you want to proceed?”.

### SearchEngine objects

The underlying XPCOM interface that is used by this experiment is nsIBrowserSearchService. Native nsIBrowserSearchService instances will not be exposed directly to WebExtensions, but these objects are accurately represented by simple javascript objects with the following properties, each of which is of type string (or null if not applicable):

Field name | Description
--- | ---
name | Search engine name
keyword | Search keyword (probably a letter like g or a word like google)
description | Description of the search engine
searchUrl | Search URL
icon | A base64 icon URI or a URI to an icon file

### API methods

The methods provided by this API will be in the browser.searchengines namespace. Note that, unlike nearly all other existing WebExtensions interfaces, this is a brand-new interface, so there is no need to includes these methods in the chrome namespace for compatibility.

The methods under browser.searchengines are:

Method Name | Description
--- | ---
`list(filter)` | Search for installed search engines. The filter parameter is a javascript object containing any of the properties from a SearchEngineFilter object. This method returns a promise that resolves to an array of SearchEngine objects. Note that if filter is an empty object, then all records will trivially match so all records that match the extension’s host permissions will be returned.<br>Example use (inside an async Task):<br> ```let info = yield browser.searchengines.list({name: “Google”});```
`getDefaultEngine(filter)` | Search for the default search engine.<br>Example use (inside an async Task):<br> ```let info = yield browser.searchengines.getDefaultEngine();```