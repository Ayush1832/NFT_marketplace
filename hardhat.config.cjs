require("dotenv").config(); 
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-verify");


module.exports = {
  solidity: "0.8.20",
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [`${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy:`f63f5561-5a98-4371-adfd-fc7c0643df0f`,
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://www.oklink.com/api/explorer/v1/contract/verify/async/api/polygonAmoy",
          browserURL: "https://www.oklink.com/polygonAmoy"
        },
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
