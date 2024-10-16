import { Divider, message, notification } from "antd"
import LoginPage from "../Login"
import statePush from "../../Misc/StatePush"
import { root } from "../.."
import { useState } from "react"
import { registerUser, subscribeUser } from "../../Function/Authentication"
import Logo from "../../Misc/Logo"

const RegisterPage = () => {
      const [email, setEmail] = useState("")
      const [password, setPassword] = useState("")
      const [id, setID] = useState("")
      const [name, setName] = useState("")
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
            <Logo/>
              <div className="space-y-5">
                <h1 className="lg:text-3xl xl:text-5xl xl:leading-snug font-extrabold">
                  Identity For 21st Century
                </h1>
                <p className="text-lg">Already have an account?</p>
                <button   onClick={(e)=>{
                    statePush("login")
                    root.render(<LoginPage/>)
                  }}  className="inline-block flex-none px-4 py-3 border-2 rounded-lg font-medium border-black bg-black text-white">
                 Login
                </button>
              </div>
              <p className="font-medium">© 2024 <a href="https://www.intredia.com" target="_blank">Intredia LLC</a></p>
            </div>
            {/* Login */}
            <div className="flex flex-1 flex-col items-center justify-center px-10 relative">
              <div className="flex lg:hidden justify-between items-center w-full py-4">
               <Logo/>
                
              </div>
              {/* Login box */}
              <div className="flex flex-1 flex-col  justify-center space-y-5 max-w-md">
                <div className="flex flex-col space-y-2 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Create your Identity
                  </h2>
                  <p className="text-md md:text-xl">
                    Sign up or log in to your IDC
                  </p>
                </div>
                <div >
                  <form  className="flex flex-col max-w-md space-y-5" onSubmit={(e)=>{
                    e.preventDefault()
                    setSD(true)
                      registerUser(name, email, password, id).then((e)=>{
                        message.success("Account Created Successfully")
                        window.localStorage.setItem("_tex", e.token)
                        subscribeUser(email, name, e.token).then((e)=>{
                          window.location = `./activate/${email}`
                        }).catch((e)=>{
                          message.error("Error Creating Subscription")
                        })
                      }).catch((e)=>{
                        message.error(`Account Creation Failed `)
                        setSD(false)
                      })
                  }}> 
                  <input
                    type="text"
                    disabled={sd}
                    required={true}
                    onChange={(e)=>{setName(e.target.value)}}
                    placeholder="Name"
                    className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
                  />
                  <input
                    type="text"
                    disabled={sd}
                    required={true}
                    onChange={(e)=>{setID(e.target.value)}}
                    placeholder="Card Number"
                    className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal"
                  />
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
                    CREATE IDENTITY
                  </button>
                  </form>
                
             <div className="block md:hidden">
                <div className="space-y-5 mt-4">
                <p className="text-lg">Already have an account?</p>
                <button  onClick={(e)=>{
                    statePush("login")
                    root.render(<LoginPage/>)
                  }} className="inline-block flex-none px-4 py-3 border-2 rounded-lg font-medium border-black bg-black text-white">
                  Login
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

export default RegisterPage