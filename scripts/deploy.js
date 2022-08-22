// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = hre.ethers.utils.parseEther("1");

  const [admin,user1] = await ethers.getSigners();
  console.log("admin: ",admin.address);
  console.log("user1: ",user1.address);

  // Deploy ERC20 TOken
  const simpleTokenFactory = await hre.ethers.getContractFactory("SimpleToken");
  const simpleToken = await simpleTokenFactory.deploy("DL","DL",1,100000000);
  await simpleToken.deployed();

  console.log(
    `SimpleToken deployed to ${simpleToken.address}`
  );

  // Deploy Contract Reward
  const rewardFactory = await hre.ethers.getContractFactory("HappyRedPacket");
  const reward = await rewardFactory.deploy();
  await reward.deployed();

  console.log(
    `Reward deployed to ${reward.address}`
  );

  // Deploy Contract proxyAdmin
  const proxyAdminFactory = await hre.ethers.getContractFactory("ProxyAdmin");
  const proxyAdmin = await proxyAdminFactory.deploy();
  await proxyAdmin.deployed();

  console.log(
    `ProxyAdmin deployed to ${proxyAdmin.address}`
  );


  // Deploy Contract proxy
  const transparentUpgradeableProxyFactory = await hre.ethers.getContractFactory("contracts/TransparentUpgradeableProxy.sol:TransparentUpgradeableProxy");
  const transparentUpgradeableProxy = await transparentUpgradeableProxyFactory.deploy(reward.address,proxyAdmin.address,"0x8129fc1c");
  await transparentUpgradeableProxy.deployed();

  console.log(
    `TransparentUpgradeableProxy deployed to ${transparentUpgradeableProxy.address}`
  );

  // Set manager address
  let artifactRouter = artifacts.readArtifactSync("IHappyRedPacket");
  let ireward = new ethers.Contract(transparentUpgradeableProxy.address, artifactRouter.abi , admin );

  let setAdminRecipt = await ireward.setManager(admin.address);
  await setAdminRecipt.wait();
  console.log("Set reward manager successfully");


  // Set ERC20 token address
  let setTokenAddressRecipt = await ireward.setRewardToken(simpleToken.address,{gasLimit: 900000000});
  await setTokenAddressRecipt.wait();
  console.log("Set ERC20 token address successfully");

  // Transfer ERR20 to proxy 
  let recipt = await simpleToken.transfer(transparentUpgradeableProxy.address,1000000,{gasLimit: 900000000});
  await recipt.wait();
  console.log("Transfer token successfully");

  recipt = await ireward.setClaimReward(user1.address,1000,{gasLimit: 900000000});
  await recipt.wait();
  console.log("Set claim reward successfully");

  let ireward_User1 = ireward.connect(user1);
  // check balance 
  let balance = await simpleToken.balanceOf(user1.address);
  console.log("Balance: ",balance);

  // claim reward
  recipt = await ireward_User1.claimReward();
  await recipt.wait();
  console.log("Claim reward successfully");

  balance = await simpleToken.balanceOf(user1.address);
  console.log("Balance: ",balance);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
