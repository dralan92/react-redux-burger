import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-81503.firebaseio.com/'
});

export default instance;

