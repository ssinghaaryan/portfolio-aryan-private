// import Navbar from "./components/Navbar/navbar"
// import Home from "./pages/Home";
// import Projects from './pages/Projects'
// import History from "./pages/History";
import { Toaster } from "react-hot-toast";
import Photos from "./pages/Photos";
// import Track from "./track/Track";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from './ScrollToTop';
import Footer from "./components/Footer/Footer";
import Music from "./music/Music";
import BottomNavbar from "./components/BottomNavbar/BottomNavbar";

function App() {
  return (
    <div id='app'>
      {/* <Navbar /> */}
      <ScrollToTop />
      <Routes>
        {/* <Route path='/' element={<Home />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/history' element={<History />} /> */}
        {/* <Route path='/photos' element={<Photos />} /> */}
        <Route path='/' element={<Music />} />
        {/* <Route path="/track" element={<Track />} /> */}
        <Route path='/photos' element={<Photos />} />
      </Routes>
      <BottomNavbar />
      <Toaster position="bottom-center" reverseOrder={false} />
      <Footer />
    </div>
  );
}

export default App;
