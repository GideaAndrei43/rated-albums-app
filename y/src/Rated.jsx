import { useState, useEffect } from 'react';
import AlbumCard from './AlbumCard';

function RatedAlbums() {
  const [ratedAlbums, setRatedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ratings = JSON.parse(localStorage.getItem('albumRatings') || '{}');

    if (Object.keys(ratings).length === 0) {
      setRatedAlbums([]);
      setLoading(false);
      return;
    }

    async function fetchRatedAlbums() {
      try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const albumPromises = Object.keys(ratings).map(async (albumId) => {
          const res = await fetch(proxyUrl + `https://api.deezer.com/album/${albumId}`);
          if (!res.ok) throw new Error(`Failed to fetch album ${albumId}`);
          const data = await res.json();
          return { ...data, rating: ratings[albumId] };
        });

        const albums = await Promise.all(albumPromises);

        albums.sort((a, b) => b.rating - a.rating);

        setRatedAlbums(albums);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchRatedAlbums();
  }, []);

  if (loading) return <p>Loading rated albums...</p>;
  if (error) return <p>Error: {error}</p>;
  if (ratedAlbums.length === 0) return <p>No rated albums yet.</p>;

  return (
    <div>
      <h1>My Rated Albums</h1>
      <div className="album_list">
        {ratedAlbums.map((album) => (
          <AlbumCard
            key={album.id}
            imageUrl={album.cover_medium}
            albumName={album.title}
            artistName={album.artist.name}
            albumId={album.id}
          />
        ))}
      </div>
    </div>
  );
}

export default RatedAlbums;
