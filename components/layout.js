import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';

const name = 'Proyecto de IO';
export const siteTitle = 'Proyecto de IO';

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/conicon.ico" />
        <meta
          name="description"
          content="Aplicación para utilizar algoritmos de optimización"
        />

        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            <Image
              priority
              src="/images/algorithms.jpg"
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt=""
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <Image
                priority
                src="/images/algorithms.jpg"
                className={utilStyles.borderCircle}
                height={108}
                width={108}
                alt=""
              />
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/" className={utilStyles.colorInherit}>
                {name}
              </Link>
            </h2>
          </>
        )}
        </header>
      <div className={styles.horizontalmenu}>
      <ul>
          <li title="El Algoritmo de Floyd busca encontrar las rutas más cortas entre distintos nodos de un grafo."><Link href="floyd">Algoritmo de Floyd</Link></li>
          <li title="El problema del Reemplazo de Equipos consiste en optimizar los costos asociados al mantenimiento y reemplazo de equipos conforme pasan los años."><Link href="equipos">Reemplazo de Equipos</Link></li>
          <li title="El problema de las Series Deportivas consiste en calcular la probabilidad de que un equipo gane la serie a n partidos conforme a una probabilidad dada y a los resultados de los partidos anteriores en la misma serie."><Link href="series">Series Deportivas</Link></li>
        </ul>
        </div>

      

      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Regresar al Inicio</Link>
        </div>
      )}
            <footer className={styles.footer}>
        <a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer">
          Programación Dinámica. Por Adrián Díaz{' '}
          <img src="/conicon.ico" alt="Proyect" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}