import useRouter from 'next/router';

import axios from 'axios';

import Header from "../components/head";
import PrimaryNav from '../components/primaryNav';


const HOST = process.env.NEXT_PUBLIC_HOST;

export default class TransactionLogs extends React.Component {
  state = {
      log_list: [],
  }

  componentDidMount() {
    if(localStorage.getItem('token') == null) {
        useRouter.push('/login');
    }
    
    axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.getItem('token');

    axios.get(`${HOST}/api/`, {
    })
    .then((res) => {
        this.setState({
            log_list: res.data
        });
    })
    .catch((err) => {
        console.log(err);
    });

  }

  componentWillUnmount() {
  }

  render() {
      return (
          <div>
            <Header />
            <PrimaryNav />
            <main className="container">
                <div className="text-center font-weight-bold mt-2">
                    Transaction Logs
                </div>
                <table className="table table-sm table-striped mt-2">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Price</th>
                            <th scope="col">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.log_list.map((item, index) => (
                                <tr key={item.id}>
                                    <th scope="row">{index+1}</th>
                                    <td>{item.price}</td>
                                    <td>{item.description}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </main>
        </div>
    );
  }
}