import { useState } from 'react';
import TopicList from './TopicList';

export default function CourseAccordion({ course }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        marginBottom: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <button
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f9fafb',
          padding: '1rem',
          textAlign: 'left',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
            <span style={{ fontFamily: 'monospace', color: '#4b5563' }}>
              {course.course_code}:
            </span>{' '}
            {course.course_name}
          </h3>
          <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
            {course.semester}
          </p>
        </div>
        <span style={{ marginLeft: '1rem', fontSize: '1.25rem', fontWeight: '300', color: '#6b7280' }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '1rem',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <TopicList topics={course.topics} />
        </div>
      )}
    </div>
  );
}