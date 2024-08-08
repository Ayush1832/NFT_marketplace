
const { ethers, run } = require("hardhat");

async function main() {
 
  const NFT = await ethers.getContractFactory("NFT");
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");

  // Deployying nft
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);

  // Deploying NFTMarketplace
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();
  console.log("NFTMarketplace deployed to:", nftMarketplace.address);

  // Verifying  NFT contract
  await run("verify:verify", {
    address: nft.address,
    constructorArguments: [],
  });

 // Verifying Marketplace
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
