import axios from "axios";
import { API_URL, NOT_CONNECT_NETWORK, NETWORK_CONNECTION_MESSAGE } from './constants.service';
import { checkRefreshToken, signOut } from './auth.service';
import join from "url-join";

const isAbsoluteURLRegex = /^(?:\w+:)\/\//;
let failedQueue = [];
let isRefreshing = false;
let checked = false;

const processQueue = () => {
    failedQueue.forEach(prom => {
        axios(prom)
    })
    
    failedQueue = [];
}

axios.interceptors.request.use( request => {
    let Config = request.config

    if (!isAbsoluteURLRegex.test(request.url)) {
        if (Config.param !== null) request.url = join(API_URL, request.url, Config.param)
        else request.url = join(API_URL, request.url)
    }

    return request
})

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        let originalRequest = error.config;

        if (error.response.status === 403 && error.response.data.message === "No token provided!" && !originalRequest._retry) { 
            if ( isRefreshing ) {
                failedQueue.push(originalRequest)
            }

            originalRequest._retry = true;
            isRefreshing = true;

            if ( !checked ) {
                return new Promise(function (resolve, reject) {
                    checked = true
                    checkRefreshToken()
                    .then(({data}) => {
                        checked = false;
                        processQueue();
                        resolve(axios(originalRequest));
                    })
                    .catch((err) => {
                        checked = false;
                        signOut();
                        localStorage.removeItem(`${process.env.REACT_APP_PREFIX}_USER`);
                        failedQueue = []
                        reject(err)
                    })
                    .finally(() => { isRefreshing = false })
                })
            }
        } else if (axios.isCancel(error)) {
            return Promise.reject(error);
        } else if (!error.response) {
            return Promise.reject({
                code: NOT_CONNECT_NETWORK,
                message: NETWORK_CONNECTION_MESSAGE,
            });
        }
        else return Promise.reject(error)

        return Promise.reject(error)
    }
)

export default axios;