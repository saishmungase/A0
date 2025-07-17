import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Landing from '../components/landing'
import Studio from '../components/studio'

function App() {
  return <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/studio" element={<Studio />} />
    </Routes>
  </Router>  
}

export default App
