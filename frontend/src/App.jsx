import './App.scss'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FreeformChat from './components/Chat/FreeformChat'
import StoryChat from './components/Chat/StoryChat';
import Home from './components/Home/Home'
import Dashboard from './components/Dashboard/Dashboard';
import SettingsInput from './components/Dashboard/SettingsInput';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ExamPreparationChat from './components/Chat/ExamPreparationChat';
import Map from './components/StoryMode/Map/Map';
import PlacePage from './components/StoryMode/PlacePage';
import StoryDashboard from './components/StoryMode/StoryDashboard';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ProtectedRoute element={<FreeformChat />} /> } />
        <Route path="/exam-chat" element={<ProtectedRoute element={<ExamPreparationChat />} /> } />
        <Route path="/story/chat" element={<ProtectedRoute element={<StoryChat />} /> } />
        <Route path="/story/map/place/:placeId" element={<ProtectedRoute element={<PlacePage />} />} />
        <Route path="/story/dashboard" element={<ProtectedRoute element={<StoryDashboard />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/dashboard/conversation-settings" element={<ProtectedRoute element={<SettingsInput />} />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
