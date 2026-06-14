// import Navbar from "./components/Navbar/navbar"
// import Home from "./pages/Home";
// import Projects from './pages/Projects'
// import History from "./pages/History";
import { Toaster } from "react-hot-toast";
import Photos from "./pages/Photos";
// import Track from "./track/Track";
import { Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from './ScrollToTop';
import Login from "../src/auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import SectionSelector from "./SectionSelector";
import Footer from "./components/Footer/Footer";
import Music from "./music/Music";
import Notes from "../src/notes/Notes";
import Finance from "../src/finance/Finance"
import BottomNavbar from "./components/BottomNavbar/BottomNavbar";

function App() {
  return (
    <div id='app'>
      {/* <Navbar /> */}
      <ScrollToTop />
      
      {/* <Routes> */}
        {/* <Route path='/' element={<Home />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/history' element={<History />} /> */}
        {/* <Route path='/photos' element={<Photos />} /> */}
        {/* <Route path='/' element={<Music />} /> */}
        {/* <Route path="/track" element={<Track />} /> */}
        {/* <Route path='/photos' element={<Photos />} />
        <Route path='/notes' element={<Notes />} />
        <Route path='/finance' element={<Finance />} /> */}
        {/* </Routes> */}

          <Routes>
        {/* Public */}
        <Route path='/login' element={<Login />} />

        {/* Section selector — home */}
        <Route path='/' element={
          <ProtectedRoute><SectionSelector /></ProtectedRoute>
        } />

        {/* Protected sections */}
        <Route path='/music' element={
          <ProtectedRoute><Music /></ProtectedRoute>
        } />
        <Route path='/photos' element={
          <ProtectedRoute><Photos /></ProtectedRoute>
        } />
        <Route path='/notes' element={
          <ProtectedRoute><Notes /></ProtectedRoute>
        } />
        <Route path='/finance' element={
          <ProtectedRoute><Finance /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
        
      <BottomNavbar />
      <Toaster position="bottom-center"
        toastOptions={{
          style: {
            marginBottom: "100px"
          },
        }}
      />
      <Footer />
    </div>
  );
}

export default App;
