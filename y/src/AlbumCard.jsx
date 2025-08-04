import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function AlbumCard({ albumId, imageUrl, albumName, artistName, showRating = true }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  // Load saved rating
  useEffect(() => {
    const saved = localStorage.getItem(`album-rating-${albumId}`);
    if (saved) {
      setRating(Number(saved));
    }
  }, [albumId]);

  // Save rating
  const handleClick = (e, star) => {
    e.preventDefault(); // Prevent navigation
    const newRating = star === rating ? 0 : star;
    setRating(newRating);
    localStorage.setItem(`album-rating-${albumId}`, newRating);

    const allRatings = JSON.parse(localStorage.getItem('albumRatings') || '{}');
    if (newRating === 0) {
      delete allRatings[albumId];
    } else {
      allRatings[albumId] = newRating;
    }
    localStorage.setItem('albumRatings', JSON.stringify(allRatings));
  };

  return (
    <Link to={`/album/${albumId}`} className="album_card_link">
      <div className="album_card">
        <img src={imageUrl} alt={albumName} />
        <h3>{albumName}</h3>
        <p>{artistName}</p>

        {showRating && (
          <div className="rating_stars" onClick={(e) => e.preventDefault()}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  cursor: 'pointer',
                  color: star <= (hover || rating) ? 'gold' : 'lightgray',
                  fontSize: '1.5rem',
                }}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={(e) => handleClick(e, star)}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default AlbumCard;
