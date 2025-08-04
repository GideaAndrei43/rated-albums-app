import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from './assets/icons8-search.svg';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `https://api.deezer.com/search/album?q=${encodeURIComponent(query)}&limit=5`;
        const res = await fetch(proxyUrl + apiUrl);
        const data = await res.json();
        if (data.data) {
          setSuggestions(data.data);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelect = (albumId) => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    navigate(`/album/${albumId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0].id);
    }
  };

  return (
    <div className="search_bar" ref={containerRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="q"
          placeholder="Search albums"
          value={query}
          onChange={handleInputChange}
          autoComplete="off"
          aria-label="Search albums"
        />
        <button className="search_button" type="submit" aria-label="Search">
          <img src={searchIcon} alt="" width={14} height={14} />
        </button>
      </form>
      {showDropdown && suggestions.length > 0 && (
        <ul>
          {suggestions.map((album) => (
            <li
              key={album.id}
              tabIndex={0}
              onClick={() => handleSelect(album.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSelect(album.id);
              }}
              aria-label={`Go to album ${album.title} by ${album.artist.name}`}
            >
              <img src={album.cover_small} alt={album.title} />
              <span>{album.title} - {album.artist.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
