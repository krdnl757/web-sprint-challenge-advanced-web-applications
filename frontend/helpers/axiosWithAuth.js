import axios from "axios"

export const axiosWithAuth = () => {
    if (localStorage.getItem('token')) {
        return axios.create({headers: {Authorization: localStorage.getItem('token')}})
    } else {
        return axios.create();
    }
}




