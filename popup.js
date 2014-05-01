var bk = chrome.extension.getBackgroundPage();
console = bk.console;
console.log('mewoafljf');

var bkDoc = bk.document;


// Fill out the thingadoo properly
document.addEventListener('DOMContentLoaded', function () {

  require(["rpc-client"], function(rpcClient) {

    chrome.storage.local.get('singleton', function(value) { 
      console.log(value.singleton);
      
      //$(document).find('#amount').text(1.0 * value.singleton.amount / value.singleton.inverseProbability);
      
      var payButton = $(document).find('#pay');
      payButton.click(function() {
        payButton.prop('disabled', true);
        payButton.text('Initiating payment.');
        
        console.log('gonna make a client');
        
        // TODO make a config
        var nanoClient = new rpcClient({
          rpc: {
            'host': 'localhost',
            'port': 3000
          }
        });

        console.log('made a client');

        // TODO make this a config
        var address = 'n4azoZaLB2YXo5EH4oXAYbQGA3h4di2Zsz';
        var privateKey = 'cSxQsUNZLcHyiqP4h35wczxm6nTwWQmkQJWe9hxGJYwhhgHJZD4N';
          
        nanoClient.getAccount(address, privateKey, function(err, account) {
          if (err) {
            console.log(err);
            return;
          }

          console.log('got account', account);
          console.log('Payment info:', value.singleton);
          account.createVoucher(value.singleton.destinationAddress, value.singleton.targetSerialized, function(err, transactionHex) {
            if (err) {
              console.log('Error creating voucher', err);
              return;
            }
            console.log(transactionHex);
          });
        });
      });
    });
  });
});

