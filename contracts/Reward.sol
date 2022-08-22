// File contracts/IERC20.sol
pragma solidity ^0.8.0;

import "./IERC20.sol";
contract Reward {

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */

    address public manager;
    address public rewardToken;

    mapping(address => bool) public auth;
    mapping(address => uint256) public rewards;

    function initialize() public{

    }
    modifier onlyManager() {
        require(msg.sender == manager,"Not manager");
        _;
    }
    function setManager(address _manager) public {
        if(manager != address(0)){
            require(msg.sender == manager,"Not manager");
        }

        manager = _manager;
    }

    function setRewardToken(address _tokenAddress) public onlyManager{
        rewardToken = _tokenAddress;
    }

    function getManager() public returns (address) {
        return manager;
    }

    function setClaimReward(address owner,uint256 amount) public onlyManager {
        auth[owner] = true;
        rewards[owner] = amount;
    }

    function getClaimPermission(address owner) public returns (bool) {
        return auth[owner];
    }

    function getGrantReward(address owner) public returns (uint256) {
        return rewards[owner];
    }

    function claimReward() public{
        address claimer = msg.sender;
        require(auth[claimer], "No Claim Permission");
        IERC20(rewardToken).transfer(claimer, rewards[claimer]);
        auth[claimer] = false;
        rewards[claimer] = 0;
    }

}