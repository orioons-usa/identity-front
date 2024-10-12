const Loading = () => {
    return(<div className="flex items-center justify-center min-h-screen">
        <button
          type="button"
          className="bg-[#ffe85c] h-max w-max rounded-lg text-black font-bold  hover:cursor-not-allowed duration-[500ms,800ms]"
          disabled=""
        >
          <div className="flex items-center justify-center m-[10px]">
            <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-black border-4" />
            <div className="ml-2">
              {" "}
              Syncing with the server. <div></div>
            </div>
          </div>
        </button>
      </div>
      )
}
export default Loading