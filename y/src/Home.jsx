import SearchBar from './SearchBar';
import AlbumCard from './AlbumCard';
import Ham from './assets/menu.svg';
import MainMenu from './Menu';
import Logo from './assets/ratemnrank.png';
import { useState, useEffect } from 'react';

function Home() {
  const genres = [
    { name: 'Fresh Albums', id: 0 },
    { name: 'Rap', id: 116 },
    { name: 'Pop', id: 132 },
  ];

  const [albumsByGenre, setAlbumsByGenre] = useState({});

  useEffect(() => {
    genres.forEach(({ id, name }) => {
      fetchAlbums(id, (data) => {
        setAlbumsByGenre((prev) => ({ ...prev, [name]: data }));
      });
    });

    async function fetchAlbums(genreId, setter) {
      try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `https://api.deezer.com/chart/${genreId}/albums?limit=30`;

        const res = await fetch(proxyUrl + apiUrl);
        const data = await res.json();
        setter(data.data || []);
      } catch (error) {
        console.error(`Error fetching genre ${genreId}:`, error);
      }
    }
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      
      <div>
      

        {Object.entries(albumsByGenre).map(([genreName, albums]) => (
          <div key={genreName}>
            <h2>{genreName}</h2>
            <div className="album_list">
              {albums.slice(0, 40).map((album, idx) => (
                <AlbumCard
                  key={`${genreName}-${idx}`}
                  imageUrl={album.cover_medium}
                  albumName={album.title}
                  artistName={album.artist.name}
                  albumId={album.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
