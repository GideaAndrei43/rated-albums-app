import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div className="menu_block">
      <nav className="side_bar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/my-rankings">My Rankings</Link></li>
          <li><Link to="/top-rated">Top Rated</Link></li>
          <li><Link to="/global-rankings">Global Rankings</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Menu;
