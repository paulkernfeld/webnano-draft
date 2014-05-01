define(["./jayson-full"], function (jaysonDoesntReturnAnything) {
  console.log(new Jayson());

  return function(clientConfig) {
    var client = new Jayson({
      url: 'http://' + clientConfig.rpc.host + ':' + clientConfig.rpc.port
    });

    var Account = function(address, privateKey) {
      this.address = address;

      // This method has the same contract as the one in 'bitcoin-nanopayment.js'
      this.requestVoucher = function(inverseProbability, fromAddress, cb) {
        client.request('requestVoucher', [address, inverseProbability, fromAddress], null, function(err, error, response) {
          if(err) {
            cb(err);
            return;
          }
          if(error) {
            cb(error);
            return;
          }
          cb(null, response);
        });
      };

      // This method has the same contract as the one in 'bitcoin-nanopayment.js'
      this.createVoucher = function(destinationAddress, targetSerialized, cb) {
        client.request('createVoucher', [address, destinationAddress, targetSerialized], null, function(err, error, response) {
          if(err) {
            cb(err);
            return;
          }
          if(error) {
            cb(error);
            return;
          }
          cb(null, response);
        });
      };

      // This method has the same contract as the one in 'bitcoin-nanopayment.js'
      this.cashVoucher = function(transactionHex, cb) {
        client.request('cashVoucher', [address, transactionHex], null, function(err, error, response) {
          if(err) {
            cb(err);
            return;
          }
          if(error) {
            cb(error);
            return;
          }
          cb(null, response);
        });
      };
    };

    // This method has the same contract as the one in 'bitcoin-nanopayment.js'
    this.getAccount = function(address, privateKey, cb) {
      // Wait for a client to be created on the server create a client
      client.request('createAccount', [address, privateKey], null, function(err, error, response) {
        if(err) {
          cb(err);
          return;
        }
        if(error) {
          cb(error);
          return;
        }
        
        var account = new Account(address, privateKey);
        cb(null, account);
      });
    };
  };
});
