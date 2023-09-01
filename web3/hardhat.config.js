require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = "d40ee5d2b02ebd8499585b928cbbb2c63ca52472beb070a80bfb81d2be91882a";
const RPC_URL = "https://rpc.ankr.com/polygon_mumbai";
module.exports = {
  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {
      chainId: 80001,
    },
    polygon_mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
