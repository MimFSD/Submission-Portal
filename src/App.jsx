import { useEffect, useState } from "react"
import axios from "axios"
import Notifications from "./Components/Notifications"

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    axios.get("https://hackathon-backend-tau.vercel.app/")
    .then(res => setData(res.data))
    .catch(err => console.log(err))
  }, [])

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        {data}
        Hello World!
      </h1>
      <Notifications type=""/>
    </>
  )
}

export default App