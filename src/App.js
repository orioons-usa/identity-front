import './App.css';
import LoginPage from './Pages/Login';
import { useState, useEffect } from 'react';
import Loading from './Misc/Loading';
import NotFound from './Misc/Not Found';
import RegisterPage from './Pages/Register';
import { fetchUser } from './Function/Authentication';
import { message } from 'antd';
import UserProfile from './Pages/User Page';
import PublicUser from './Pages/Public User';
import ActivationPage from './Misc/Activation';

function App (Page) {
  const [currentPage, setCurrentPage] = useState(<Loading/>);
  const regex = /^[A-Z]\d{9}$/;

  const setPage = (pageSlug) => {
    switch (pageSlug) {
      case "":
        let token = window.localStorage.getItem("_tex")
        if(token !== '' && token !== null && token !== undefined){
          fetchUser(token).then((e)=>{
              if(e.subscriptionStatus !== "inactive"){
                window.localStorage.setItem("_vData", JSON.stringify(e))
                setCurrentPage(<UserProfile/>)
              }else{
                window.location = `https://id.intredia.com/activate/${e.email}`
              }
          
          }).catch((e)=>{
            message.info("Session Expired!")
            window.localStorage.setItem("_tex", "")
            window.location = "./login"
          })
        }else{
          setCurrentPage(<LoginPage/>); 
        }
        break;
        case "activate":
          setCurrentPage(<ActivationPage/>); 
          break;
        case "login":
          setCurrentPage(<LoginPage/>); 
          break;
        case "register":
          setCurrentPage(<RegisterPage/>); 
          break;
      default:
        
        if(regex.test(pageSlug.replaceAll("%20", ''))){
            setCurrentPage(<PublicUser/>)
        }else{
          setCurrentPage(<NotFound/>);
        }
        break;
    }
  }

  useEffect(() => {
    const page = window.location.pathname.split("/")
    page.splice(0,1)

    setPage(page[0])
   
  }, []);

  return (
    <div className="App">
      {currentPage}
    </div>
  );
}



export default App;
