import axios from "axios";

const API_URL = "http://localhost:8081/";
export const AuthHeader = ()=>{
    const token = sessionStorage.getItem("jwtToken");
    console.log("token : ",token)
    if(token){
        return {Authorization: 'Bearer '+token};
    }else{
        return {};
    }
};

export const getProtectedResource = (endpoint)=>{
    return axios.get(`${API_URL}${endpoint}`,{headers:AuthHeader()});
};