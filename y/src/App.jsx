import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AlbumDetail from './AlbumDetail';
import RatedAlbums from './Rated';
import Home from './Home';
import Layout from './Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/top-rated" element={<RatedAlbums />} />
          <Route path="/album/:albumId" element={<AlbumDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
