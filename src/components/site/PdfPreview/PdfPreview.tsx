"use client";

import { useState } from "react";
import styles from "./PdfPreview.module.css";

interface Props {
  src: string;
  title: string;
}

export default function PdfPreview({ src, title }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={styles.docItem}
        onClick={() => setOpen(true)}
      >
        <iframe
          src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
          className={styles.pdfThumb}
          title={title}
        />
      </div>

      {open && (
        <div
          className={styles.modal}
          onClick={() => setOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            <iframe
              src={`${src}#toolbar=1`}
              className={styles.pdfFrame}
              title={title}
            />
          </div>
        </div>
      )}
    </>
  );
}
