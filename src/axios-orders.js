import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-9e95c.firebaseio.com/'
});

export default instance;