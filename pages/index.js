import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout.js';

export default function Home() {
  return (
    <Layout>
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/conicon.ico" />
      </Head>

      <main>
        <p className={styles.description}>
          Seleccione el algoritmo que desea probar en el menú.
        </p>

      </main>

    </div>
    </Layout>
  );
}