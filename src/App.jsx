import { useState } from 'react'
import './App.css'
// import { Button } from 'antd'
import { Button } from "@/components/ui/button"

function App() {
  const [count, setCount] = useState(0)

  return (
   <div className="p-6 space-y-4">
      <Button type="primary">Ant Design Button</Button>
      <button className="btn btn-secondary text-2xl">DaisyUI Button</button>
      <p className="text-xl font-bold text-blue-600">Tailwind Text</p>
      <button className="btn btn-neutral">Neutral</button>
      <div className="p-6 space-y-4">
      <Button>ShadCN Button</Button>
    </div>
    </div>
  )
}

export default App
