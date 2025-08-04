import { useState } from 'react';
import SearchBar from './SearchBar';
import MainMenu from './Menu';
import Ham from './assets/menu.svg';
import Logo from './assets/ratemnrank.png';

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="header">
        <div>
          <button
            className="schema"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <img src={Ham} alt="Menu" />
          </button>
        </div>
        <div className="" />
        <img className="logo" src={Logo} alt="Logo" />
        <div className="search_bar">
          <SearchBar />
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div className={`side_menu ${menuOpen ? 'open' : 'closed'}`}>
        <MainMenu />
      </div>

      <main>{children}</main>
    </>
  );
}

export default Layout;
