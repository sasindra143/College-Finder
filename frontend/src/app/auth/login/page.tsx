'use client';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '../../../components/ui/Toaster';
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
                  <svg className={styles.spinnerIcon} fill="none" viewBox="0 0 24 24"><circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Logging in...
                </span>
              ) : 'Log In'}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>or continue with</span>
          </div>

          <button 
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`}
            className={styles.googleBtn}
          >
            <svg viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

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
