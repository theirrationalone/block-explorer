import { Alchemy, Network } from "alchemy-sdk";
import { Switch, Route, Redirect } from "react-router-dom";

import "./App.css";
import Block from "./components/Block/Block";
import Transactions from "./components/Transactions/Transactions";
import Transaction from "./components/Transaction/Transaction";
import Logs from "./components/Logs/Logs";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  return (
    <div className="App">
      <div className="App_main--header">Block Explorer</div>
      <Switch>
        <Route exact path="/">
          <Redirect to="/block" />
        </Route>
        <Route exact path="/block">
          <Block alchemy={alchemy} />
        </Route>
        <Route path="/transactions/:block">
          <Transactions alchemy={alchemy} />
        </Route>
        <Route path="/transaction/:tx_hash">
          <Transaction alchemy={alchemy} />
        </Route>
        <Route path="/logs/:tx_hash">
          <Logs alchemy={alchemy} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
