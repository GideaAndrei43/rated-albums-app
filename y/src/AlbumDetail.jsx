import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function AlbumDetail() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);

  // Rating state: load saved rating from localStorage or default 0
  const [rating, setRating] = useState(() => {
    const saved = localStorage.getItem(`album-rating-${albumId}`);
    return saved ? Number(saved) : 0;
  });

  // Share button feedback
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `https://api.deezer.com/album/${albumId}`;

        const res = await fetch(proxyUrl + apiUrl);
        const data = await res.json();
        setAlbum(data);
      } catch (error) {
        console.error('Failed to fetch album details:', error);
      }
    }
    fetchAlbum();
  }, [albumId]);

  // Save rating to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`album-rating-${albumId}`, rating);
  }, [albumId, rating]);

  if (!album) return <div>Loading...</div>;

  // Handle star click
  const handleStarClick = (star) => {
    const newRating = star === rating ? 0 : star;
    setRating(newRating);
    saveRating(albumId, newRating);
  };

  // Save rating
  function saveRating(albumId, rating) {
    const storedRatings = JSON.parse(localStorage.getItem('albumRatings') || '{}');
    if (rating === 0) {
      delete storedRatings[albumId];  // Optionally remove if rating cleared
    } else {
      storedRatings[albumId] = rating;
    }
    localStorage.setItem('albumRatings', JSON.stringify(storedRatings));
  }

  // Share function
  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: album.title,
      text: `Check out this album: ${album.title} by ${album.artist.name}`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareMessage('Album shared successfully!');
      } catch (err) {
        setShareMessage('Share canceled or failed.');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShareMessage('Album URL copied to clipboard!');
      } catch (err) {
        setShareMessage('Failed to copy URL. Please copy manually.');
      }
    }
    // Clear message after 3 seconds
    setTimeout(() => setShareMessage(''), 3000);
  };

  return (
    <div className="album_detail">
      <h2>{album.title}</h2>
      <img src={album.cover_medium} alt={album.title} />
      <p>Artist: {album.artist.name}</p>
      <p>Release Date: {album.release_date}</p>

      <p>Tracks:</p>
      <ul>
        {album.tracks.data.map(track => (
          <li key={track.id}>{track.title}</li>
        ))}
      </ul>
      <div className="bottom-album-detail">
      <div className="rating">
        <p>Your Rating:</p>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            style={{
              cursor: 'pointer',
              fontSize: '2rem',
              color: star <= rating ? 'gold' : 'lightgray',
              userSelect: 'none',
            }}
            onClick={() => handleStarClick(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleStarClick(star); }}
          >
            ★
          </span>
        ))}
        
      </div>
         <button
        onClick={handleShare}
        className="share-button"
        aria-label="Share this album"
        style={{
          marginTop: '1rem',
          padding: '10px 20px',
          backgroundColor: '#949494ff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}
      >
        Share Album
      </button>
      {shareMessage && <p style={{ marginTop: '0.5rem', color: 'green' }}>{shareMessage}</p>}
     </div>
    </div>
  );
}

export default AlbumDetail;
