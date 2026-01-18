import { Link, Route, Routes } from 'react-router-dom';
import '../stylesheets/App.css'
import Datatable from './Datatable'
import Home from './Home'
import { useAuth0 } from '@auth0/auth0-react'
import Profile from './UserProfile';

function App() {
  const {
    isLoading,
    isAuthenticated,
    error, 
    loginWithRedirect: login,
    logout: auth0Logout,
    user
  } = useAuth0();
    const prijava = () => {
      return isAuthenticated ? 
        <>Pozdrav, {user.name} <button onClick={logout}>Odjavi se</button>
          <Link to="/profile" id="profile">Korisnički profil</Link> 
            </> 
          : // TODO: pitati što je Osvježavanje preslike
        <><button onClick={signup}>Registriraj se</button>
          <button onClick={() => login({ 
            appState: { returnTo: location.pathname }})}>Prijavi se</button></>
  }
  const signup = () => 
    login({ authorizationParams : {screen_hint: "signup" } });
  const logout = () => 
    auth0Logout({logoutParams : {returnTo : window.location.origin}});

  if (isLoading) return "Loading...";

  const path = window.location.pathname;
    return (
      <>
        <nav>
          <Link to="/" id="home">Home</Link> | <Link to="/datatable" id='datatable'>Datatable</Link>
          <span className='space'></span>
          {prijava()}
        </nav>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/datatable' element={<Datatable isAuthenticated={isAuthenticated}/>} />
          <Route path='/profile' element={<Profile user={user} />} />
        </Routes>
      </>
    )
}

export default App
