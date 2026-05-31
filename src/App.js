// import Navbar from "./components/Navbar/navbar"
// import Home from "./pages/Home";
// import Projects from './pages/Projects'
// import History from "./pages/History";
import Photos from "./pages/Photos";
// import Track from "./track/Track";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from './ScrollToTop';
import Footer from "./components/Footer/Footer";
import Music from "./music/Music";

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
        <Route path='/' element={<Photos />} />
        {/* <Route path="/track" element={<Track />} /> */}
        <Route path='/music' element={<Music />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
