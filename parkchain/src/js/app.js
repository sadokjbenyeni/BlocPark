App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      const ethEnabled = () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          return true;
        }
        return false;
      };
      if (!ethEnabled()) {
        alert(
          'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!'
        );
      }
      web3 = window.web3;
      App.web3Provider = web3.currentProvider;
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Parking.json", function (Parking) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Parking = TruffleContract(Parking);
      // Connect provider to interact with contract
      App.contracts.Parking.setProvider(App.web3Provider);
      App.listenForEvents();

      return App.render();
    });
  },

  listenForEvents: function () {
    App.contracts.Parking.deployed().then(function (instance) {
      instance.toggledEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: async () => {
    var parkingInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      App.account = accounts[0];
      $('#accountAddress').html('Your Account: ' + App.account);
    } catch (error) {
      if (error.code === 4001) {
        // User rejected request
      }
      console.log(error);
    }

    // Load contract data
    App.contracts.Parking.deployed()
      .then(function (instance) {
        parkingInstance = instance;
        return parkingInstance.spotsCount();
      })
      .then(async (spotsCount) => {
        const promise = [];
        for (var i = 1; i <= spotsCount; i++) {
          promise.push(parkingInstance.spots(i));
        }

        const spots = await Promise.all(promise);
        var spotsResults = $('#spotsResults');
        spotsResults.empty();

        var spotsSelect = $('#spotsSelect');
        spotsSelect.empty();

        for (var i = 0; i < spotsCount; i++) {
          var id = spots[i][0];
          var isAvailable = spots[i][1];

          // Render candidate Result
          var spotTemplate =
            '<tr><th>' +
            id +
            '</th><td>' +
            isAvailable +
            '</td></tr>';
          spotsResults.append(spotTemplate);

          // Render candidate ballot option
          var spotOption =
            "<option value='" + id + "' >" + isAvailable + '</ option>';
          spotsSelect.append(spotOption);
        }
        return parkingInstance.guardians(App.account);
      })
      .catch(function (error) {
        console.warn(error);
      });
  },

  toggleButton : function (id) {
    App.contracts.Parking.deployed().then(function (instance) {
      return instance.toggle(id, { from: App.account });
    }).then(function (result) {
      $("#content").hide();
      $("#loader").show();
    }).catch(function (err) {
      console.error(err);
    });
  }
};



$(function () {
  $(window).load(function () {
    App.init();
  });
});