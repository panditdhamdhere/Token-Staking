async function commonProviderDetector(_provider) {
  if (_provider == "metamask_wallet") {
    if (window.ethereum && window.ethereum.providers) {
      const metamaskProvider = window.ethereum.providers.find(
        (provider) => provider.isMetaMask
      );

      if (metamaskProvider) {
        window.ethereum.providers = [metamaskProvider];
        return await commonInjectedConnect(metamaskProvider, _provider);
      } else {
        console.log("metamask wallet not found");

        window.open("https://metamask.io/download/", "_blank").focus();

        return false;
      }
    } else if (window.ethereum) {
      return await commonInjectedConnect(window.ethereum, _provider);
    } else {
      console.log("metamask wallet not found");

      try {
        window.open("https://metamask.io/download/", "_blank").focus();
      } catch (error) {}
      return false;
    }
  }
}

async function commonInjectedConnect(_provider, _provider_name) {
  await _provider.enable();

  setWeb3Events(_provider);

  web3 = new Web3(_provider);

  // get connected chain id from Ethereum node
  let currentNetworkId = await web3.eth.getChainId();
  currentNetworkId = currentNetworkId.toString();
  console.log("network", currentNetworkId);

  const accounts = await web3.eth.getAccounts();

  console.log("-> accounts");
  console.log(accounts);

  currentAddress = accounts[0].toLowerCase();

  if (currentNetworkId != _NETWORK_ID) {
    notyf.error(
      `Please connect Wallet on ${SELECT_CONTRACT[_NETWORK_ID]._provider_name}!`
    );
    return false;
  }
  oContractToken = new web3.eth.Contract(
    SELECT_CONTRACT[_NETWORK_ID].TOKEN.abi,
    SELECT_CONTRACT[_NETWORK_ID].TOKEN.address
  );

  return true;
}

function setWeb3Events(_provider) {
  _provider.on("accountsChanged", (accounts) => {
    console.log(accounts);
    if (!accounts.length) {
      logout();
    } else {
      currentAddress = accounts[0];
      let sClass = getSelectedTab();
    }
  });

  // Subscribe to chainId change
  _provider.on("chainChanged", (chainId) => {
    console.log(chainId);
    logout();
  });

  // Subscribe to session connection
  _provider.on("connect", () => {
    console.log("connect");
    logout();
  });

  // subscribe to session disconnection
  _provider.on("disconnect", (code, reason) => {
    console.log(code, reason);
    localStorage.clear();
    logout();
  });
}

function logout() {
  window.location.reload();
}

function addDecimal(num, nDec) {
  const aNum = `${num}`.split(".");
  if (aNum[1]) {
    if (aNum[1].length > nDec) aNum[1] = aNum[1].slice(0, nDec);
    return aNum[0] + aNum[1] + "0".repeat(nDec - aNum[1].length);
  }
  return aNum[0] + "0".repeat(nDec);
}

function formatEthErrorMsg(error) {
  try {
    var eForm = error.message.indexOf("{");
    var eTo = error.message.lastIndexOf("}");
    var eM1 = error.message.indexOf("TokenStaking: ");
    var eM2 = error.message.indexOf("ERC20 ");
    var eM4 = error.message.indexOf("Internal JSON-RPC error");

    if (eForm != -1 && eTo != -1 && (eM1 != -1 || eM2 != -1)) {
      var eMsgTemp = JSON.parse(error.message.substr(eForm, eTo));
      var eMsg = eM4 != -1 ? eMsgTemp.message : eMsgTemp.originalError.message;

      if (eM1 != -1) {
        return eMsg.split("TokenStaking ")[1];
      } else {
        return eMsg.spilt("ERC20 : ")[1];
      }
    } else {
      return error.message;
    }
  } catch (e) {
    console.log(e);
    return "Something went wrong!";
  }
}

function getSelectedTab(sClass) {
  console.log(sClass);
  return sClass || contractCall;
}

function getContractObj(sClass) {
  return new web3.eth.Contract(
    SELECT_CONTRACT[_NETWORK_ID].STAKING.abi,
    SELECT_CONTRACT[_NETWORK_ID].STAKING[sClass].address
  );
}
