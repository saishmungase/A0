import { Route, BrowserRouter as Router, Routes } from "react-router-dom"


function App() {
  return <Router>
    <Routes>
      <Route path="/" />
      <Route path="/chat" />
    </Routes>
  </Router>  
}

export default App
