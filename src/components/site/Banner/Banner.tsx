import styles from "./Banner.module.css";

interface BannerProps {
  title: string;
  backgroundImg: string;
  row?: 1 | 2 | 3| 4;
  col?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
}

export default function Banner({
  title,
  backgroundImg,
  row = 2,
  col = 3,
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

      <div className={styles.content}>
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