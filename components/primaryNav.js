import React from 'react'
import Link from "next/link";
import * as Icon from "react-feather";

export default class PrimaryNav extends React.Component {
    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between align-items-center">
                <div className="navbar-brand text-light font-weight-bold">
                    <img className="mr-1" src="/bam_logo.ico" height="22px" width="auto"/>
                    <i>ETHPOS</i>
                </div>
                <div className="d-flex justify-content-right">
                    <Link href="/">
                    <button
                        className="btn btn-sm btn-dark d-flex align-items-center"
                        type="submit">
                        <Icon.CreditCard size="20" />
                    </button>
                    </Link>
                    <Link href="/withdraw">
                        <button
                            className="btn btn-sm btn-dark d-flex align-items-center"
                            type="submit">
                            <Icon.ArrowDownCircle size="20" />
                        </button>
                    </Link>
                    <Link href="/logs">
                        <button
                            className="btn btn-sm btn-dark d-flex align-items-center"
                            type="submit">
                            <Icon.BookOpen size="20" />
                        </button>
                    </Link>
                    <Link href="/login">
                        <button
                            className="btn btn-sm btn-dark d-flex align-items-center"
                            type="submit">
                            <Icon.LogOut size="20" />
                        </button>
                    </Link>
                </div>
            </nav>
        ) 
    }
}