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
        
        var nanoClient = new rpcClient({
          rpc: {
            'host': 'localhost',
            'port': 3000
          }
        });

        console.log('made a client');

        nanoClient.getAccount('add', 'private', function(err, account) {
          if (err) {
            console.log(err);
            return;
          }

          console.log('got account', account);
          account.createVoucher(value.singleton.destinationAddress, value.singleton.targetSerialized, function(err, transactionHex) {
            if (err) {
              console.log(err);
              return;
            }
            console.log(transactionHex);
          });
        });
      });
    });
  });
});

