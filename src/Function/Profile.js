import axios from "axios"

export const updateUser = (token, data) => {
    
    return new Promise((res, rej)=>{
        axios.post("https://api.id.intredia.com/update", {...data}, {
            headers:{
                "x-auth-token": token
            }
        }).then((e)=>{
            res(e.data)
        }).catch((e)=>{
            rej(e)
        })
    })
}


export const getPublicProfile = (token, data) => {
    return new Promise((res, rej)=>{
        axios.get(`https://api.id.intredia.com/${token}`, {...data}, {
        }).then((e)=>{
            res(e.data)
        }).catch((e)=>{
            rej(e)
        })
    })
}