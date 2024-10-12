import { Divider, message, notification } from "antd"
import RegisterPage from "../Register"
import statePush from "../../Misc/StatePush"
import { root } from "../.."
import { useState } from "react"
import { LoginUser, registerUser } from "../../Function/Authentication"

const LoginPage = () => {
      const [email, setEmail] = useState("")
      const [password, setPassword] = useState("")
      const [sd, setSD] = useState(false)

return(<>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "\n  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');\n\n  html, body{\n    font-family: 'Roboto', sans-serif;\n  }\n\n  .break-inside {\n    -moz-column-break-inside: avoid;\n    break-inside: avoid;\n  }\n  body {\n    display: flex;\n    justify-content: space-between;\n    flex-direction: column;\n    min-height: 100vh;\n    line-height: 1.5;\n  }\n  \n"
          }}
        />
        {/* Example */}
        <div className="flex min-h-screen">
          {/* Container */}
          <div className="flex flex-row w-full">
            {/* Sidebar */}
            <div className="hidden lg:flex flex-col justify-between bg-[#ffe85c] lg:p-8 xl:p-12 lg:max-w-sm xl:max-w-lg">
              <div className="flex items-center justify-start space-x-3">
                <span className="bg-black rounded-full w-8 h-8" />
                <a href="#" className="font-medium text-xl">
                  Intredia Identity
                </a>
              </div>
              <div className="space-y-5">
                <h1 className="lg:text-3xl xl:text-5xl xl:leading-snug font-extrabold">
                  Identity For 21st Century
                </h1>
                <p className="text-lg">Don't have an account?</p>
                <button   onClick={(e)=>{
                    statePush("register")
                    root.render(<RegisterPage/>)
                  }}  className="inline-block flex-none px-4 py-3 border-2 rounded-lg font-medium border-black bg-black text-white">
                 Register
                </button>
              </div>
              <p className="font-medium">© 2024 <a href="https://www.intredia.com" target="_blank">Intredia LLC</a></p>
            </div>
            {/* Login */}
            <div className="flex flex-1 flex-col items-center justify-center px-10 relative">
              <div className="flex lg:hidden justify-between items-center w-full py-4">
                <div className="flex items-center justify-start space-x-3">
                  <span className="bg-black rounded-full w-6 h-6" />
                  <a href="#" className="font-medium text-lg">
                    Intredia Identity
                  </a>
                </div>
                
              </div>
              {/* Login box */}
              <div className="flex flex-1 flex-col  justify-center space-y-5 max-w-md">
                <div className="flex flex-col space-y-2 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Access your Account
                  </h2>
                  <p className="text-md md:text-xl">
                    Sign up or log in to your IDC
                  </p>
                </div>
                <div >
                  <form  className="flex flex-col max-w-md space-y-5" onSubmit={(e)=>{
                    e.preventDefault()
                    setSD(true)
                      LoginUser(email, password).then((e)=>{
                        message.success("Logged in Successfully")
                        console.log(e)
                        window.localStorage.setItem("_tex", e.token)
                        window.location = "./"
                      }).catch((e)=>{
                        message.error(`Login Failed`)
                        setSD(false)
                      })
                  }}> 
                 
                  <input
                    type="email"
                    disabled={sd}
                    required={true}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    placeholder="Email"
                    className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
                  />
                  <input
                    type="password"
                    disabled={sd}
                    required={true}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    placeholder="Password"
                    className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
                  />
                  <button type="submit"
                  disabled={sd} className={`flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium ${sd ? "border-gray-500 bg-gray-500" : "border-black bg-black"} text-white`}>
                    LOGIN
                  </button>
                  </form>
                
             <div className="block md:hidden">
                <div className="space-y-5 mt-4">
                <p className="text-lg">Don't have an account?</p>
                <button  onClick={(e)=>{
                    statePush("register")
                    root.render(<RegisterPage/>)
                  }} className="inline-block flex-none px-4 py-3 border-2 rounded-lg font-medium border-black bg-black text-white">
                  Register
                </button>
              </div>
             </div>
                </div>
              </div>
              {/* Footer */}
            
            </div>
          </div>
        </div>
        {/* Example */}
      </>
      )
}

export default LoginPage