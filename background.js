// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Simple extension to replace lolcat images from
// http://icanhascheezburger.com/ with loldog images instead.

var unpaid = [];

var supportedFormat = 'bitcoin-nanopayment';

// todo: make this cooler
var showError = function(message) {
  console.log(message);
};

chrome.webRequest.onHeadersReceived.addListener(
  function(info) {
    var status = info.statusLine.split(' ')[1];

    if (status !== '402') {
      return;
    }

    // Assemble dict of headers
    var headers = {}
    for (var i in info.responseHeaders) {
      var header = info.responseHeaders[i];
      headers[header.name] = header.value;
    }

    // Check if the server accepts our payment format
    {
      var header = headers['Accept-Payment'];
      if (typeof header === 'undefined') {
        showError("server didn't send an Accept-Payment header");
        return;
      }

      // Loop through all payment methods
      var supported = false;
      var accepted = header.split(',');
      for (var j in accepted) {
        var format = accepted[j].split(';')[0].trim();
        if (format === supportedFormat) {
          supported = true;
          break;
        }
      }

      if (!supported) {
        showError('format not supported. Accept-Payment header is: ' + header.value);
        return;
      }
    }

    var destinationAddress = headers['Payment-Destination-Address'];

    var targetSerialized = headers['Payment-Target'];

    if (info.type != 'main_frame') {
      showError("this extension doesn't support paying for embedded content or ajax requests yet");
      return;
    }

    console.log('can pay for this page: ', info.url);
    console.log(info);

    chrome.storage.local.set({'singleton': {'url': info.url, 'targetSerialized': targetSerialized, 'destinationAddress': destinationAddress}});

//    chrome.pageAction.hide(info.tabId);
    chrome.pageAction.show(info.tabId);
//    chrome.browserAction.setIcon({'path': 'icon-go.png'});

  //  chrome.browserAction.setPopup({'tabId': info.tabId, 'popup': 'HELLO'});

    var span = $('<span class="payment"/>').text(info.tabId);
    $(document.body).append(span);

    //    console.log("Cat intercepted: " + info.url);
    // Redirect the lolcal request to a random loldog URL.
    //  var i = Math.round(Math.random() * loldogs.length);
  },
  // filters
  {
    urls: [
      "<all_urls>"
    ]
  },
  // extraInfoSpec
  // blcoking can go here if we need it
  ["responseHeaders"]
);
