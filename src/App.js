import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState();
  const [isFetching, setisFetching] = useState(false);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  const transactionsViewHandler = (currentLatestBlock) => {
    console.log("current latest block number:", currentLatestBlock);
  };

  const blockNumberDetailsHandler = async (blockNumber) => {
    setisFetching(true);
    const blockDetails = await alchemy.core.getBlockWithTransactions(blockNumber);
    setisFetching(false);
    setBlockDetails(blockDetails);
  };

  let blockDetailsContainer;

  if (!isFetching && !!blockDetails) {
    const blockDetailsElements = [];

    console.log("blockDetails:", blockDetails);

    for (const data in blockDetails) {
      if (data === "transactions") {
        blockDetailsElements.push(
          <div key={data} className="block-details__info">
            <span className="block-details__info-key">{data}: </span>{" "}
            <span
              className="block-details__info-value block-link"
              onClick={transactionsViewHandler.bind(null, blockNumber)}
            >
              [{blockDetails[data].length} transactions]
            </span>
          </div>
        );

        continue;
      }

      if (data === "baseFeePerGas") {
        blockDetailsElements.push(
          <div key={data} className="block-details__info">
            <span className="block-details__info-key">{data}: </span>{" "}
            <span className="block-details__info-value">{parseInt(blockDetails[data])} Wei</span>
          </div>
        );

        continue;
      }

      blockDetailsElements.push(
        <div key={data} className="block-details__info">
          <span className="block-details__info-key">{data}: </span>{" "}
          <span className="block-details__info-value">
            {typeof blockDetails[data] === "object" ? parseInt(blockDetails[data]) : blockDetails[data]}
          </span>
        </div>
      );
    }

    blockDetailsContainer = (
      <div className="app_inner--container">
        <div className="block-_key">Block Details: </div>
        {blockDetailsElements}
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App_main--header">Block Explorer</div>
      <div className="App_main" style={!isFetching ? { maxHeight: "1000px", transition: "all 1s" } : {}}>
        <div className="block-number app_inner--container">
          <span className="block-_key">Block Number:</span>{" "}
          <span className="block-number_value" onClick={blockNumberDetailsHandler.bind(null, blockNumber)}>
            {!blockNumber ? "loading..." : "#" + blockNumber} {isFetching && "wait..."}
          </span>
        </div>
        {blockDetailsContainer && blockDetailsContainer}
      </div>
    </div>
  );
}

export default App;
