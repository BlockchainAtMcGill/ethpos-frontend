import * as Icon from "react-feather";

import { getWeb3 } from '../web3';
import { getContractInstance } from '../contract';
import Header from "../components/head";
import PrimaryNav from '../components/primaryNav';


var accountAddress;

function ErrorAlert(props) {
  return (
    <div
      className="alert alert-danger ml-3 d-flex justify-content-center align-items-center"
      style={{ height: "10px" }}>
        <div 
          className="text pt-1" 
          style={{ fontSize: "12px" }}>
            Withdrawal Failed! Please Try Again.
        </div>
    </div>
  )
}

function WithdrawButton(props) {
  return (
    <button
      type="button"
      className="btn btn-block btn-success ml-5 mr-5 d-flex justify-content-center align-items-center"
      onClick={props.func}
      disabled={(props.ether_balance == 0 ? true : false)}>
        Withdraw Total Balance <Icon.ArrowDownCircle className="ml-2" />
    </button>
  )
}

function LoadingButton(props) {
  return (
    <button 
      type="button"
      className="btn btn-block btn-success ml-5 mr-5 d-flex justify-content-center align-items-center"
      disabled>
        <div className="spinner-border mr-2" style={{ width: "20px", height: "20px" }} role="status" aria-hidden="true"></div>
        Loading...
    </button>
  )
}

function SuccessButton(props) {
  return (
    <button
      type="button"
      className="btn btn-block btn-success ml-5 mr-5 d-flex justify-content-center align-items-center"
      disabled>
        Success <Icon.CheckCircle className="ml-2" />
  </button>
  )
}

function RefreshAlert(props) {
  return (
    <div
      className="alert alert-primary ml-3 mt-3 d-flex justify-content-center align-items-center"
      style={{ height: "10px" }}>
        <div 
          className="text pt-1" 
          style={{ fontSize: "12px" }}>
            Use the icons in the top right to start a new transaction!
        </div>
    </div>
  )
}

function ShowBalance(props) {
  return (
    <div className="col-xs">
      <div className="badge badge-light">Ξ {props.ether_balance} ETH</div>
    </div>
  )
}

function NoFunds(props) {
  return (
    <div className="col-xs">
      <div className="badge badge-light">Ξ {props.ether_balance} ETH</div>
      <div className="badge badge-danger ml-3">No Funds!</div>
    </div>
  )
}

export default class Withdraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          accountAddress: "",
          ether_balance: "",
          isProcessing: false,
          isSuccessful: false,
          isError: false
        }
      }

    async componentDidMount() {
      let web3 = await (getWeb3().catch(e => {console.error(e)}));
      let interactInstance = getContractInstance(web3, "Interact");
      this.setState({
          accountAddress: web3.currentProvider.selectedAddress,
          ether_balance: web3.utils.fromWei(await interactInstance.methods.pendingWithdrawals(web3.currentProvider.selectedAddress).call(), "ether")
      });

      ethereum.on('accountsChanged', async (accounts) => {
        let amount = await interactInstance.methods.pendingWithdrawals(accounts[0]).call();
        this.setState({
          accountAddress: accounts[0],
          ether_balance: web3.utils.fromWei(amount, "ether")
        });
      });
  }

    componentWillUnmount() {
        ethereum.removeAllListeners();
      }

    async withdraw() {
      this.setState(
        {isProcessing: true}
      )
      let web3 = await (getWeb3().catch(e => {console.error(e)}));
      let interactInstance = getContractInstance(web3, "Interact");
      try {
        await interactInstance.methods.withdraw().send({from: this.state.accountAddress});
        this.setState({
          ether_balance: web3.utils.fromWei(await interactInstance.methods.pendingWithdrawals(this.state.accountAddress).call(), "ether"),
          isError: false,
          isProcessing: false,
          isSuccessful: true
        });
      } catch (error) {
          this.setState(
            { isError: true,
              isProcessing: false,
              isSuccessful: false }
        )
      }
    }

  render() {
    // show first 4 and last 4 digits of account address
    accountAddress = this.state.accountAddress;
    accountAddress = accountAddress.substring(0, 6) + "****" + 
                     accountAddress.substring(accountAddress.length - 4);
    
    const { isProcessing, isSuccessful, isError } = this.state;
    console.log(isProcessing, isSuccessful, isError);
    return (
      <div>
        <Header />
        <main>
          <PrimaryNav />
          <div className="container">
            <div className="text-center font-weight-bold mt-2">
              New Withdrawal
            </div>
            <div className="row justify-content-left ml-5 mt-2 pl-5">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.Key size="12" strokeWidth="3" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text mr-4 pr-4">Account:</div>
              </div>
              <div className="col-xs">
                <div className="badge badge-light">{accountAddress}</div>
              </div>
            </div>
            <div className="row justify-content-left ml-5 pl-5">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.DollarSign size="12" strokeWidth="3" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text mr-4 pr-4">Balance:</div>
              </div>
              <div>
                { (this.state.ether_balance==0 && isSuccessful==0) ? <NoFunds ether_balance={this.state.ether_balance} /> : <ShowBalance ether_balance={this.state.ether_balance} /> }
              </div>
            </div>
            <form>
              <div className="row mt-4 justify-content-center">
                  {isProcessing ? <LoadingButton /> : isSuccessful ? <SuccessButton /> : <WithdrawButton func={this.withdraw.bind(this)} ether_balance={this.state.ether_balance}/>}
                  {isSuccessful ? <RefreshAlert /> : ""}
              </div>
            </form>
            <div className="row mt-3 justify-content-center">
              {isError ? <ErrorAlert /> : ""}
            </div>
          </div>
        </main>
      </div>
    );
  }
}