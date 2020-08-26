import useRouter from 'next/router';

import axios from 'axios';

import Header from "../components/head";
import PrimaryNav from '../components/primaryNav';
import UserNav from '../components/userNav';


const HOST = process.env.NEXT_PUBLIC_HOST;

export default class LoginControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            errorMessage: ""
        };
    }

    componentDidMount() {
        //   Wait till localStorage is defined (client side)
        this.setState({
            isLoggedIn: localStorage.getItem('token') != null,
        });
    }

    componentWillUnmount() {
    }

    refreshState() {
        this.setState({
            isLoggedIn: localStorage.getItem('token') != null
        });
    }

    render() {
        let state;
        if (this.state.isLoggedIn) {
            state = <Logout refreshState={this.refreshState.bind(this)} />;
        } else {
            state = <Login refreshState={this.refreshState.bind(this)} />;
        }

        const isLoggedIn = this.state.isLoggedIn;

        return (
            <div>
                <Header />
                {isLoggedIn ? <PrimaryNav /> : <UserNav />}
                <main className="container text-center">
                    {state}
                </main>
                <style jsx>{`
                .form-group {
                    margin-bottom: 0.2rem;
                }
            `}
                </style>
            </div>
        );
    }
}

// Login Form
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({
            [name]: event.target.value,
        });
    }

    login() {
        axios.post(`${HOST}/api/rest-auth/login/`,
            {
                username: this.state.username,
                password: this.state.password,
            }, {
        })
            .then((res) => {
                // Store token
                localStorage.setItem('token', res.data.key);
                // Clear error message
                this.setState({
                    errorMessage: ""
                });
                // Change state to logged in
                this.props.refreshState();

                // Redirect
                useRouter.push("/");


            })
            .catch((error) => {
                this.setState({
                    errorMessage: "Invalid username/password combination"
                });
            });
    }

    render() {
        return (
            <form>
                <div className="text-center font-weight-bold mt-2">
                    Sign In
                </div>
                <div className="form-group mt-1">
                    <label htmlFor="InputAddress">Ethereum Address</label>
                    <input type="text" className="form-control" id="InputAddress" name="username" aria-describedby="addresshelp" value={this.state.username} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="form-group">
                    <label htmlFor="InputPassword">Password</label>
                    <input type="password" className="form-control" id="InputPassword" name="password" onChange={this.handleChange.bind(this)} />
                </div>
                <p className="text-danger mb-1">{this.state.errorMessage}</p>
                <button type="button" className="btn btn-sm btn-primary mt-1" onClick={this.login.bind(this)}>Sign In</button>
            </form>
        )

    }
}

// Logout button
class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    logout() {
        localStorage.removeItem('token');
        // Change state to logged out
        this.props.refreshState();
    }

    render() {
        return (
            <main>
                <div className="text-center font-weight-bold mt-5 d-flex align-items-center justify-content-center">
                    Are you sure you want to sign out?
                </div>
                <button className="btn btn-block btn-danger mt-4" onClick={this.logout.bind(this)}>Sign Out</button>
            </main>
        )
    }
}
