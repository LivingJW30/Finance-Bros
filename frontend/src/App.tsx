import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import UserHomePage from './pages/UserHomePage';
import CardPage from './pages/CardPage';
import AddStockPage from './pages/AddStockPage';
function App() {
  return (

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<UserHomePage />} />
      <Route path="/add-stock" element={<AddStockPage />} />
      <Route path="/cards" element={<CardPage />} />
    </Routes>

  );
}
export default App;
