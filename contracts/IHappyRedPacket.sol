// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHappyRedPacket {
    function setManager(address) external;

    function setRewardToken(address) external;

    function getManager() external view returns (address);

    function setClaimReward(address,uint256) external;

    function getClaimPermission(address) external view returns (bool);

    function grantReward(address, uint256) external;

    function getGrantReward(address) external view returns (uint256);

    function claimReward() external;

    function create_red_packet (bytes32 , uint , bool , uint , 
                                bytes32 , string memory, string memory, 
                                uint, address , uint ) external;

    function refund(bytes32) external;

    function check_availability(bytes32) external view returns ( address, uint, uint, 
                                                                    uint , bool , uint256); 

    function claim(bytes32 , bytes32[] memory , address payable) external returns (uint);
}