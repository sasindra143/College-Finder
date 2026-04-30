'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '@/components/ui/Toaster';
import styles from '../Auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Left - Branding Panel */}
      <div className={styles.brandingPanel}>
        <div className={styles.brandingContent}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>CC</div>
            <span className={styles.logoText}>CareerCampus</span>
          </div>
          <h1 className={styles.heroTitle}>Your journey to the perfect college starts here</h1>
          <p className={styles.heroSubtitle}>
            Compare 37,000+ colleges, check placements, read reviews, and make the best decision for your future.
          </p>
          <div className={styles.featuresList}>
            {[
              { icon: '🔍', text: 'Search & filter across 37,000+ colleges' },
              { icon: '⚖️', text: 'Compare colleges side-by-side' },
              { icon: '❤️', text: 'Save your favourites to your dashboard' },
              { icon: '📊', text: 'Check placements & fee structures' },
            ].map((item, i) => (
              <div key={i} className={styles.featureItem}>
                <span className={styles.featureIcon}>{item.icon}</span>
                <span className={styles.featureText}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div className={styles.formLogo}>CC</div>
            <h2 className={styles.formTitle}>Welcome Back</h2>
            <p className={styles.formSubtitle}>Log in to access your saved colleges</p>
          </div>

          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                placeholder="you@example.com"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.passwordToggleBtn}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <span className={styles.loadingSpinner}>
                  <svg className={styles.spinnerIcon} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Logging in...
                </span>
              ) : 'Log In'}
            </button>
          </form>

          <div className={styles.switchAuthText}>
            Don't have an account?{' '}
            <Link href="/auth/signup" className={styles.switchAuthLink}>
              Create one free →
            </Link>
          </div>

          <div className={styles.backToHome}>
            <Link href="/" className={styles.backLink}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
