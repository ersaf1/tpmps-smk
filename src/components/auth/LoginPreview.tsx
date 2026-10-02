'use client';

import { useState } from 'react';
import { FileText, FolderClosed } from 'lucide-react';
import styles from './login.module.css';

const categories = [
  { name: 'Manual Mutu', files: ['Kebijakan mutu sekolah', 'Pedoman penjaminan mutu', 'Sasaran mutu sekolah'] },
  { name: 'Prosedur Mutu', files: ['Prosedur pengendalian dokumen', 'Prosedur audit internal', 'Prosedur tinjauan manajemen'] },
  { name: 'Catatan Mutu', files: ['Notulen rapat evaluasi', 'Catatan hasil audit', 'Laporan tindak lanjut'] },
];

export default function LoginPreview() {
  const [selected, setSelected] = useState(0);
  const category = categories[selected];

  return (
    <aside className={styles.information} aria-label="Tentang SINTESA TPMPS">
      <div className={styles.story}>
        <h2>Arsip dokumen mutu</h2>
      </div>
      <div className={styles.archive}>
        <div className={styles.archiveHeading}><FolderClosed size={22} aria-hidden="true" /><span>TPMPS</span><small>Contoh arsip</small></div>
        <div className={styles.categories} aria-label="Pilih contoh jenis dokumen">
          {categories.map((item, index) => (
            <button key={item.name} type="button" aria-pressed={selected === index} aria-controls="archive-preview" onClick={() => setSelected(index)}>
              {item.name}
            </button>
          ))}
        </div>
        <div id="archive-preview" className={styles.preview} aria-live="polite" aria-atomic="true">
          <div key={category.name} className={styles.previewContent}>
            {category.files.map((file) => <div className={styles.file} key={file}><FileText size={18} aria-hidden="true" /><span>{file}</span><span className={styles.fileExtension}>PDF</span></div>)}
          </div>
        </div>
      </div>
    </aside>
  );
}
