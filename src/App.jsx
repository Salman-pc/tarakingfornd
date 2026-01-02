import {  Route, Routes, useNavigate } from 'react-router-dom';
import AuthForm from './components/auth';
import CustomerView from './components/CustomerView.jsx'
import { useEffect } from 'react';

function App() {
  
  const tripId = 'TRIP-001';
  const navigate = useNavigate()
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    } 

  }, [accessToken]);

  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<AuthForm mode="login" />} /> */}
        <Route path="/signup" element={<AuthForm mode="signup" />} />
        <Route
          path="/"
          element={accessToken ? <CustomerView tripId={tripId}  /> : <AuthForm mode="login" />}
        />
         <Route path="*" element={<NOtfoundpage />} />

      </Routes>
    </div>

  )
}

export default App;


export const NOtfoundpage = () => {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}