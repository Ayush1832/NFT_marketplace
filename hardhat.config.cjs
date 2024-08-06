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
      accounts: [`650fe80b3e56248ba2dad4a2331faeb2413fa45df68e37c8b4d16af967cd6cdd`]
    }
  },
  etherscan: {
    apiKey: "9AMUIR461QWPW38VCEWX9QEQ17IJWECXZD"
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
