
import { useEffect, useState } from "react"
import Logo from "../Logo"
import { Collapse, message, QRCode } from "antd"
import NotFound from "../Not Found"
import { checkPaymentStatus } from "../../Function/Authentication"

const ActivationPage = () => {
      const [email, setEmail] = useState("")
      const [sd, setSD] = useState(false)
      const [ paymentUrl, setPaymentUrl] = useState("")
      const [ errorMes, setErrorMes] = useState(false)

      const qr = [
       { key: "paymentQR",
        label: "Show Payment QR",
        children:  <center>
        <QRCode value={paymentUrl || '-'} status={sd === false ? "loading" : "active"} />
        </center>
       }
      ]
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      let _o
      useEffect((e)=>{
           _o = window.location.pathname.split("/")
            _o.splice(0,2)
              _o = _o[0]
               if(emailRegex.test(_o)){
                  setEmail(_o)
                  checkPaymentStatus(email).then((e)=>{
                    window.location = "./"
                  }).catch((e)=>{
                    console.log(e.response.data.link)
                    setPaymentUrl(e.response.data.link)
                    setSD(true)
                  })
               }else{
                  setErrorMes(true)
               }
                
      })

return(<>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "\n  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');\n\n  html, body{\n    font-family: 'Roboto', sans-serif;\n  }\n\n  .break-inside {\n    -moz-column-break-inside: avoid;\n    break-inside: avoid;\n  }\n  body {\n    display: flex;\n    justify-content: space-between;\n    flex-direction: column;\n    min-height: 100vh;\n    line-height: 1.5;\n  }\n  \n"
          }}
        />
      {
        errorMes === false ?  <div className="flex min-h-screen">
        {/* Container */}
        <div className="flex flex-row w-full">
          {/* Sidebar */}
          <div className="hidden lg:flex flex-col justify-between bg-[#ffe85c] lg:p-8 xl:p-12 lg:max-w-sm xl:max-w-lg">
           <Logo/>
            <div className="space-y-5">
              <h1 className="lg:text-3xl xl:text-5xl xl:leading-snug font-extrabold">
                Identity For 21st Century
              </h1>
             
            </div>
            <p className="font-medium">© 2024 <a href="https://www.intredia.com" target="_blank">Intredia LLC</a></p>
          </div>
          {/* Login */}
          <div className="flex flex-1 flex-col items-center justify-center px-10 relative">
            <div className="flex lg:hidden justify-between items-center w-full py-4">
            <Logo/>
              
            </div>
            {/* Login box */}
            <div className="flex flex-1  flex-col md:flex justify-center space-y-5 max-w-md">
           
              <div className="flex flex-col space-y-2 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">
                Subscribe to Start
                </h2>
                <p className="text-md md:text-xl">
                 Uniform your Identity
                </p>    <p className="text-sm md:text-sm text-gray-500">
                {email}
                </p>
              </div>
              <div >
                <form  className="flex flex-col max-w-md space-y-5" onSubmit={(e)=>{
                  e.preventDefault()
                   
                }}> 

              <center>  
                <h1 className="text-4xl"><span className="text-xl">$</span>39.99<span className="text-xl">/Year</span></h1>
                <span className="text-sm ml-16">$3.33/Month</span>
              </center>
            
                <button  type="submit" onClick={(e)=>{
                  window.location = paymentUrl
                }}
                disabled={!sd} className={`flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium ${!sd ? "border-gray-500 bg-gray-500" : "border-black bg-black"} text-white`}>
                  SUBSCRIBE
                </button>

               <Collapse items={qr}>
               </Collapse>
                </form>
              
      
              </div>
            </div>
            {/* Footer */}
          
          </div>
        </div>
      </div> : <NotFound></NotFound>
      }
      </>
      )
}

export default ActivationPage