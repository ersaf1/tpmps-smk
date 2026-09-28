import Image from 'next/image';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { getCurrentProfile } from '@/lib/auth';
import LoginPreview from '@/components/auth/LoginPreview';
import styles from '@/components/auth/login.module.css';

export default async function LoginPage() {
  if (await getCurrentProfile()) redirect('/dashboard');

  return (
    <main className={styles.page}>
      <section className={styles.login} aria-labelledby="login-title">
        <header className={styles.brand}>
          <Image src="/logo.png" alt="Logo SMK Negeri 2 Magelang" width={44} height={52} priority />
          <div><strong>SINTESA<span> / TPMPS</span></strong><p>SMK Negeri 2 Magelang</p></div>
        </header>
        <div className={styles.formCard}>
          <div className={styles.intro}>
            <h1 id="login-title">Masuk</h1>
          </div>
          <LoginForm />
          <p className={styles.help}>Kendala akun? Hubungi admin TPMPS.</p>
        </div>
      </section>
      <LoginPreview />
    </main>
  );
}
