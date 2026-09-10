import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const backendUrl = "http://127.0.0.1:8000/photos/";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role"); 
    navigate("/login");
  };

  const userRole = user?.roles?.[0]?.name || 'visiteur'; 

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-white/95 backdrop-blur-xl shadow-[0_2px_16px_rgba(69,26,3,0.06)]">
      {/* Zedt gap-8 hna bach nfar9o ga3 les blocs kbar */}
      <div className="max-w-container-max mx-auto px-gutter-desktop h-20 flex items-center justify-between gap-8">
        
        {/* Logo et Localisation */}
        <div className="flex items-center gap-space-lg shrink-0">
          <Link to="/" className="flex items-center gap-space-xs cursor-pointer">
            <span className="font-headline-lg text-headline-lg tracking-tight text-primary-container font-extrabold">Reservy</span>
          </Link>
          
          {(userRole === 'client' || !token) && (
            <button className="hidden xl:flex items-center gap-space-xs bg-surface-card hover:bg-surface-container px-space-md py-space-xs rounded-full transition-colors text-left" type="button">
              <span className="material-symbols-outlined text-secondary text-[20px]">location_on</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Livrer à</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate max-w-[190px]">Casablanca, Maroc - Maintenant</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
            </button>
          )}
        </div>

        {/* Barre de recherche centrale */}
        <div className="hidden md:flex flex-1 max-w-xl mx-auto items-center bg-surface-card rounded-full px-space-md py-space-xs gap-space-xs">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
          <input className="bg-transparent border-none outline-none font-body-md text-body-md text-on-surface placeholder:text-outline w-full" placeholder="Rechercher établissements, plats..." type="text" />
          <button className="bg-surface-white hover:bg-surface-container text-on-surface-variant px-space-xs py-1 rounded-full flex items-center gap-1 transition-colors" type="button">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span className="font-label-sm text-label-sm">Filtres</span>
          </button>
        </div>

        {/* Côté Droit : Groupement Nav + Actions */}
        {/* Zedt gap-8 hna bach tb3ed navigation 3la l'boutounat */}
        <div className="flex items-center gap-8 shrink-0">
          
          <nav className="hidden lg:flex items-center gap-2">
            {(!token || userRole === 'client') && (
              <Link to="/etablissements" className="px-space-md py-space-xs transition-all bg-primary-container text-on-primary font-label-lg rounded-full shadow-[0_2px_8px_rgba(77,124,15,0.25)]">
                Établissements
              </Link>
            )}

            {(token && userRole === 'client') && (
              <Link to="/reservations" className="px-space-md py-space-xs font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-all">
                Mes Réservations
              </Link>
            )}

            {(token && userRole === 'gerant') && (
              <Link to="/mon-etablissement" className="px-space-md py-space-xs font-label-lg text-label-lg text-secondary bg-surface-card hover:bg-surface-container rounded-full transition-all font-bold">
                Gérer mon établissement
              </Link>
            )}
          </nav>

          {/* Actions Utilisateur */}
          <div className="flex items-center shrink-0">
            
            {(token && userRole === 'client') && (
              <button aria-label="Panier d'achats" className="relative flex items-center justify-center w-11 h-11 rounded-full bg-surface-card hover:bg-surface-container text-primary-container transition-colors" type="button">
                <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary font-label-sm text-label-sm w-5 h-5 rounded-full flex items-center justify-center font-bold">3</span>
              </button>
            )}

            {/* HNA FIN BEDDELT L'MASAFA BZAF */}
            {/* gap-8 = far9 kbir bin Connexion w Inscription | pl-8 = far9 kbir 3la liser d l'kht | ml-6 = far9 kbir 3la limen d l'kht */}
            <div className="flex items-center gap-8 pl-8 border-l-2 border-surface-container ml-6">
              {token ? (
                <>
                  <Link to="/profil" className="flex items-center gap-3 text-on-surface hover:text-primary transition-colors">
                    {user?.avatar ? (
                      <img src={`${backendUrl}${user.avatar}`} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-primary-container shadow-sm"/>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm shadow-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="hidden sm:flex flex-col">
                      <span className="font-label-md text-label-md font-bold">{user?.name || "Mon Profil"}</span>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                        {userRole}
                      </span>
                    </div>
                  </Link>

                  <button onClick={handleLogout} className="bg-error-container text-error hover:bg-error hover:text-on-error font-label-sm text-label-sm px-4 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-sm ml-4">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span className="hidden sm:inline">Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-base font-bold text-on-surface hover:text-primary transition-colors">
                    Connexion
                  </Link>
                  <Link to="/register" className="bg-primary-container hover:bg-primary text-on-primary text-sm font-bold px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                    Inscription
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}