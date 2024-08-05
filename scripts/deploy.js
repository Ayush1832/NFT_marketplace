
const { ethers, run } = require("hardhat");

async function main() {
  // Get the contract factories
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");

  // Deploy NFT contract
  const myNFT = await MyNFT.deploy();
  await myNFT.deployed();
  console.log("MyNFT deployed to:", myNFT.address);

  // Deploy NFTMarketplace contract
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();
  console.log("NFTMarketplace deployed to:", nftMarketplace.address);

  // Verify contracts
  await run("verify:verify", {
    address: myNFT.address,
    constructorArguments: [],
  });

  await run("verify:verify", {
    address: nftMarketplace.address,
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
