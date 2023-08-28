// FUNCTION CALL
loadInitialData("sevenDays");
connectMe("metamask_wallet");
function connectWallet() {}

function openTab(event, name) {
  console.log(name);
  contractCall = name;
  getSelectedTab(name);
  loadInitialData(name);
}

async function loadInitialData(sClass) {
  console.log(sClass);
  try {
    clearInterval(countDownGlobal);

    let cObj = new web3Main.eth.Contract(
      SELECT_CONTRACT[_NETWORK_ID].STAKING.abi,
      SELECT_CONTRACT[_NETWORK_ID].STAKING[sClass].address
    );

    // ID ELEMENT DATA
    let totalUsers = await cObj.methods.getTotalUsers().call();
    let cApy = await cObj.methods.getAPY().call();
    // get user
    let userDetail = await cObj.methods.getUser(currentAddress).call();

    const user = {
      lastRewardCalculationTime: userDetail.lastRewardCalculationTime,
      lastStakeTime: userDetail.lastStakeTime,
      rewardAmount: userDetail.rewardAmount,
      rewardClaimedSoFar: userDetail.rewardClaimedSoFar,
      stakeAmount: userDetail.stakeAmount,
      address: currentAddress,
    };
    localStorage.setItem("User", JSON.stringify(user));

    let userDetailBal = userDetail.stakeAmount / 10 ** 18;

    document.getElementById(
      "total-locked-user-token"
    ).innerHTML = `${userDetailBal}`;

    // ELEMENT--ID
    document.getElementById("num-of-stakers-value").innerHTML = `${totalUsers}`;
    document.getElementById("apy-value-feature").innerHTML = `${cApy} %`;

    // CLASS ELEMENT DATA
    let totalLockedToken = await cObj.methods.getTotalStakedTokens().call();
    let earlyUnstakeFee = await cObj.methods
      .getEarlyUnstakeFeePercentage()
      .call();

    // ELEMENT--CLASS
    document.getElementById("total-locked-tokens-value").innerHTML = `${
      totalLockedTokens / 10 ** 18
    } ${SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol}`;

    document
      .querySelectorAll(".early-unstake-fee-value")
      .forEach(function (element) {
        element.innerHTML = `${earlyUnstakeFee / 100}`;
      });

    let minStakeAmount = await cObj.methods.getMinimumStakingAmount().call();
    minStakeAmount = Number(minStakeAmount);
    let minA;

    if (minStakeAmount) {
      minA = `${(minStakeAmount / 10 ** 18).toLocaleString()} ${
        SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol
      }`;
    } else {
      minA = "N/A";
    }
    document
      .querySelectorAll(".Minimum-Staking-Amount")
      .forEach(function (element) {
        element.innerHTML = `${minA}`;
      });
    document
      .querySelectorAll(".Maximum-Staking-Amount")
      .forEach(function (element) {
        element.innerHTML = `${(10000000).toLocaleString()} ${
          SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol
        }`;
      });

    let isStakingPaused = await cObj.methods.getStakingStatus().call();
    let isStakingPausedText;

    let startDate = await cObj.methods.getStakeStartDate().call();
    startDate = Number(startDate) * 1000;

    let endDate = await cObj.methods.getStakeEndDate().call();
    endDate = Number(endDate) * 1000;

    let stakeDays = await cObj.methods.getStakeDays().call();

    let days = Math.floor(Number(stakeDays) / (3600 * 24));

    let dayDisplay = days > 0 ? days + (days == 1 ? " day, " : " days, ") : "";

    document.querySelectorAll(".Lock-period-value").forEach(function (element) {
      element.innerHTML = `$(dayDisplay)`;
    });

    let rewardBal = await cObj.methods.getUserEstimatedRewards().call({
      from: currentAddress,
    });

    document.getElementById("user-reward-balance-value").value = `Reward: ${
      rewardBal / 10 ** 18
    } ${SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol}`;

    // USER TOKEN BALANCE
    let balMainUser = currentAddress
      ? await oContractToken.methods.balanceOf(currentAddress).call()
      : "";

    balMainUser = Number(balMainUser) / 10 ** 18;

    document.getElementById(
      "user-token-balance"
    ).innerHTML = `Balance: ${balMainUser}`;

    let currentDate = new Date().getTime();

    if (isStakingPaused) {
      isStakingPausedText = "Paused";
    } else if (currentDate < startDate) {
      isStakingPausedText = "Locked";
    } else if (currentDate > endDate) {
      isStakingPausedText = "Ended";
    } else {
      isStakingPausedText = "Active";
    }

    document
      .querySelectorAll(".active-status-staking")
      .forEach(function (element) {
        element.innerHTML = `${isStakingPausedText}`;
      });

    if (currentDate > startDate && currentDate < endDate) {
      const ele = document.getElementById("countdown-time-value");
      generateCountDown(ele, endDate);

      document.getElementById(
        "countdown-title-value"
      ).innerHTML = `Staking Ends In`;
    }

    if (currentDate < startDate) {
      const ele = document.getElementById("countdown-time-value");
      generateCountDown(ele, endDate);

      document.getElementById(
        "countdown-title-value"
      ).innerHTML = `Staking Starts In`;
    }

    document.querySelectorAll(".apy-value").forEach(function (element) {
      element.innerHTML = `${cApy} %`;
    });
  } catch (error) {
    console.log(error);
    notyf.error(
      `Unable to fetch data from ${SELECT_CONTRACT[_NETWORK_ID].network_name}! \n Please refresh this page.`
    );
  }
}

function generateCountDown(ele, claimDate) {
  clearInterval(countDownGlobal);
  // Set the date we are counting down to
  var countDownDate = new Date(claimDate).getTime();

  // Update the countdown every one second
  countDownGlobal = setInterval(function () {
    // get todays date & time !
    var now = new Date().getTime();

    // find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculation or days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    ele.innerHTML =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    // ele.html(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

    // If the count down is finished , write some text
    if (distance < 0) {
      clearInterval(countDownGlobal);
      ele.html("Refresh Page");
    }
  }, 1000);
}
