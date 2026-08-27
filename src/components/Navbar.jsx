import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
const backendUrl = "http://127.0.0.1:8000/photos/";

  const handleLogout = () => {
     localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tight text-emerald-600">
            Reservy<span className="text-gray-800">.</span>
          </Link>

          {/* Links / Actions */}
          <div className="flex items-center gap-4">
            {token ? (
              /* User M'connecté: Affiche Profil, Dashboard w Logout */
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Dashboard
                </Link>

                <Link
                  to="/profil"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
<img src={`${backendUrl}${user.avatar}`} alt="Avatar" className="w-16 h-16 rounded-full object-cover border"/>

                    {/* <img src="{user.avatar_url}" alt="" className="w-16 h-16 rounded-full object-cover border border-emerald-500" /> */}
                  </div>
                  <span className="hidden sm:inline">{user?.name || "Mon Profil"}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              /* User Ma m'connectich: Affiche Login w Inscription */
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-emerald-600 px-3 py-2 transition-colors"
                >
                  Connexion
                </Link>

                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-emerald-600/20 transition-all duration-200"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}