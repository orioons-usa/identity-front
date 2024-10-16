import axios from "axios"


export const LoginUser = (email, password) => {
    return new Promise((res, rej)=>{
        axios.post("https://api.id.intredia.com/api/auth/login", {email, password}).then((e)=>{
            res(e.data)
        }).catch((e)=>{
            rej(e)
        })
    })
}
export const registerUser = (name, email, password, id) => {
    return new Promise((res, rej)=>{
     axios.post("https://api.id.intredia.com/api/auth/register", {name, email, password, id, profile: {name : name, email : email,}}).then((e)=>{
         res(e.data)
     }).catch((e)=>{
         rej(e)
     }) 
     })
 }

 export const fetchUser = (token) => {
    return new Promise((res, rej)=>{
     axios.post("https://api.id.intredia.com/api/auth/fetch", {
    
     }, {
        headers: {
            "x-auth-token": token
        }
     }).then((e)=>{
         res(e.data)
     }).catch((e)=>{
         rej(e)
     }) 
     })
 }
 
export const subscribeUser = (email, name, token) => {
    return new Promise((res, rej)=>{
        axios.post("https://api.id.intredia.com/api/auth/subscribe", {name, email}, {
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
export const checkPaymentStatus = (email, session_id) => {
    return new Promise((res, rej)=>{
        axios.post(`https://api.id.intredia.com/api/auth/payment/success/${email}`).then((e)=>{
            res(e.data)
        }).catch((e)=>{
            rej(e)
        })

    })
 
}