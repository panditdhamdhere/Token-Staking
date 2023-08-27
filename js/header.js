const _NETWORK_ID = 80001;
let SELECT_CONTRACT = {};

SELECT_CONTRACT[_NETWORK_ID] = {
  network_name: "Polygon Mumbai",
  explorer_url: "https://mumbai.polygonscan.com/",
  STAKING: {
    // 0x45dger5er354gre35gtr35
    sevenDays: {
      address: "0x51168d2D1B935932959Bd7617892a5C1DB7Fb0AA",
    },
    tenDays: {
      address: "0x6dfd4cfdb46fcd4df3fc6563cf6d5",
    },
    thirtyTwoDays: {
      address: "0x86rdg68rgv844g5d56g84dg5dg564dg",
    },
    ninetyDays: {
      address: "0xecf14ed4524fd215rd5rfg45dcddce",
    },
    abi: [],
  },

  // 0xlvrg356fcv;bdd65df6d65cdc

  TOKEN: {
    symbol: "PDC",
    address: "0x5dcv5c43dsc53cdcv51cd54s53cs534dcsv53vcd",
    abi: [],
  },
};

// countdown global
let countDownGloal;

// wallet connection
let web3;
let oContractToken;
let contractCall = "sevenDays";
let currentAddress;
let web3Main = new Web3("https://rpc.ankr.com/polygon_mumbai");

// Create an instance of notyf
var notyt = new Notyf({
  duration: 3000,
  position: { x: "right", y: "bottom" },
});
