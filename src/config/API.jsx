import axios from 'axios';
export const API = axios.create({
  baseURL: 'https://103.82.92.190/api/v1/',
  // baseURL : process.env.RREACT_APP_BASEURL || 'http://localhost:5000/api/v1'
  //  baseURL : 'http://localhost:5000/api/v1'
  // 'https://mcdm.up.railway.app/api/v1/
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};
