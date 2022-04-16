pragma solidity >=0.4.22 <0.8.0;

contract Parking {
    struct Spot {
        uint256 id;
        bool isAvailable;
    }

    mapping(uint256 => Spot) public spots;

    mapping(address => bool) public guardians;

    uint256 public spotsCount;
    event toggledEvent(uint256 indexed _spotId);

    function addSpot(uint num) private {
        spotsCount++;
        spots[spotsCount] = Spot(num, true);
    }

    constructor() public{
        for(uint i = 1; i <= 20; i++){
            addSpot(i);
        }
    }

    function toggle(uint256 _spotId) public {
        // require a valid spot
        // require(!guardians[msg.sender]);
        require(_spotId > 0 && _spotId <= spotsCount);

        guardians[msg.sender] =  true;
        // record that spot has been reserved or freedup
        spots[_spotId].isAvailable = !spots[_spotId].isAvailable;
        emit toggledEvent(_spotId);
    }

}
