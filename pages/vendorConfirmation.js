import React from "react";
import useRouter from "next/router";
import * as Icon from "react-feather";

import { rate, priceUSD, priceETH, description, currency } from ".";
import Header from "../components/head";
import SecondaryNav from "../components/secondaryNav";


export default class VendorConfirmation extends React.Component {
  constructor(props) {
    super(props);
  }
  onSubmit = async event => {
    event.preventDefault();
    useRouter.push("/displayQR");
  }
  render() {
    return (
      <div>
        <Header />
        <main>
          <SecondaryNav isSuccessful="False" />
          <div className="container justify-content-center">
            <div className="text-center font-weight-bold mt-1">
              Transaction Summary
            </div>
            <div className="row justify-content-left ml-5 pl-5 mt-3">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.Repeat size="12" strokeWidth="3" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text mr-5">Rate:</div>
              </div>
              <div className="col-xs">
                <div className="badge badge-light ml-4">
                  1 ${currency} = ${rate} USD
                </div>
              </div>
            </div>
            <div className="row justify-content-left ml-5 pl-5">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.DollarSign size="12" strokeWidth="3" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text mr-5">Amount:</div>
              </div>
              <div className="col-xs">
                <div className="badge badge-light">
                  ${priceUSD} USD
                </div>
              </div>
            </div>
            <div className="row justify-content-left ml-5 pl-5">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.DollarSign size="12" strokeWidth="3" color="white" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text-white mr-5">Amount:</div>
              </div>
              <div className="col-xs">
                <div className="badge badge-warning">
                  {priceETH} {currency}
                </div>
              </div>
            </div>
            <div className="row justify-content-left ml-5 pl-5">
              <div className="col-xs">
                <div className="text mr-1">
                  <Icon.BookOpen size="12" strokeWidth="3" />
                </div>
              </div>
              <div className="col-xs">
                <div className="text mr-3 pr-1">Description:</div>
              </div>
              <div className="col-xs">
                <div className="badge badge-light">
                  {description}
                </div>
              </div>
            </div>
            <hr className="my-2"></hr>

            <form onSubmit={this.onSubmit}>
              <div className="row mt-3 justify-content-center">
                <button
                  type="submit"
                  className="btn btn-success btn-md d-flex align-items-center"
                >
                  Show QR Code <Icon.Maximize className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }
}
