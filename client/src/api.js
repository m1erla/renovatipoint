import axios from 'axios';

axios.interceptors.request.use(
    function (config) {
        const {origin} = new URL(config.url);
        const allowedOrigins = [process.env.REACT_APP_BASE_URL_API];
        const token = localStorage.getItem('access-token');

        if(allowedOrigins.includes(origin)){
            config.headers.authorization = token;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
)

export const fetchUserList = async ({pageParam = 0}) => {
    const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL_API}/consumers?page=${pageParam}`
    )
    return data;
}

export const fetchJobTitles = async () => {
    const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL_API}/job_titles`
    )
    return data;
}

export const fetchMasters = async (id) => {
    const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL_API}/masters/${id}`
    )
    return data;
}

export const fetchRegister = async (input) => {
    const  { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL_API}/auth/register`, input
    )
    return data;
}