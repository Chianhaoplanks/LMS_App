import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEnrolledCoursesWithTopics, getEnrolledCoursesWithTopicsAdmin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CourseAccordion from '../components/CourseAccordion';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const userState = location.state;
  const { signOut } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userState) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        let response = {};
        if (userState.user_id === 1) {
          response = await getEnrolledCoursesWithTopicsAdmin();
        } else {
          response = await getEnrolledCoursesWithTopics(userState.user_id);
        }
        setCourses(response.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        if (err.response) {
          console.error('Server responded with a status:', err.response.status);
          console.error('Response data:', err.response.data);
        } else if (err.request) {
          console.error('Request was made but no response received:', err.request);
        } else {
          console.error('Something else went wrong:', err.message);
        }

      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userState, navigate]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
      style={{
        maxWidth: '64rem',
        margin: '0 auto',
        padding: '1.5rem 1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
        <button
          onClick={handleSignOut}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: '#ef4444',
            border: 'none',
            borderRadius: '0.375rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#dc2626')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#ef4444')}
        >
          Sign Out
        </button>
      </div>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c' }}>
          Welcome, {userState.user_name}
        </h1>
        <div
          style={{
            marginTop: '0.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748' }}>
            My Courses
          </h2>
        </div>
      </header>

      {courses.length === 0 ? (
        <div
          style={{
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            textAlign: 'center',
            color: '#6b7280',
          }}
        >
          You're not enrolled in any courses yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {courses.map((course) => (
            <CourseAccordion key={course.course_id} course={course} />
          ))}
        </div>
      )}
    </div>

  );
}