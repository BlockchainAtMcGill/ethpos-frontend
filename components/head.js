import Head from "next/head";

export default class Header extends React.Component {
    render()  {
        return (
            <Head>
                <title>ETHPOS</title>
                <link
                    rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
                    crossOrigin="anonymous"
                />
            </Head>
        )
    }
}