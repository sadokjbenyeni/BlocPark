
pragma solidity 0.5.16;

contract Parking {

    struct Spot{
        uint id;
        bool isAvailable;
        string carSerialNumber;
        uint modificationDate;
    }

    mapping(uint => Spot) public spots;

    uint public spotsCount;

    function addSpot () private {
        spotsCount ++;
        spots[spotsCount] = Spot(spotsCount, false, '', now);
    }

    function parking () private {
        while(spotsCount <= 20){
            addSpot();
        }
    }

}