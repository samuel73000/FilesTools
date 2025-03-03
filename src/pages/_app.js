import Layout from '@/Components/Layout';  
import '../../Global.css'; 

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
