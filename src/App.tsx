import React, { useEffect, useState } from "react";
import "./App.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import {
  UserRejectedRequestError,
  InjectedConnector,
} from "@web3-react/injected-connector";
import { ethers } from "ethers";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

// ABIs
import abi_token from "./abis/token.json";
import abi_masternode from "./abis/masternode.json";

// Images
import soyImg from "./assets/soy.png";
import loadingGif from "./assets/loading.gif";
import stat_clo from "./assets/stat_clo.png";
import stat_cloe from "./assets/stat_cloe.png";
import stat_soy from "./assets/stat_soy.png";

// vars from env file
const chainIdEnv = Number(process.env.REACT_APP_CHAIN_ID);
const chainUrlEnv = process.env.REACT_APP_CHAIN_URL;
const CloeContractAddressEnv = process.env.REACT_APP_CLOE_CONTRACT_ADDRESS;
const SoyContractAddressEnv = process.env.REACT_APP_SOY_CONTRACT_ADDRESS;
const MasternodeAddressEnv = process.env.REACT_APP_MASTER_NODE_ADDRESS;
const minCloEnv = Number(process.env.REACT_APP_MIN_CLO);
const maxCloEnv = Number(process.env.REACT_APP_MAX_CLO);
const minCloeEnv = Number(process.env.REACT_APP_MIN_CLOE);
const maxCloeEnv = Number(process.env.REACT_APP_MAX_CLOE);
const minSoyEnv = Number(process.env.REACT_APP_MIN_SOY);
const maxSoyEnv = Number(process.env.REACT_APP_MAX_SOY);
const inactiveTimeEnv = Number(process.env.REACT_APP_INACTIVE_TIME);

const injected = new InjectedConnector({
  supportedChainIds: [chainIdEnv],
});

// web3
const { ethereum }: any = window;
const metamaskWeb3 = new Web3(ethereum);
const web3 = new Web3(process.env.REACT_APP_CHAIN_URL);

const web3CLOE = new web3.eth.Contract(
  abi_token as AbiItem[],
  CloeContractAddressEnv
);
const web3CLOEMeta = new metamaskWeb3.eth.Contract(
  abi_token as AbiItem[],
  CloeContractAddressEnv
);

const web3SOY = new web3.eth.Contract(
  abi_token as AbiItem[],
  SoyContractAddressEnv
);
const web3SOYMeta = new metamaskWeb3.eth.Contract(
  abi_token as AbiItem[],
  SoyContractAddressEnv
);

const web3Masternode = new web3.eth.Contract(
  abi_masternode as AbiItem[],
  MasternodeAddressEnv
);
const web3MasternodeMeta = new metamaskWeb3.eth.Contract(
  abi_masternode as AbiItem[],
  MasternodeAddressEnv
);

function App() {
  // states
  const [walletConnected, setWalletConnected] = useState(false);
  const [userWallet, setUserWallet] = useState("");
  const [blockchainId, setBlockhainId] = useState(0);
  // CLO
  const [cloAmount, setCloAmount] = useState(0);
  const [cloAmountToAdd, setCloAmountToAdd] = useState(0);
  const [cloAmountToAddToken, setCloAmountToAddToken] = useState(0);
  const [cloCheck, setCloCheck] = useState(true);
  const [cloAmountPossible, setCloAmountPossible] = useState(0);
  const [cloMnBalance, setCloMnBalance] = useState(0);
  // CLOE
  const [cloeAmount, setCloeAmount] = useState(0);
  const [cloeAmountToAdd, setCloeAmountToAdd] = useState(0);
  const [cloeAmountToAddToken, setCloeAmountToAddToken] = useState(0);
  const [cloeCheck, setCloeCheck] = useState(true);
  const [cloeApproved, setCloeApproved] = useState(true);
  const [cloeAmountPossible, setCloeAmountPossible] = useState(0);
  const [cloeMnBalance, setCloeMnBalance] = useState(0);
  // SOY
  const [soyAmount, setSoyAmount] = useState(0);
  const [soyAmountToAdd, setSoyAmountToAdd] = useState(0);
  const [soyAmountToAddToken, setSoyAmountToAddToken] = useState(0);
  const [soyCheck, setSoyCheck] = useState(true);
  const [soyApproved, setSoyApproved] = useState(true);
  const [soyAmountPossible, setSoyAmountPossible] = useState(0);
  const [soyMnBalance, setSoyMnBalance] = useState(0);
  // Address
  const [addressToAdd, setAddressToAdd] = useState("");
  // Url
  const [urlToAdd, setUrlToAdd] = useState("");
  // Buttons states
  const [btnAddMasternode, setBtnAddMasternode] = useState(true);
  const [btnTxn, setBtnTxn] = useState(false);
  // Console log
  const [consoleLog, setConsoleLog] = useState("");
  // Claim rewards
  const [soyRewards, setSoyRewards] = useState(0);
  // Close node
  const [nodeActiveMode, setNodeActiveMode] = useState(false);
  const [nodeInactivetime, setNodeInactivetime] = useState(0);
  const [nodeAuthAddress, setNodeAuthAddress] = useState("");
  const [nodeUrl, setNodeUrl] = useState("");
  const [unlockTime, setUnlockTime] = useState("");

  // function handleCloInput
  const handleCloInput = (e: any) => {
    // check if the input value is in range of 500k and 5M
    if (e.target.value >= minCloEnv && e.target.value <= maxCloEnv) {
      // set the state to true
      setCloCheck(true);
    } else {
      // set the state to false
      setCloCheck(false);
    }
    setCloAmountToAdd(e.target.value);
  };

  // function handleCloInputAddToken
  const handleCloInputAddToken = (e: any) => {
    // check if the input value is in range of 500k and 5M
    setCloAmountToAddToken(e.target.value);
  };

  // function handleCloeInput
  const handleCloeInput = (e: any) => {
    // check if the input value is in range of 500k and 5M
    if (e.target.value >= minCloeEnv && e.target.value <= maxCloeEnv) {
      // set the state to true
      setCloeCheck(true);
    } else {
      // set the state to false
      setCloeCheck(false);
    }
    setCloeAmountToAdd(e.target.value);
    checkCloeApproved(e.target.value);
  };

  // function handleCloeInputAddToken
  const handleCloeInputAddToken = (e: any) => {
    // check if the input value is in range of 500k and 5M
    setCloeAmountToAddToken(e.target.value);
    checkCloeApproved(e.target.value);
  };

  // function handleSoyInput
  const handleSoyInput = (e: any) => {
    // check if the input value is in range of 500k and 5M
    if (e.target.value >= minSoyEnv && e.target.value <= maxSoyEnv) {
      // set the state to true
      setSoyCheck(true);
    } else {
      // set the state to false
      setSoyCheck(false);
    }
    setSoyAmountToAdd(e.target.value);
    checkSoyApproved(e.target.value);
  };

  // function handleSoyInputAddToken
  const handleSoyInputAddToken = (e: any) => {
    // check if the input value is in range of 500k and 5M
    setSoyAmountToAddToken(e.target.value);
    checkSoyApproved(e.target.value);
  };

  // function handleAddressInput
  const handleAddressInput = (e: any) => {
    setAddressToAdd(e.target.value);
  };

  // function handleUrlInput
  const handleUrlInput = (e: any) => {
    setUrlToAdd(e.target.value);
  };

  const {
    chainId,
    account,
    activate,
    deactivate,
    setError,
    active,
    library,
    connector,
  } = useWeb3React<Web3Provider>();

  // check wallet CLO balance
  const checkWalletBalance = async () => {
    // check if the wallet is connected
    if (active) {
      // get the provider
      const provider = new ethers.providers.Web3Provider(library.provider);
      // get the signer
      const signer = provider.getSigner();
      // get the balance
      const balance = await signer.getBalance();
      // convert the balance to ether
      const balanceInEther = ethers.utils.formatEther(balance);
      // conver to only decimals
      const balanceInDecimals = Number(balanceInEther).toFixed(2);
      // set the state
      setCloAmount(Number(balanceInDecimals));
    }
  };

  // check wallet CLOE token balance
  const checkWalletBalanceCloe = async () => {
    // check if the wallet is connected
    if (active) {
      const balance = await web3CLOE.methods.balanceOf(account).call();
      // convert the balance to ether
      const balanceInEther = ethers.utils.formatEther(balance);
      // conver to only decimals
      const balanceInDecimals = Number(balanceInEther).toFixed(2);
      // set the state
      setCloeAmount(Number(balanceInDecimals));
    }
  };

  // check wallet SOY token balance
  const checkWalletBalanceSoy = async () => {
    // check if the wallet is connected
    if (active) {
      const balance = await web3SOY.methods.balanceOf(account).call();
      // convert the balance to ether
      const balanceInEther = ethers.utils.formatEther(balance);
      // conver to only decimals
      const balanceInDecimals = Number(balanceInEther).toFixed(2);
      // set the state
      setSoyAmount(Number(balanceInDecimals));
    }
  };

  // Check SOY rewards
  const checkSoyRewards = async () => {
    // check if the wallet is connected
    if (active) {
      const rewards = await web3Masternode.methods.getReward(account).call();
      // convert to ether
      const rewardsInEther = ethers.utils.formatEther(rewards);
      // convert to decimal
      const rewardsInDecimals = Number(rewardsInEther).toFixed(2);
      setSoyRewards(Number(rewardsInDecimals));
    }
  };

  // check getNodeByAuthority function
  const checkNodeByAuthority = async () => {
    // check if the wallet is connected
    if (active) {
      const nodeDetails = await web3Masternode.methods
        .getNodeByAuthority(account) 
        .call();

      // getUsersNodeByOwner
      const nodAuthDetails = await web3Masternode.methods
        .getUsersNodeByOwner("0x550d599c0b743425097d544664c737933d213a12")  // tODO: change to account
        .call();

      // Max amount possible in CLO
      const cloAmountPossible = maxCloEnv - Number(ethers.utils.formatEther(nodAuthDetails[0].balances[0]));
      setCloAmountPossible(cloAmountPossible);
      setCloMnBalance(Number(ethers.utils.formatEther(nodAuthDetails[0].balances[0])));

      // Max amount possible in CLOE
      const cloeAmountPossible = maxCloeEnv - Number(ethers.utils.formatEther(nodAuthDetails[0].balances[1]));
      setCloeAmountPossible(cloeAmountPossible);
      setCloeMnBalance(Number(ethers.utils.formatEther(nodAuthDetails[0].balances[1])));

      // Max amount possible in SOY
      const soyAmountPossible = maxSoyEnv - Number(ethers.utils.formatEther(nodAuthDetails[0].balances[2]));
      setSoyAmountPossible(soyAmountPossible);
      setSoyMnBalance(Number(ethers.utils.formatEther(nodAuthDetails[0].balances[2])));

      setNodeAuthAddress(nodAuthDetails.authority);

      setNodeUrl(nodAuthDetails.url);
      setNodeActiveMode(nodAuthDetails.node.isActive);
      const unlockTime = nodAuthDetails.node.unlockTime;
      // date now in seconds
      const nowTime = Math.floor(Date.now() / 1000);
      const diffInTime = unlockTime - nowTime;
      setNodeInactivetime(diffInTime);

      // transform unlockTime to date
      const unlockDate = new Date(unlockTime * 1000);
      setUnlockTime(unlockDate.toString());
    }
  };

  const checkCloeApproved = async (eInputCloe) => {
    // check if the wallet is connected
    if (active) {
      const approved = await web3CLOE.methods
        .allowance(account, MasternodeAddressEnv)
        .call();
      // transfor to ether
      const approvedInEther = ethers.utils.formatEther(approved);
      if (Number(approvedInEther) >= eInputCloe) {
        setCloeApproved(true);
      } else {
        setCloeApproved(false);
      }
    }
  };

  const checkSoyApproved = async (eInputSoy) => {
    // check if the wallet is connected
    if (active) {
      const approved = await web3SOY.methods
        .allowance(account, MasternodeAddressEnv)
        .call();
      // transfor to ether
      const approvedInEther = ethers.utils.formatEther(approved);
      if (Number(approvedInEther) >= eInputSoy) {
        setSoyApproved(true);
      } else {
        setSoyApproved(false);
      }
    }
  };

  const onClickConnect = () => {
    activate(
      injected,
      (error) => {
        if (error instanceof UserRejectedRequestError) {
          // ignore user rejected error
          console.log("user refused");
        } else {
          setError(error);
        }
      },
      false
    );
  };

  const onClickDisconnect = () => {
    deactivate();
  };

  const addNodeSend = async () => {
    setConsoleLog("Adding Masternode in progress..");
    // function addNode(uint256 amountCLOE, uint256 amountSOY, address authority, string calldata url) external payable {
    const amountCLOE = Web3.utils.toWei(cloeAmountToAdd.toString(), "ether");
    const amountCLOEHex = web3.utils.toBN(amountCLOE);
    const amountSOY = Web3.utils.toWei(soyAmountToAdd.toString(), "ether");
    const amountSOYHex = web3.utils.toBN(amountSOY);
    const amountCLO = Web3.utils.toWei(cloAmountToAdd.toString(), "ether");
    const amountCLOHex = web3.utils.toBN(amountCLO);

    const Txn = await web3MasternodeMeta.methods
      .addNode(amountCLOEHex, amountSOYHex, addressToAdd, urlToAdd)
      .send({
        from: account,
        value: web3.utils.toHex(amountCLOHex),
      });
    return Txn;
  };

  const approveCloe = async () => {
    // Start the token amount approval for CLOE
    setConsoleLog("CLOE approval in progress..");
    const cloeAmountInWei = Web3.utils.toWei(
      cloeAmountToAdd.toString(),
      "ether"
    );
    const Txn = await web3CLOEMeta.methods
      .approve(MasternodeAddressEnv, cloeAmountInWei)
      .send({ from: account });
    setConsoleLog("CLOE token amount approved..");
    return Txn;
  };

  const approveSoy = async () => {
    setConsoleLog("SOY approval in progress..");
    const soyAmountInWei = Web3.utils.toWei(soyAmountToAdd.toString(), "ether");
    const Txn = await web3SOYMeta.methods
      .approve(MasternodeAddressEnv, soyAmountInWei)
      .send({ from: account });
    setConsoleLog("SOY token amount approved..");
    return Txn;
  };

  const approveCloeAddToken = async () => {
    // Start the token amount approval for CLOE
    setConsoleLog("CLOE approval in progress..");
    const cloeAmountInWei = Web3.utils.toWei(
      cloeAmountToAddToken.toString(),
      "ether"
    );
    const Txn = await web3CLOEMeta.methods
      .approve(MasternodeAddressEnv, cloeAmountInWei)
      .send({ from: account });
    setConsoleLog("CLOE token amount approved..");
    return Txn;
  };

  const approveSoyAddToken = async () => {
    setConsoleLog("SOY approval in progress..");
    const soyAmountInWei = Web3.utils.toWei(soyAmountToAddToken.toString(), "ether");
    const Txn = await web3SOYMeta.methods
      .approve(MasternodeAddressEnv, soyAmountInWei)
      .send({ from: account });
    setConsoleLog("SOY token amount approved..");
    return Txn;
  };

  // onClickAddMasternode function
  const onClickAddMasternode = async () => {
    // check if innput value are not empty
    if (
      cloAmountToAdd !== 0 &&
      cloeAmountToAdd !== 0 &&
      soyAmountToAdd !== 0 &&
      addressToAdd !== "" &&
      urlToAdd !== ""
    ) {
      setBtnAddMasternode(true);
      // check if the wallet is connected
      if (active) {
        setConsoleLog("Add node Operation started..");
        setBtnTxn(true);

        //start the addNode transaction
        try {
          const res = await addNodeSend();
          setConsoleLog(
            "Masternode added successfully. It will be approved under 48 hours."
          );
        } catch (error) {
          const result = (error as Error).message;
          console.log("Error when adding node.");
          setConsoleLog(result);
        }
        setBtnTxn(false);
      }
    } else {
      setBtnAddMasternode(false);
    }
  };

  const onClickClaimReawrds = async () => {
    // check if the wallet is connected
    if (active) {
      setConsoleLog("Claim rewards operation started..");
      setBtnTxn(true);
      // function claimRewards() external {
      const Txn = await web3MasternodeMeta.methods
        .claimReward()
        .send({ from: account });
      setBtnTxn(false);
      checkSoyRewards();
    }
  };

  const onClickWithdrawCollateral = async () => {
    // check if the wallet is connected
    if (active) {
      setConsoleLog("Withdraw collateral operation started..");
      setBtnTxn(true);
      // function withdrawCollateral() external {
      const Txn = await web3MasternodeMeta.methods
        .removeNode(nodeAuthAddress)
        .send({ from: account });
      setBtnTxn(false);
    }
  };

  const onClickDesactivateMasternode = async () => {
    // check if the wallet is connected
    if (active) {
      setConsoleLog("Close masternode operation started..");
      setBtnTxn(true);
      // function closeNode() external {
      const Txn = await web3MasternodeMeta.methods
        .deactivateNode(nodeAuthAddress)
        .send({ from: account });
      setBtnTxn(false);
    }
  };

  const onClickEnableCloe = async () => {
    // check if the wallet is connected
    if (active) {
      setConsoleLog("Enable CLOE operation started..");
      setBtnTxn(true);
      // Start the token amount approval for CLOE
      try {
        const res = await approveCloe();
        setCloeApproved(true);
      } catch (error) {
        const result = (error as Error).message;
      }
      setBtnTxn(false);
    }
  };

  const onClickEnableSoy = async () => {
    // check if the wallet is connected
    if (active) {
      setConsoleLog("Enable SOY operation started..");
      setBtnTxn(true);
      // Start the token amount approval for SOY
      try {
        const res = await approveSoy();
        setSoyApproved(true);
      } catch (error) {
        const result = (error as Error).message;
      }
      setBtnTxn(false);
    }
  };

  const onClickEnableCloeAddtoken = async () => {
    // check if the wallet is connected
    if (active) {
      setConsoleLog("Enable CLOE operation started..");
      setBtnTxn(true);
      // Start the token amount approval for CLOE
      try {
        const res = await approveCloeAddToken();
        setCloeApproved(true);
      } catch (error) {
        const result = (error as Error).message;
      }
      setBtnTxn(false);
    }
  };

  const onClickEnableSoyAddToken = async () => {
    // check if the wallet is connected
    if (active) {
      setConsoleLog("Enable SOY operation started..");
      setBtnTxn(true);
      // Start the token amount approval for SOY
      try {
        const res = await approveSoyAddToken();
        setSoyApproved(true);
      } catch (error) {
        const result = (error as Error).message;
      }
      setBtnTxn(false);
    }
  };

  /* ************* */
  /*  Add Fund     */
  /* ************* */

  // function addTokens(uint256 amountCLOE, uint256 amountSOY) external payable
  const addTokensSend = async () => {
    setConsoleLog("Adding Masternode in progress..");
    // function addNode(uint256 amountCLOE, uint256 amountSOY, address authority, string calldata url) external payable {
    const amountCLOE = Web3.utils.toWei(cloeAmountToAddToken.toString(), "ether");
    console.log("amountCLOE: ", amountCLOE);
    const amountCLOEHex = web3.utils.toBN(amountCLOE);
    const amountSOY = Web3.utils.toWei(soyAmountToAddToken.toString(), "ether");
    console.log("amountSOY: ", amountSOY);
    const amountSOYHex = web3.utils.toBN(amountSOY);
    const amountCLO = Web3.utils.toWei(cloAmountToAddToken.toString(), "ether");
    console.log("amountCLO: ", amountCLO);
    const amountCLOHex = web3.utils.toBN(amountCLO);

    const Txn = await web3MasternodeMeta.methods
      .addTokens(amountCLOEHex, amountSOYHex)
      .send({
        from: account,
        value: web3.utils.toHex(amountCLOHex),
      });
    return Txn;
  };

  // onClickAddFunc function
  const onClickAddTokens = async () => {
    if (active) {
      setConsoleLog("Add Fund Operation started..");
      setBtnTxn(true);

      //start the addNode transaction
      try {
        const res = await addTokensSend();
        setConsoleLog("Fund added successfully.");
      } catch (error) {
        const result = (error as Error).message;
        console.log("Error when adding fund.");
        setConsoleLog(result);
      }
      setBtnTxn(false);
    }
  };

  useEffect(() => {
    if (account) {
      setUserWallet(account);
      setWalletConnected(true);
      // check wallet CLO balance
      checkWalletBalance();
      checkWalletBalanceCloe();
      checkWalletBalanceSoy();
      checkSoyRewards();
      checkNodeByAuthority();
    }
    setBlockhainId(chainId);
  }, [account, active, chainId, library, connector]);

  return (
    <div className="App">
      <div className="container">
        <div className="app_title">
          Callisto Network Masternode Management Panel
        </div>
        <div className="tabs_container">
          <div className="app_Tabs">
            <Tabs defaultActiveKey="stats" id="uncontrolled-tab-example">

              <Tab eventKey="stats" title="Masternode Stats">
                {walletConnected ? (
                  <div className="tab_content">
                    <div className="input_group">
                      <div className="rewards_info text-center">
                        Your Masternode Stats
                      </div>
                      {/* if mode is active then show the close button */}
                      { nodeActiveMode ? (  // TODO: change to nodeActiveMode
                        <div className="tab_content">
                          {blockchainId === chainIdEnv ? (
                            <div className="input_green top_msg">
                              &#9673; You are connected to Callisto Network
                              Blockchain
                              {chainIdEnv === 820 ? " (Mainnet)" : " (Testnet)"}
                            </div>
                          ) : (
                            <div className="input_red top_msg">
                              &#9673; You are not connected to Callisto Network
                              Blockchain
                            </div>
                          )}

                          <div className="statsContaiber">

                            <div className="StatsBottom">
                              <div className="Stat">
                                <div className="statImage">
                                  <img src={stat_clo} alt="CLO" />
                                </div>
                                <div className="StatTop">
                                  Your CLO
                                </div>
                                <div className="StatBottom">
                                  {cloMnBalance}
                                </div>
                              </div>
                              <div className="Stat">
                              <div className="statImage">
                                  <img src={stat_cloe} alt="CLO" />
                                </div>
                                <div className="StatTop">
                                  Your CLOE
                                  </div>
                                <div className="StatBottom">
                                  {cloeMnBalance}
                                  </div>
                              </div>
                              <div className="Stat">
                              <div className="statImage">
                                  <img src={stat_soy} alt="CLO" />
                                </div>
                                <div className="StatTop">
                                  Your SOY
                                  </div>
                                <div className="StatBottom">
                                  {soyMnBalance}
                                  </div>
                                  </div>
                            </div>
                          </div> 

                        </div>
                      ) : (
                        <div className="input_red text-center">
                          Your Masternode is not active.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="tab_content btnConnect_content">
                    <div className="wallet_info">
                      Metamask Wallet not connected
                    </div>
                    <div className="callet_connect">
                      <button
                        className="btn_conn_wallet"
                        onClick={onClickConnect}
                      >
                        Connect MetaMask
                      </button>
                    </div>
                  </div>
                )}
              </Tab>

              <Tab eventKey="add" title="Set up a Node">
                {walletConnected ? (
                  <div className="tab_content">
                    {blockchainId === chainIdEnv ? (
                      <div className="input_green top_msg">
                        &#9673; You are connected to Callisto Network Blockchain
                        {chainIdEnv === 820 ? " (Mainnet)" : " (Testnet)"}
                      </div>
                    ) : (
                      <div className="input_red top_msg">
                        &#9673; You are not connected to Callisto Network
                        Blockchain
                      </div>
                    )}

                    {/* ClO amount Input */}
                    <div className="input_group">
                      <div className="input_topGroup">
                        <div className="input_title">CLO amount: </div>
                        <span className="amount_title">
                          {cloAmount > minCloEnv ? (
                            <span className="input_green">
                              ({cloAmount} CLO in your wallet)
                            </span>
                          ) : (
                            <span className="input_red">
                              ({cloAmount} CLO in your wallet)
                            </span>
                          )}
                        </span>
                      </div>
                      {!cloCheck ? (
                        <div className="input_red">
                          The amount of CLO should be between {minCloEnv} and{" "}
                          {maxCloEnv} CLO
                        </div>
                      ) : (
                        <div className="input_info">
                          The amount of CLO to be locked &#40;In range{" "}
                          {minCloEnv}-{maxCloEnv}&#41;
                        </div>
                      )}
                      <div className="input_form">
                        <input
                          type="text"
                          placeholder="CLO amount"
                          onChange={handleCloInput}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>

                    {/* ClOE amount Input */}
                    <div className="input_group">
                      <div className="input_topGroup">
                        <div className="input_title">CLOE amount: </div>
                        <span className="amount_title">
                          {cloeAmount > minCloeEnv ? (
                            <span className="input_green">
                              ({cloeAmount} CLOE in your wallet)
                            </span>
                          ) : (
                            <span className="input_red">
                              ({cloeAmount} CLOE in your wallet)
                            </span>
                          )}
                        </span>
                      </div>
                      {!cloeCheck ? (
                        <div className="input_red">
                          The amount of CLOE should be between {minCloeEnv} and{" "}
                          {maxCloeEnv} CLOE
                        </div>
                      ) : (
                        <div className="input_info">
                          The amount of CLOE to be locked (in range {minCloeEnv}
                          -{maxCloeEnv})
                        </div>
                      )}
                      <div className="input_form">
                        <input
                          type="text"
                          placeholder="CLOE amount"
                          onChange={handleCloeInput}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>

                    {/* SOY amount Input */}
                    <div className="input_group">
                      <div className="input_topGroup">
                        <div className="input_title">SOY amount: </div>
                        <span className="amount_title">
                          {soyAmount > minSoyEnv ? (
                            <span className="input_green">
                              ({soyAmount} SOY in your wallet)
                            </span>
                          ) : (
                            <span className="input_red">
                              ({soyAmount} SOY in your wallet)
                            </span>
                          )}
                        </span>
                      </div>
                      {!soyCheck ? (
                        <div className="input_red">
                          The amount of SOY should be between {minSoyEnv} and{" "}
                          {maxSoyEnv} SOY
                        </div>
                      ) : (
                        <div className="input_info">
                          The amount of SOY to be locked (in range {minSoyEnv}-
                          {maxSoyEnv})
                        </div>
                      )}
                      <div className="input_form">
                        <input
                          type="text"
                          placeholder="SOY amount"
                          onChange={handleSoyInput}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>

                    {/* Authority address Input */}
                    <div className="input_group">
                      <div className="input_topGroup">
                        <div className="input_title">Authority address: </div>
                      </div>
                      <div className="input_info">
                        Address which private key was used in the masternode
                        setting
                      </div>
                      <div className="input_form">
                        <input
                          type="text"
                          placeholder="0x584FE1D2Df3A0CD34d588139227b23bb268CECDe"
                          onChange={handleAddressInput}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>

                    {/* Url Input */}
                    <div className="input_group">
                      <div className="input_topGroup">
                        <div className="input_title">Masternode URL: </div>
                      </div>
                      <div className="input_info">
                        The url where the masternode code is deployed and
                        running
                      </div>
                      <div className="input_form">
                        <input
                          type="text"
                          placeholder="Amazon Lambda, Azure, etc..."
                          onChange={handleUrlInput}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    {btnTxn ? (
                      <div className="input_group text-center">
                        <img src={loadingGif} alt="Loading" />
                      </div>
                    ) : (
                      <div className="input_group text-center">
                        <div className="input_topGroup">
                          {btnAddMasternode ? (
                            <div>&nbsp;</div>
                          ) : (
                            <div className="input_red">
                              Please fill all the form
                            </div>
                          )}
                        </div>
                        <div className="enable_group">
                          {/* Check if CLOE amount is approved*/}
                          {!cloeApproved ? (
                            <button
                              className="enable_btn"
                              onClick={onClickEnableCloe}
                            >
                              Enable CLOE
                            </button>
                          ) : (
                            <div></div>
                          )}
                          {/* Check if SOY amount is approved*/}
                          {!soyApproved ? (
                            <button
                              className="enable_btn"
                              onClick={onClickEnableSoy}
                            >
                              Enable SOY
                            </button>
                          ) : (
                            <div></div>
                          )}
                        </div>
                        <button
                          className="btn_conn_wallet"
                          onClick={onClickAddMasternode}
                          disabled={!soyApproved || !cloeApproved}
                        >
                          Add Masternode
                        </button>
                        <div className="input_info">{consoleLog}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="tab_content btnConnect_content">
                    <div className="wallet_info">
                      Metamask Wallet not connected
                    </div>
                    <div className="callet_connect">
                      <button
                        className="btn_conn_wallet"
                        onClick={onClickConnect}
                      >
                        Connect MetaMask
                      </button>
                    </div>
                  </div>
                )}
              </Tab>

              <Tab eventKey="fund" title="Add Funds">
                {walletConnected ? (
                  <div className="tab_content">
                    <div className="input_group">
                      <div className="rewards_info text-center">
                        Add Fund To Your Masternode
                      </div>
                      {/* if mode is active then show the close button */}
                      {nodeActiveMode ? ( 
                        <div className="tab_content">
                          {blockchainId === chainIdEnv ? (
                            <div className="input_green top_msg">
                              &#9673; You are connected to Callisto Network
                              Blockchain
                              {chainIdEnv === 820 ? " (Mainnet)" : " (Testnet)"}
                            </div>
                          ) : (
                            <div className="input_red top_msg">
                              &#9673; You are not connected to Callisto Network
                              Blockchain
                            </div>
                          )}

                          {/* ClO amount Input */}
                          <div className="input_group">
                            <div className="input_topGroup">
                              <div className="input_title">CLO amount: </div>
                              <span className="amount_title">
                                <span className="input_green">
                                  ({cloAmount} CLO in your wallet)
                                </span>
                              </span>
                            </div>
                            <div className="input_info">
                              Maximum amount that can be added: {cloAmountPossible}
                            </div>
                            <div className="input_form">
                              <input
                                type="text"
                                placeholder="CLO amount"
                                onChange={handleCloInputAddToken}
                                autoComplete="off"
                                value={cloAmountToAddToken}
                              />
                            </div>
                          </div>

                          {/* ClOE amount Input */}
                          <div className="input_group">
                            <div className="input_topGroup">
                              <div className="input_title">CLOE amount: </div>
                              <span className="amount_title">
                                <span className="input_green">
                                  ({cloeAmount} CLOE in your wallet)
                                </span>
                              </span>
                            </div>
                            <div className="input_info">
                              Maximum amount that can be added: {cloeAmountPossible}
                            </div>
                            <div className="input_form">
                              <input
                                type="text"
                                placeholder="CLOE amount"
                                onChange={handleCloeInputAddToken}
                                autoComplete="off"
                                value={cloeAmountToAddToken}
                              />
                            </div>
                          </div>

                          {/* SOY amount Input */}
                          <div className="input_group">
                            <div className="input_topGroup">
                              <div className="input_title">SOY amount: </div>
                              <span className="amount_title">
                                <span className="input_green">
                                  ({soyAmount} SOY in your wallet)
                                </span>
                              </span>
                            </div>
                            <div className="input_info">
                              Maximum amount that can be added: {soyAmountPossible}
                            </div>
                            <div className="input_form">
                              <input
                                type="text"
                                placeholder="SOY amount"
                                onChange={handleSoyInputAddToken}
                                autoComplete="off"
                                value={soyAmountToAddToken}
                              />
                            </div>
                          </div>

                          {/* Submit Buttons */}
                          {btnTxn ? (
                            <div className="input_group text-center">
                              <img src={loadingGif} alt="Loading" />
                            </div>
                          ) : (
                            <div className="input_group text-center">
                              <div className="input_topGroup">
                                {btnAddMasternode ? (
                                  <div>&nbsp;</div>
                                ) : (
                                  <div className="input_red">
                                    Please fill all the form
                                  </div>
                                )}
                              </div>
                              <div className="enable_group">
                                {/* Check if CLOE amount is approved*/}
                                {!cloeApproved ? (
                                  <button
                                    className="enable_btn"
                                    onClick={onClickEnableCloeAddtoken}
                                  >
                                    Enable CLOE
                                  </button>
                                ) : (
                                  <div></div>
                                )}
                                {/* Check if SOY amount is approved*/}
                                {!soyApproved ? (
                                  <button
                                    className="enable_btn"
                                    onClick={onClickEnableSoyAddToken}
                                  >
                                    Enable SOY
                                  </button>
                                ) : (
                                  <div></div>
                                )}
                              </div>
                              <button
                                className="btn_conn_wallet"
                                onClick={onClickAddTokens}
                                disabled={!soyApproved || !cloeApproved}
                              >
                                Add more Funbd
                              </button>
                              <div className="input_info">{consoleLog}</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="input_red text-center">
                          Your Masternode is not active.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="tab_content btnConnect_content">
                    <div className="wallet_info">
                      Metamask Wallet not connected
                    </div>
                    <div className="callet_connect">
                      <button
                        className="btn_conn_wallet"
                        onClick={onClickConnect}
                      >
                        Connect MetaMask
                      </button>
                    </div>
                  </div>
                )}
              </Tab>
              
              <Tab eventKey="claim" title="Claim reward">
                {walletConnected ? (
                  <div className="tab_content">
                    {soyRewards > 0 ? (
                      <div className="input_group">
                        <div className="rewards_amount">
                          <div className="soy_amount_rew">{soyRewards}</div>
                          <div className="soy_txt_rew">SOY</div>
                          <div className="soy_img_rew">
                            <img src={soyImg} alt="soy" />
                          </div>
                        </div>
                        <div className="rewards_info text-center">
                          Earned Rewards
                        </div>
                        <div className="rewards_btn text-center">
                          {btnTxn ? (
                            <div className="input_group text-center">
                              <img src={loadingGif} alt="Loading" />
                            </div>
                          ) : (
                            <button
                              className="btn_conn_wallet"
                              onClick={onClickClaimReawrds}
                            >
                              Claim Rewards
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="input_group">
                        <div className="rewards_info text-center">
                          You don't have any rewards to claim
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="tab_content btnConnect_content">
                    <div className="wallet_info">
                      Metamask Wallet not connected
                    </div>
                    <div className="callet_connect">
                      <button
                        className="btn_conn_wallet"
                        onClick={onClickConnect}
                      >
                        Connect MetaMask
                      </button>
                    </div>
                  </div>
                )}
              </Tab>

              <Tab eventKey="close" title="Close Masternode">
                {walletConnected ? (
                  <div className="tab_content">
                    <div className="input_group">
                      <div className="rewards_info text-center">
                        Close Masternode
                      </div>
                      {/* if mode is active then show the close button */}
                      {nodeActiveMode ? (
                        // Close buttonn
                        <div className="active_block">
                          <div className="input_red text-center">
                            Your Masternode is active
                          </div>
                          <div className="rewards_btn text-center">
                            <button
                              className="btn_conn_wallet"
                              onClick={onClickDesactivateMasternode}
                            >
                              Desactivate Masternode
                            </button>
                          </div>
                        </div>
                      ) : (
                        // show days and Withdraw collateral button*
                        <div>
                          {nodeAuthAddress ===
                          "0x0000000000000000000000000000000000000000" ? (
                            <div className="input_red text-center">
                              Please add a masternode first
                            </div>
                          ) : (
                            <div className="active_block">
                              {nodeInactivetime < 0 ? (
                                nodeUrl === "" ? (
                                  <div>
                                    <div className="input_info text-center">
                                      No masternode to close
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="input_green text-center">
                                      Your Masternode is not active and you
                                      passed the unlock period
                                    </div>
                                    <div className="rewards_btn text-center">
                                      {btnTxn ? (
                                        <div className="input_group text-center">
                                          <img src={loadingGif} alt="Loading" />
                                        </div>
                                      ) : (
                                        <button
                                          className="btn_conn_wallet"
                                          onClick={onClickWithdrawCollateral}
                                        >
                                          Withdraw Collateral
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )
                              ) : (
                                <div className="input_red text-center">
                                  Your Masternode is not active and you have to
                                  wait until <span>{unlockTime}</span> seconds
                                  to unlock your collateral
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="tab_content btnConnect_content">
                    <div className="wallet_info">
                      Metamask Wallet not connected
                    </div>
                    <div className="callet_connect">
                      <button
                        className="btn_conn_wallet"
                        onClick={onClickConnect}
                      >
                        Connect MetaMask
                      </button>
                    </div>
                  </div>
                )}
              </Tab>

              

              


            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
