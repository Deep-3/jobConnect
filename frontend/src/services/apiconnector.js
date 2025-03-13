import axios from "axios";

export const axiosInstance =axios.create({})

export const apiconnector=(method,url,bodyData,headers,params)=>{
    return axiosInstance({
        method:method,
        url:url,
        withCredentials: true,
        data:bodyData?bodyData:null,
        headers:headers?headers:{'Content-Type':'application/json'},
        params:params?params:null
    })

}