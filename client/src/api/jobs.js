import API_URL from './config';

export const fetchJobs = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    try {
        const response = await fetch(`${API_URL}/jobs?${queryString}`);
        if (!response.ok) {
            throw new Error('Failed to fetch jobs');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
};

export const fetchJobById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/jobs/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch job');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching job:', error);
        return null;
    }
};
