import Link from "next/link";
import Image from "next/image";
import styles from "./main.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        {" "}
        <Image
          src="/logo.webp"
          alt="berrutti"
          width={1024}
          height={1024}
          unoptimized={true}
        />
      </div>

      <div className={styles.grid}>
        <Link href="/music" className={styles.card}>
          <h2>
            Music <span>-&gt;</span>
          </h2>
        </Link>

        <Link href="/texts" className={styles.card}>
          <h2>
            Texts <span>-&gt;</span>
          </h2>
        </Link>

        <Link href="/contact" className={styles.card}>
          <h2>
            Contact <span>-&gt;</span>
          </h2>
        </Link>
      </div>
    </main>
  );
}
