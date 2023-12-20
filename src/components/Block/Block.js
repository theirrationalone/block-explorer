import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import classes from "./Block.module.css";

const Block = (props) => {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState();
  const [isFetching, setisFetching] = useState(false);

  const { alchemy } = props;

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, [alchemy.core]);

  const blockNumberDetailsHandler = async (blockNumber) => {
    setisFetching(true);
    const blockDetails = await alchemy.core.getBlockWithTransactions(blockNumber);
    setisFetching(false);
    setBlockDetails(blockDetails);
  };

  let blockDetailsContainer;

  if (!isFetching && !!blockDetails) {
    const blockDetailsElements = [];

    for (const data in blockDetails) {
      if (data === "transactions") {
        blockDetailsElements.push(
          <div key={data} className={classes["block-details__info"]}>
            <span className={classes["block-details__info-key"]}>{data}: </span>{" "}
            <NavLink
              to={`/transactions/${blockNumber}`}
              className={classes["block-details__info-value"] + " " + classes["block-link"]}
            >
              [{blockDetails[data].length} transactions]
            </NavLink>
          </div>
        );

        continue;
      }

      if (data === "baseFeePerGas") {
        blockDetailsElements.push(
          <div key={data} className={classes["block-details__info"]}>
            <span className={classes["block-details__info-key"]}>{data}: </span>{" "}
            <span className={classes["block-details__info-value"]}>{parseInt(blockDetails[data])} Wei</span>
          </div>
        );

        continue;
      }

      blockDetailsElements.push(
        <div key={data} className={classes["block-details__info"]}>
          <span className={classes["block-details__info-key"]}>{data}: </span>{" "}
          <span className={classes["block-details__info-value"]}>
            {typeof blockDetails[data] === "object" ? parseInt(blockDetails[data]) : blockDetails[data]}
          </span>
        </div>
      );
    }

    blockDetailsContainer = (
      <div className={classes["block_inner--container"]}>
        <div className={classes["block-_key"]}>Block Details: </div>
        {blockDetailsElements}
      </div>
    );
  }

  return (
    <div className={classes["block_main"]} style={!isFetching ? { maxHeight: "1000px", transition: "all 1s" } : {}}>
      <div className={classes["block-number app_inner--container"]}>
        <span className={classes["block-_key"]}>Block Number:</span>{" "}
        <span className={classes["block-number_value"]} onClick={blockNumberDetailsHandler.bind(null, blockNumber)}>
          {!blockNumber ? "loading..." : "#" + blockNumber} {isFetching && "wait..."}
        </span>
      </div>
      {blockDetailsContainer && blockDetailsContainer}
    </div>
  );
};

export default Block;
