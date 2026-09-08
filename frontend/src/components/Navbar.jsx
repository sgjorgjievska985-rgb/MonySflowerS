import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">Mony's Flowers</Link>
      <div className="navbar-nav ms-auto align-items-center">
        <Link className="nav-link" to="/">Производи</Link>
        {token && <Link className="nav-link" to="/dashboard">Дашборд</Link>}
        {token ? (
          <div className="d-flex align-items-center ms-3">
            <span className="text-light me-3">👤 {user.username}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Одјави се</button>
          </div>
        ) : (
          <Link className="btn btn-primary btn-sm ms-3" to="/login">Најави се</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;