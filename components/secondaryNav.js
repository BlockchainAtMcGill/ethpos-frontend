import React from 'react'
import Link from "next/link";
import * as Icon from "react-feather";

function BacktoConfirmButton(props) {
    return (
        <Link href={props.destination}>
        <button
            className="btn btn-sm btn-dark d-flex align-items-center"
            type="submit">
            <Icon.ArrowLeft size="20" />
        </button>
        </Link>
    )
}

function BacktoTransactionButton(props) {
    return (
        <Link href={props.destination}>
        <button
            className="btn btn-sm btn-dark d-flex align-items-center"
            type="submit">
            <Icon.ArrowLeft size="20" />
        </button>
        </Link>
    )
}

export default class SecondaryNav extends React.Component {
    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-dark">
                <div className="navbar-brand text-light font-weight-bold">
                    <img className="mr-1" src="http://blockchainmcgill.com/wp-content/uploads/2018/10/single_block_dark-e1539491437211-150x150.png" height="22px" width="auto"/>
                    <i>ETHPOS</i>
                </div>
                { this.props.isSuccessful ? <BacktoTransactionButton destination="/" /> : <BacktoConfirmButton destination="vendorConfirmation" /> }
          </nav>
        ) 
    }
}