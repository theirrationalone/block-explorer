import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import classes from "./Transactions.module.css";

const Transactions = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const { block } = useParams();
  const history = useHistory();

  const { alchemy } = props;

  useEffect(() => {
    const getBlockTransactions = async (block) => {
      setIsFetching(true);
      const blockDetails = await alchemy.core.getBlockWithTransactions(block);
      setIsFetching(false);

      setTransactions(blockDetails.transactions);
    };

    getBlockTransactions(+block);
  }, [alchemy.core, block]);

  const singleTransactionHandler = (txHash) => {
    history.push(`/transaction/${txHash}`);
  };

  let transactionsElements;

  if (!!transactions && transactions.length > 0) {
    transactionsElements = transactions.map((tx, txIdx) => {
      return (
        <tr key={tx.hash} className={classes["tx_dat_row"]} onClick={singleTransactionHandler.bind(null, tx.hash)}>
          <td className={classes["transaction-tx_data_el"]}>{txIdx + 1}</td>
          <td className={classes["transaction-tx_data_el"]}>{tx.blockNumber}</td>
          <td className={classes["transaction-tx_data_el"]}>{tx.hash.slice(0, 20)}...</td>
          <td className={classes["transaction-tx_data_el"]}>{tx.from.slice(0, 20)}...</td>
          <td className={classes["transaction-tx_data_el"]}>{tx.to.slice(0, 20)}...</td>
        </tr>
      );
    });
  }

  return isFetching ? (
    <div>Loading...</div>
  ) : !!transactionsElements ? (
    <div className={classes["transactions_container"]}>
      <div className={classes["txs--div_header"]}>Transactions: #{block}</div>
      <table className={classes["txs_table"]}>
        <thead className={classes["txs_header"]}>
          <tr className={classes["tx_row"]}>
            <th className={classes["txs_header_element"]}>Tx #</th>
            <th className={classes["txs_header_element"]}>Block</th>
            <th className={classes["txs_header_element"]}>Hash</th>
            <th className={classes["txs_header_element"]}>From</th>
            <th className={classes["txs_header_element"]}>To</th>
          </tr>
        </thead>
        <tbody>{transactionsElements}</tbody>
      </table>
    </div>
  ) : (
    <div>No Transactions :(</div>
  );
};

export default Transactions;
