import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";

import classes from "./Transaction.module.css";

const Transaction = ({ alchemy }) => {
  const [transactionReceipt, setTransactionReceipt] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const { tx_hash } = useParams();

  useEffect(() => {
    const transactionHandler = async (tx_hash) => {
      setIsFetching(true);
      const txReceipt = await alchemy.core.getTransactionReceipt(tx_hash);
      setIsFetching(false);
      setTransactionReceipt(txReceipt);
    };

    transactionHandler(tx_hash);
  }, [alchemy.core, tx_hash]);

  const transactionReceiptWrapper = [];

  if (!isFetching && !!transactionReceipt) {
    for (const data in transactionReceipt) {
      if (data === "logs") {
        transactionReceiptWrapper.push(
          <div key={data} className={classes["transaction-details__info"]}>
            <span className={classes["transaction-details__info-key"]}>{data}: </span>{" "}
            <NavLink
              to={`/logs/${tx_hash}`}
              className={classes["transaction-details__info-value"] + " " + classes["transaction-link"]}
            >
              [{transactionReceipt[data].length} logs]
            </NavLink>
          </div>
        );

        continue;
      }

      if (typeof transactionReceipt[data] === "object") {
        if (data.toLowerCase().includes("price")) {
          transactionReceiptWrapper.push(
            <div key={data} className={classes["transaction-details__info"]}>
              <span className={classes["transaction-details__info-key"]}>{data}: </span>{" "}
              <span className={classes["transaction-details__info-value"]}>
                {parseInt(transactionReceipt[data])} Wei
              </span>
            </div>
          );
        } else if (transactionReceipt[data] === null || typeof transactionReceipt[data] === "undefined") {
          transactionReceiptWrapper.push(
            <div key={data} className={classes["transaction-details__info"]}>
              <span className={classes["transaction-details__info-key"]}>{data}: </span>{" "}
              <span className={classes["transaction-details__info-value"]}>__</span>
            </div>
          );
        } else {
          transactionReceiptWrapper.push(
            <div key={data} className={classes["transaction-details__info"]}>
              <span className={classes["transaction-details__info-key"]}>{data}: </span>{" "}
              <span className={classes["transaction-details__info-value"]}>{parseInt(transactionReceipt[data])}</span>
            </div>
          );
        }

        continue;
      }

      if (data.toLowerCase() === "blocknumber" || data.toLowerCase() === "from" || data.toLowerCase() === "to") {
        transactionReceiptWrapper.push(
          <div key={data} className={classes["transaction-details__info"]}>
            <span className={classes["transaction-details__info-key"]}>{data}: </span>{" "}
            <span className={classes["transaction-details__info-value"]}>
              <NavLink
                to={`/${data.toLowerCase() === "blocknumber" ? "block" : "address"}/${transactionReceipt[data]}`}
              >
                {transactionReceipt[data]}
              </NavLink>
            </span>
          </div>
        );

        continue;
      }

      transactionReceiptWrapper.push(
        <div key={data} className={classes["transaction-details__info"]}>
          <span className={classes["transaction-details__info-key"]}>{data}: </span>{" "}
          <div className={classes["transaction-details__info-value"]}>
            {typeof transactionReceipt[data] === "boolean"
              ? transactionReceipt[data]
                ? "True"
                : "False"
              : transactionReceipt[data]}
          </div>
        </div>
      );
    }
  }

  return (
    <div className={classes["transaction_wrapper"]}>
      <div className={classes["transaction_header"]}>
        <span>Tx Hash:</span> {tx_hash}
      </div>
      <div className={classes["transaction_container"]}>
        {isFetching
          ? "Loading..."
          : transactionReceiptWrapper.length > 0
          ? transactionReceiptWrapper
          : "Something went wrong..."}
      </div>
    </div>
  );
};

export default Transaction;
