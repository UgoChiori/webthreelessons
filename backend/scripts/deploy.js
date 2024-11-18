const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const lockedAmount = ethers.utils.parseEther("0.1");
  
  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(lockedAmount);

  await lock.deployed();
  console.log("Lock deployed to:", lock.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
