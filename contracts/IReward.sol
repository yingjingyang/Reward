// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReward {
    function setManager(address) external;

    function setRewardToken(address) external;

    function getManager() external view returns (address);

    function setClaimReward(address,uint256) external;

    function getClaimPermission(address) external view returns (bool);

    function grantReward(address, uint256) external;

    function getGrantReward(address) external view returns (uint256);

    function claimReward() external;
}