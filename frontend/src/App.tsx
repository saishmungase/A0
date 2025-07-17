import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Landing from '../components/landing'

function App() {
  return <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/studio" />
    </Routes>
  </Router>  
}

export default App
