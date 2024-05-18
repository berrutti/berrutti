import React from "react";
import Link from "next/link";
import styles from "./music.module.css";

const Music = () => {
  const tracks = [
    "https://api.soundcloud.com/tracks/1814529540",
    "https://api.soundcloud.com/tracks/1764862005",
    "https://api.soundcloud.com/tracks/1723716168",
    "https://api.soundcloud.com/tracks/1743720393",
    "https://api.soundcloud.com/tracks/1793640583",
    "https://api.soundcloud.com/tracks/1731969813",
    "https://api.soundcloud.com/tracks/1688916678",
    "https://api.soundcloud.com/tracks/1642918674",
  ];

  return (
    <div className={styles.main}>
      <h2>Music</h2>
      <div className={styles.grid}>
        {tracks.map((track, index) => (
          <iframe
            key={index}
            width="100%"
            height="200"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
              track
            )}&color=%231e2237&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`}
          ></iframe>
        ))}
      </div>
      <Link href="/" className={styles.card}>
        <h2>Back</h2>
      </Link>
    </div>
  );
};

export default Music;
