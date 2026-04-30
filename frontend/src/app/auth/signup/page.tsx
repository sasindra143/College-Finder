'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from '@/components/ui/Toaster';
import styles from '../Auth.module.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success('Account created! Welcome to CareerCampus');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
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
          <h1 className={styles.heroTitle}>Join 2M+ students making smarter decisions</h1>
          <p className={styles.heroSubtitle}>
            Create your free account to save colleges, track comparisons, and get personalized recommendations.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '37,000+', label: 'Colleges' },
              { value: '2M+', label: 'Students' },
              { value: '200+', label: 'Exams' },
              { value: '36', label: 'States' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs font-bold text-brand-200 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Signup Form */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div className={styles.formLogo}>CC</div>
            <h2 className={styles.formTitle}>Create Account</h2>
            <p className={styles.formSubtitle}>It's free and takes less than 30 seconds</p>
          </div>

          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.inputField}
                placeholder="e.g. Rahul Sharma"
              />
            </div>
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
                  placeholder="Min 6 characters"
                  minLength={6}
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
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.inputField}
                  placeholder="Confirm your password"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
              style={{ marginTop: '8px' }}
            >
              {loading ? (
                <span className={styles.loadingSpinner}>
                  <svg className={styles.spinnerIcon} fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Creating account...
                </span>
              ) : 'Create Free Account'}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-400 text-center font-medium">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div className={styles.switchAuthText}>
            Already have an account?{' '}
            <Link href="/auth/login" className={styles.switchAuthLink}>
              Log in →
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
