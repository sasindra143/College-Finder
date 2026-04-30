'use client';
import { useCompare } from '@/context/CompareContext';
import Link from 'next/link';
import styles from './Compare.module.css';

export default function ComparePage() {
  const { compareList, removeFromCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>⚖️</div>
        <h1 className={styles.emptyTitle}>Comparison List is Empty</h1>
        <p className={styles.emptyText}>Add colleges from the search results to compare them side-by-side.</p>
        <Link href="/colleges" className={styles.browseBtn}>Browse Colleges</Link>
      </div>
    );
  }

  const attributes = [
    { label: 'Overall Rating', key: 'rating', type: 'progress', max: 5 },
    { label: 'Fees per Year', key: 'fees', type: 'price' },
    { label: 'Avg Package', key: 'avgPackage', type: 'text', suffix: ' LPA' },
    { label: 'Placement %', key: 'placementPercent', type: 'progress', max: 100 },
    { label: 'NIRF Rank', key: 'nirfRank', type: 'text', prefix: '#' },
    { label: 'Ownership', key: 'ownership', type: 'badge' },
    { label: 'Established', key: 'established', type: 'text' },
    { label: 'Location', key: 'location', type: 'text' },
    { label: 'Exams Accepted', key: 'exams', type: 'tags' },
    { label: 'Affiliation', key: 'affiliation', type: 'text' },
  ];

  const getBadgeClass = (val: string) => {
    if (val?.toLowerCase().includes('government')) return styles.badgeGov;
    if (val?.toLowerCase().includes('private')) return styles.badgePri;
    return styles.badgeDef;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> <span>/</span> <span className={styles.active}>Compare</span>
        </div>
        <h1 className={styles.title}>Compare Institutions</h1>
        <p className={styles.subtitle}>Analyzing {compareList.length} colleges across {attributes.length} key performance indicators.</p>
      </div>

      <div className={styles.comparisonWrapper}>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.stickyCol}>
                  <div className={styles.attributeHeader}>
                    Features & Comparison
                  </div>
                </th>
                {compareList.map(college => (
                  <th key={college.id} className={styles.collegeHeader}>
                    <div className={styles.headerContent}>
                      <button 
                        onClick={() => removeFromCompare(college.id)} 
                        className={styles.removeBtn}
                      >
                        ✕
                      </button>
                      <div className={styles.imageBox}>
                        <img 
                          src={college.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=400'} 
                          alt={college.name} 
                        />
                      </div>
                      <h3 className={styles.collegeName}>{college.name}</h3>
                      <div className={styles.locationSmall}>{college.city}, {college.state}</div>
                      <Link href={`/colleges/${college.slug}`} className={styles.detailBtn}>
                        Full Details →
                      </Link>
                    </div>
                  </th>
                ))}
                {[...Array(Math.max(0, 3 - compareList.length))].map((_, i) => (
                  <th key={`empty-${i}`} className={styles.emptyHeader}>
                    <Link href="/colleges" className={styles.addPlaceholder}>
                      <div className={styles.plusCircle}>+</div>
                      <span>Add College</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributes.map(attr => (
                <tr key={attr.key}>
                  <td className={styles.attrName}>{attr.label}</td>
                  {compareList.map(college => {
                    const val = (college as any)[attr.key];
                    return (
                      <td key={`${college.id}-${attr.key}`} className={styles.attrVal}>
                        {attr.type === 'progress' ? (
                          <div className={styles.progressWrapper}>
                            <div className={styles.progressText}>{val}{attr.max === 100 ? '%' : ''}</div>
                            <div className={styles.progressBar}>
                              <div 
                                className={styles.progressFill} 
                                style={{ width: `${(val / attr.max!) * 100}%` }}
                              />
                            </div>
                          </div>
                        ) : attr.type === 'price' ? (
                          <div className={styles.priceVal}>₹{val?.toLocaleString()}</div>
                        ) : attr.type === 'badge' ? (
                          <span className={`${styles.badge} ${getBadgeClass(val)}`}>{val || 'N/A'}</span>
                        ) : attr.type === 'tags' ? (
                          <div className={styles.tagsBox}>
                            {(val as string[] || []).slice(0, 3).map(tag => (
                              <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                          </div>
                        ) : (
                          <div className={styles.textVal}>
                            {attr.prefix}{val || 'N/A'}{attr.suffix}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {[...Array(Math.max(0, 3 - compareList.length))].map((_, i) => (
                    <td key={`empty-val-${i}`} className={styles.emptyCell}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.comparisonNote}>
        <p>💡 <b>Note:</b> Placement percentages and fee structures are indicative and subject to university changes.</p>
      </div>
    </div>
  );
}
