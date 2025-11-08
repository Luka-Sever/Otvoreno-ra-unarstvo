import { useLocation } from 'react-router-dom'
import './App.css'
import Datatable from './Datatable'
import Home from './Home'

function App() {
  const path = window.location.pathname  
  if (path == "/")
    return (
      <>
        <nav>
          <a href="/">Home</a> | <a href="/datatable">Datatable</a>
          <Home/>
        </nav>
      </>
    )
  else return (
      <>
        <nav>
          <a href="/">Home</a> | <a href="/datatable">Datatable</a>
          <Datatable/>
        </nav>
      </>
    )
}

export default App
