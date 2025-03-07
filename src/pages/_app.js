import Layout from '@/Components/Layout';  
import Head from 'next/head';
import '../../Global.css'; 

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <link rel="icon" href="/favicom.ico" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
