var Parking = artifacts.require("./Parking.sol");

contract("Parking", function(accounts) {
  var parkingInstance;

  it("initializes with 20 spots", function() {
    return Parking.deployed().then(function(instance) {
      return instance.spotsCount();
    }).then(function(count) {
      assert.equal(count, 20);
    });
  })

  it("it initializes the spots with the correct values", function() {
    return Parking.deployed().then(function(instance) {
        parkingInstance = instance;
      return parkingInstance.spots(1);
    }).then(function(spot) {
      assert.equal(spot[0], 1, "contains the correct id");
      assert.equal(spot[1], true, "contains the correct value");
      return parkingInstance.spots(2);
    }).then(function(spot) {
      assert.equal(spot[0], 2, "contains the correct id");
      assert.equal(spot[1], true, "contains the correct value");
    });
  });

  it("allows a usesr to toggle status", function() {
    return Parking.deployed().then(function(instance) {
      parkingInstance = instance;
      spotId = 1;
      return parkingInstance.toggle(spotId, { from: accounts[0] });
    }).then(function(){
        return parkingInstance.spots(1);
    }).then(function(spot) {
      assert.equal(spot[1], false, "parking status changed");
    })
  });

});