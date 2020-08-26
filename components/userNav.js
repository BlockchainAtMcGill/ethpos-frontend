import React from 'react'

export default class UserNav extends React.Component {
    render() {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-dark justify-content-between">
                <div className="navbar-brand text-light font-weight-bold">
                    <img className="mr-1" src="/bam_logo.ico" height="22px" width="auto"/>
                    <i>ETHPOS</i>
                </div>
            </nav>
        ) 
    }
}