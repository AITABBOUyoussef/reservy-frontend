import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  // HNA T7ELL L-MOCHKIL DYAL LOGIC: Kanjbdo l-role mn localStorage kima drti f Login.jsx
  const storedRole = localStorage.getItem("role");
  const userRole = storedRole || user?.roles?.[0]?.name || 'visiteur'; 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role"); 
    navigate("/login");
  };

  // Kanseddo l-menu dyal téléphone fach kanbdlo l-page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO W LOCALISATION */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900 tracking-tight">Reservy</span>
          </Link>
          
          {(userRole === 'client' || !token) && (
            <div className="hidden xl:flex items-center gap-2 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
              <span className="material-symbols-outlined text-teal-600 text-[20px]">location_on</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-500">Livrer à</span>
                <span className="text-sm font-bold text-gray-800">Casablanca, Maroc</span>
              </div>
            </div>
          )}
        </div>

        {/* BARRE DE RECHERCHE (DESKTOP) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-teal-500 focus-within:bg-white">
          <span className="material-symbols-outlined text-gray-500 text-[20px] mr-2">search</span>
          <input 
            className="bg-transparent outline-none text-sm w-full font-medium" 
            placeholder="Rechercher..." 
            type="text" 
          />
        </div>

        {/* NAVIGATION DESKTOP */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {(!token || userRole === 'client') && (
              <Link to="/" className="text-sm font-bold text-gray-700 hover:text-teal-600">
                Établissements
              </Link>
            )}

            {(token && userRole === 'client') && (
              <Link to="/" className="text-sm font-bold text-gray-700 hover:text-teal-600">
                Mes Réservations
              </Link>
            )}

            {/* ZT LIK HAD L-BOUTON DYAL GARANT HNA */}
            {(token && userRole === 'gerant') && (
              <Link to="/dashboardGarant" className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-teal-100 transition-colors">
                Gérer mon établissement
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
            {token ? (
              <div className="flex items-center gap-4">
                <Link to="/profil" className="flex items-center gap-3">
                  {user?.avatar ? (
                    <img src={getImageUrl(user.avatar)} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200"/>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">{user?.name?.split(' ')[0] || "Profil"}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-500">{userRole}</span>
                  </div>
                </Link>

                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-[24px]">logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-teal-600">
                  Connexion
                </Link>
                <Link to="/register" className="bg-teal-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-teal-700">
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* BOUTON MENU HAMBURGER (MOBILE) */}
        <div className="flex lg:hidden items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-gray-800 p-2"
          >
            <span className="material-symbols-outlined text-[28px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* MENU MOBILE (KAYBAN GHIR F T-TÉLÉPHONE) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-lg px-4 py-6 flex flex-col gap-6">
          
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3">
            <span className="material-symbols-outlined text-gray-500 mr-2">search</span>
            <input 
              className="bg-transparent outline-none text-sm w-full font-medium" 
              placeholder="Rechercher..." 
              type="text" 
            />
          </div>

          <nav className="flex flex-col gap-4">
            {(!token || userRole === 'client') && (
              <Link to="/" className="text-base font-bold text-gray-800 flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400">storefront</span> Établissements
              </Link>
            )}

            {(token && userRole === 'client') && (
              <Link to="/" className="text-base font-bold text-gray-800 flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400">event_seat</span> Mes Réservations
              </Link>
            )}

            {/* ZT LIK HAD L-BOUTON TA F L-MENU DYAL T-TELEPHONE */}
            {(token && userRole === 'gerant') && (
              <Link to="/dashboardGarant" className="text-base font-bold text-teal-700 flex items-center gap-3 bg-teal-50 p-3 rounded-xl">
                <span className="material-symbols-outlined">manage_accounts</span> Gérer mon établissement
              </Link>
            )}
          </nav>

          <hr className="border-gray-100" />

          {token ? (
            <div className="flex flex-col gap-4">
              <Link to="/profil" className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                {user?.avatar ? (
                  <img src={getImageUrl(user.avatar)} alt="Avatar" className="w-12 h-12 rounded-full object-cover"/>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{user?.name}</span>
                  <span className="text-xs uppercase font-bold text-teal-600">{userRole}</span>
                </div>
              </Link>

              <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-xl">
                <span className="material-symbols-outlined">logout</span>
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" className="text-center font-bold text-gray-800 bg-gray-100 py-3 rounded-xl">
                Connexion
              </Link>
              <Link to="/register" className="text-center font-bold text-white bg-teal-600 py-3 rounded-xl">
                Créer un compte
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}