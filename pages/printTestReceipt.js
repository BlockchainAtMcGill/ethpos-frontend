import React from "react";
import Header from "../components/head";
import SecondaryNav from "../components/secondaryNav";
// import { rate, priceUSD, priceETH, description, currency } from ".";
import Link from 'next/link'
import axios from 'axios';
import { useRouter } from 'next/router'

// Get transaction has
// Get raspberry pi ip

const RASPBERRY_PI_IP = process.env.NEXT_PUBLIC_RASPBERRY_PI_IP;

export default function PrintTestReceipt() {

  const router = useRouter();
  const { description, value, transactionHash } = router.query;

  function printReceipt() {
    axios.get(`http://${RASPBERRY_PI_IP}/print/${value}/${description}/${transactionHash}/`)
    .then(function (res) {
      console.log(res);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  return (
    <div>
      <Header />
      <main>
        <SecondaryNav isSuccessful="False" />
        <div className="container text-center justify-content-center mt-3">
          <div className="row">
            <div className="col">
              <h3>Print receipt?</h3>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link href='/'>
                <button className="btn btn-block btn-danger">No</button>
              </Link>
            </div>
            <div className="col">
              <button className="btn btn-block btn-success" onClick={printReceipt}>Yes</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
