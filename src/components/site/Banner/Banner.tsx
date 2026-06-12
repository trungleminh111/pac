import styles from "./Banner.module.css";

interface BannerProps {
  title: string;
  backgroundImg: string;
  row?: 1 | 2 | 3 | 4 | 5;
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  fontSize?: string;
  children?: React.ReactNode;
}

export default function Banner({
  title,
  backgroundImg,
  row = 2,
  col = 3,
  fontSize = "clamp(28px, 5vw, 54px)",
  children,
}: BannerProps) {
  return (
    <section
      className={`${styles.banner} ${styles[`row-${row}`]} ${styles[`col-${col}`]}`}
    >
      <img
        src={backgroundImg}
        alt={title}
        className={styles.bannerImage}
      />

      <div className={styles.overlay} />

       <div
        className={styles.content}
        style={
          fontSize
            ? ({ "--banner-font-size": fontSize } as React.CSSProperties)
            : undefined
        }
      >
        <h1>{title}</h1>
      </div>

      {children && (
        <div className={styles.bannerBody}>
          {children}
        </div>
      )}
    </section>
  );
}