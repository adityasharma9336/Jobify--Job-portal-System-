import API_URL from './config';

export const fetchCompanies = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_URL}/companies?${queryString}` : `${API_URL}/companies`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch companies');
    return response.json();
};

export const fetchCompanyById = async (id) => {
    const response = await fetch(`${API_URL}/companies/${id}`);
    if (!response.ok) throw new Error('Failed to fetch company');
    return response.json();
};
