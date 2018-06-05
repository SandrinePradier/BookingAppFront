import axios from 'axios';

let http = axios.create({
	baseURL: 'http://localhost:2707/client',
})


export default http;