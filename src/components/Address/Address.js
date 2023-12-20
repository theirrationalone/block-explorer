import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Utils } from "alchemy-sdk";

import classes from "./Address.module.css";

const Address = ({ alchemy }) => {
  const [addressETHBalance, setAddressETHBalance] = useState();
  const [addressTokens, setAddressTokens] = useState([]);

  const { address } = useParams();

  useEffect(() => {
    const addressDetails = async (address) => {
      try {
        const balance = await alchemy.core.getBalance(address);
        const tokens = await alchemy.core.getTokenBalances(address);
        setAddressETHBalance(+balance);
        setAddressTokens(tokens.tokenBalances);
      } catch (e) {
        console.log("Something went try, Facing issues to fetch balances, Please read this Error: ", e);
      }
    };

    addressDetails(address);
  }, [alchemy.core, address]);

  const addressCopyHandler = async (addressTocopy) => {
    try {
      await navigator.clipboard.writeText(addressTocopy);
      alert("address copied!");
    } catch (e) {}
  };

  let tokensBalances;

  if (addressTokens.length > 0) {
    tokensBalances = addressTokens.map((token) => {
      return (
        <tr key={token.contractAddress} className={classes["crypto_token"]}>
          <td className={classes["crypto_token-address"]}>{token.contractAddress}</td>
          <td className={classes["crypto_token-balance"]}>
            {parseFloat(Utils.formatEther(token.tokenBalance)).toFixed(2)}
          </td>
        </tr>
      );
    });
  }

  return (
    <div className={classes["address-info__container"]}>
      <div className={classes["address-info__address"]}>
        <div className={classes["address-info__address-pic"]}></div>
        <div className={classes["address-info__address-text"]}>
          <span>Address </span>
          {address}
        </div>
        <div className={classes["address-info__address-copy_access"]} onClick={addressCopyHandler.bind(null, address)}>
          <div className={classes["address-info__address-copy_access-inner"]}></div>
        </div>
      </div>
      <div classes={classes["address-info__categories"]}>
        <div className={classes["address-info__overview"]}>
          <div className={classes["address-info__overview-header"]}>Overview</div>
          <div className={classes["address-info__balances-ether"]}>
            <div className={classes["address-info__-header"]}>ETH BALANCE</div>
            <div className={classes["address-info__-value"]}>
              {addressETHBalance ? Utils.formatEther(addressETHBalance.toString()) : "loading..."} ETH
            </div>
          </div>
          <div className={classes["address-info__balances-ether"]}>
            <div className={classes["address-info__-header"]}>WEI VALUE</div>
            <div className={classes["address-info__value"]}>
              {!addressETHBalance ? "loading" : addressETHBalance} WEI
            </div>
          </div>
          <div className={classes["address-info__balances-ether"]}>
            <div className={classes["address-info__-header"]}>TOKEN HOLDINGS</div>
            {!tokensBalances ? (
              "Loading..."
            ) : (
              <div className={classes["address-info__value"]}>
                <table>
                  <thead>
                    <tr>
                      <th>Token Address</th>
                      <th>Balance (ETH)</th>
                    </tr>
                  </thead>
                  <tbody>{tokensBalances}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
