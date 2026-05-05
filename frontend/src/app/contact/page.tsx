import styles from './Contact.module.css';

export default function ContactPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <div className={styles.heroIcon}>📫</div>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Have questions about a college or need help navigating the platform? Our support team is here to assist you.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.formCard}>
            <h2 className={styles.sectionTitle}>Send a Message</h2>
            <form className="space-y-4">
              <div className={styles.formGroup}>
                <label className={styles.label}>Your Name</label>
                <input type="text" className={styles.input} placeholder="John Doe" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input type="email" className={styles.input} placeholder="john@example.com" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Message</label>
                <textarea rows={4} className={styles.textarea} placeholder="How can we help you?"></textarea>
              </div>
              <a
                href="https://wa.me/919959732476"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.submitBtn}
              >
                Send Message
              </a>
            </form>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoItem}>
              <div className={`${styles.iconBox} ${styles.bgBlue}`}>📞</div>
              <div>
                <div className={styles.infoLabel}>Toll Free Support</div>
                <div className={styles.infoValue}>9959732476</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={`${styles.iconBox} ${styles.bgEmerald}`}>📧</div>
              <div>
                <div className={styles.infoLabel}>Email Us</div>
                <div className={styles.infoValue}>sasindragandla@gmail.com</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={`${styles.iconBox} ${styles.bgOrange}`}>📍</div>
              <div>
                <div className={styles.infoLabel}>Office Address</div>
                <div className={styles.infoValue}>Tech Park, Sector 45, Gurugram</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
