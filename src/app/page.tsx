import Link from "next/link";
import Image from "next/image";
import styles from "./main.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Image
          src="/logo.png"
          alt="berrutti"
          width={1024}
          height={1024}
          unoptimized={true}
        />
      </div>

      <div className={styles.grid}>
        <a href="https://soundcloud.com/berrutti" target="_blank" rel="noopener noreferrer" className={styles.card}>
          <h2>music</h2>
        </a>

        <Link href="/texts" className={styles.card}>
          <h2>texts</h2>
        </Link>

        <a href="mailto:berrutti@gmail.com" className={styles.card}>
          <h2>contact</h2>
        </a>
      </div>
    </main>
  );
}
