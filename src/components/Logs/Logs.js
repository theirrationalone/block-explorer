import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";

import classes from "./Logs.module.css";

const Logs = ({ alchemy }) => {
  const [logs, setLogs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const { tx_hash } = useParams();

  useEffect(() => {
    const logsHandler = async (tx_hash) => {
      setIsFetching(true);
      try {
        const txReceipt = await alchemy.core.getTransactionReceipt(tx_hash);
        setLogs(txReceipt.logs);
      } catch (e) {}
      setIsFetching(false);
    };

    logsHandler(tx_hash);
  }, [alchemy.core, tx_hash]);

  let allLogs;

  if (isFetching) {
    allLogs = <div className={classes["logs_loading"]}>Loading...</div>;
  }

  if (!isFetching && logs.length > 0) {
    console.log("logs:", logs);
    allLogs = logs.map((log, logIdx) => {
      const singleLogData = [];

      for (const logData in log) {
        if (logData.toLowerCase() === "topics") {
          const topics = log[logData].map((topic, topicIdx) => {
            return (
              <div key={topicIdx + logData} className={classes["topic-container"]}>
                <span className={classes["topic-number_header"]}>Topic #{topicIdx + 1}: </span>
                <span className={classes["topic-number_topic"]}>{topic}</span>
              </div>
            );
          });

          singleLogData.push(
            <div key={logData} className={classes["log-data"]}>
              <span className={classes["log-data__key"]}>{logData}:</span>
              <span className={classes["log-data__value"]}>{topics}</span>
            </div>
          );

          continue;
        }

        if (logData.toLowerCase() === "transactionhash") {
          singleLogData.push(
            <div key={logData} className={classes["log-data"]}>
              <span className={classes["log-data__key"]}>{logData}:</span>
              <span className={classes["log-data__value"]}>
                <NavLink to={`/transaction/${tx_hash}`}>{tx_hash}</NavLink>
              </span>
            </div>
          );

          continue;
        }

        singleLogData.push(
          <div key={logData} className={classes["log-data"]}>
            <span className={classes["log-data__key"]}>{logData}:</span>
            <span className={classes["log-data__value"]}> {log[logData]}</span>
          </div>
        );
      }

      return (
        <div key={Math.random().toString() + logIdx.toString() + log.data} className={classes["logs_info--log"]}>
          <div className={classes["log-number"]}>Log: #{logIdx + 1}</div>
          {singleLogData}
        </div>
      );
    });
  }

  if (!isFetching && logs.length <= 0) {
    allLogs = <div className={classes["logs_no-logs"]}>No Logs</div>;
  }

  return (
    <div className={classes["all_logs--container"]}>
      <div className={classes["transaction_header"]}>
        <span>Tx Hash:</span> <NavLink to={`/transaction/${tx_hash}`}>{tx_hash}</NavLink>
      </div>
      <div className={classes["logs_data--container"]}>{allLogs}</div>
    </div>
  );
};

export default Logs;
