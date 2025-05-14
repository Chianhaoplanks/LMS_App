import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Login
export const login = (loginId) => API.post('/auth/login', { loginId });

// Dashboard Endpoints
export const getEnrolledCoursesWithTopics = (userId) => API.get(`/courses/user/${userId}`);
export const getEnrolledCoursesWithTopicsAdmin = () => API.get(`/courses`);
export const getTopicWithEntries = (topicId) => API.get(`/topics/${topicId}`);
export const createEntry = (entryData) => API.post('/entries', entryData);