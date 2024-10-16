import { Divider } from "antd"
import App from "../../App"
import LoginPage from "../../Pages/Login"
import { root } from "../.."
import statePush from "../StatePush"

const NotFound = () => {
    return(<div className="block mt-52 items-center justify-center min-h-screen">
      <Divider> The Following Page Was Not Found </Divider>
      <center>
      <button
          type="button"
          className="bg-[#ffe85c] h-max  w-max rounded-lg text-black font-bold  hover:cursor-pointer duration-[500ms,800ms]"
        
          onClick={(e)=>{
            statePush("login")
            root.render(<LoginPage/>)
          }}
        >
         <div className="flex items-center justify-center m-[10px]">
            <div className="ml-2">
              {" "}
              Return Home<div></div>
            </div>
          </div>
        </button>
      </center>
      </div>
      )
}
export default NotFound