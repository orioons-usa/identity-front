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