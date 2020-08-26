import useRouter from "next/router";

import * as Icon from "react-feather";

import Header from "../components/head";
import PrimaryNav from '../components/primaryNav';

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

var currency;
var rate;
var priceUSD;
var priceETH;
var description;

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: "ETHEREUM",
      rate: null,
      lastChange: null,
      price: "",
      description: "",
    };
  }

  async componentDidMount() {
    this.getConversion('ethereum');

    if (localStorage.getItem('token') == null) {
      useRouter.push('/login');
    }
  }

  async getConversion(chosen_currency) {
    let data = await CoinGeckoClient.simple.price({
      ids: [chosen_currency],
      include_24hr_change: true
    });
    console.log(data);
    try {
      this.setState({
        rate: parseFloat(data['data'][chosen_currency]['usd']).toFixed(2),
        lastChange: parseFloat(data['data'][chosen_currency]['usd_24h_change']).toFixed(3)
      });
    } catch (err) {
      this.setState({
        rate: '0.00',
        lastChange: '0.00',
      })
    }

  }

  onChange = async event => {
    event.preventDefault();
    this.setState({ currency: await event.target.value });
    // if we were on Mainnet with real ERC20 tokens this should not have any issues. maybe in the future
    this.getConversion(this.state.currency.toLowerCase());
  }

  onSubmit = async event => {
    event.preventDefault();
    rate = this.state.rate;
    priceUSD = parseFloat(this.state.price).toFixed(2);
    if (this.state.currency == "FAU") {
      priceETH = priceUSD;
      priceUSD = 0;
    } else {
      priceETH = (priceUSD / rate).toFixed(5);
    }
    description = this.state.description;
    currency = this.state.currency;
    useRouter.push("/vendorConfirmation");
  }

  render() {
    let lastChange = this.state.lastChange;
    let color;
    if (parseFloat(lastChange) >= 0.0) {
      color = "green";
      lastChange = "+" + lastChange;
    } else {
      color = "red";
    }

    return (
      <div>
        <Header />
        <PrimaryNav />
        <main>
          <div className="text-center font-weight-bold mt-2">
            New Transaction
          </div>
          <div className="badge badge-light d-flex justify-content-center align-items-center mx-5">
            <select id="curr" className="form-control form-control-sm d-inline mx-2"
              value={this.state.currency}
              onChange={this.onChange}
              style={{ width: "100px", height: "28px" }}>
              <option value="ETHEREUM">1 ETH</option>
              <option value="TRON">1 TRX</option>
              <option value="FAU">1 FAU</option>
            </select>
            <div className="d-inline">
              = ${this.state.rate} USD
              <font color={color}> ({lastChange}%)</font>
            </div>
          </div>
          <div className="badge badge-light mx-5 d-flex justify-content-center align-items-center">
            <font size="1">
              <i>Conversion Rate Provided by CoinGecko.</i>
            </font>
          </div>
          <form onSubmit={this.onSubmit}>
            <div className="form-group d-flex justify-content-center align-items-center mt-3">
              <label
                htmlFor="priceInput"
                className="badge badge-dark d-flex align-items-center ml-5">
                Price
              </label>
              <div className="input-group col-md-5 mr-4 pr-4">
                <div className="input-group-prepend"
                  style={{ height: "31px" }}>
                  <span className="input-group-text">$</span>
                </div>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={this.state.price}
                  id="priceInput"
                  aria-describedby="priceInput"
                  placeholder="Enter Amount"
                  min="0"
                  step="0.01"
                  onChange={event => {
                    this.setState({ price: event.target.value });
                  }}
                  required
                />
              </div>
            </div>
            <div className="form-group d-flex justify-content-center align-items-center">
              <label
                htmlFor="descriptionInput"
                className="badge badge-dark d-flex align-items-center ml-5">
                Description
              </label>
              <div className="col-md-5 mr-4 pr-4">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={this.state.description}
                  id="descriptionInput"
                  placeholder="Enter Description of Purchased Item(s)"
                  required
                  onChange={event => {
                    this.setState({ description: event.target.value });
                  }}
                ></input>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button
                type="submit"
                className="btn btn-block btn-success ml-5 mr-5 d-flex justify-content-center align-items-center">
                Confirm <Icon.Check className="ml-1 mb-0" />
              </button>
            </div>
          </form>
        </main>
      </div>
    );
  }
}

export { rate, priceUSD, priceETH, description, currency };
