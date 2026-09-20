import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../api/axios";
import { getImageUrl } from '../utils/imageUrl';

export default function Dashboard() {
  const [etablissements, setEtablissements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('delivery');
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || null;

  const handNav = (id) => navigate(`/etablissment/${id}`); 
  
  const handGarant = () => {
    if(!token) return navigate("/login");
    navigate("/addEtablissment");
  }

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await axiosInstance.get('/GetEtablissement');
        if (response.data?.etablissements) {
          setEtablissements(response.data.etablissements);
        }
      } catch (error) {
        console.error("Erreur de récupération:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEtablissements();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 antialiased">
      <Navbar />

      <main className="w-full pt-20">
        
        {/* ================= HERO SECTION ================= */}
        <section className="bg-white border-b border-gray-100 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-gray-900 leading-tight">
              Commandez vos plats préférés ou réservez votre table
            </h1>

            {/* Mode Switcher */}
            <div className="bg-gray-100 p-1.5 rounded-full flex gap-1 w-full max-w-sm">
              <button onClick={() => setMode('delivery')} className={`flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-full text-sm font-bold transition-all ${mode === 'delivery' ? 'bg-amber-400 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                <span className="material-symbols-outlined text-[20px]">moped</span> Livraison
              </button>
              <button onClick={() => setMode('reserve')} className={`flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-full text-sm font-bold transition-all ${mode === 'reserve' ? 'bg-teal-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                <span className="material-symbols-outlined text-[20px]">table_restaurant</span> Réservation
              </button>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-2xl flex items-center bg-gray-50 rounded-full px-5 py-3.5 border border-gray-200 focus-within:border-teal-500 focus-within:bg-white focus-within:shadow-sm transition-all">
              <span className="material-symbols-outlined text-gray-400 mr-3 text-2xl">search</span>
              <input className="w-full bg-transparent outline-none text-base font-medium placeholder-gray-400" type="text" placeholder={mode === 'delivery' ? "Adresse de livraison, plat..." : "Nom du restaurant, ville..."} />
            </div>
          </div>
        </section>

        {/* ================= RESTAURANTS GRID ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
            Tous les restaurants
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined animate-spin text-teal-600 text-4xl">autorenew</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {etablissements.length > 0 ? (
                etablissements.map((etab) => (
                  <div onClick={() => handNav(etab.id)} key={etab.id} className="group cursor-pointer flex flex-col gap-3">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-sm">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={getImageUrl(etab.nom_image)} alt={etab.nom} />
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md shadow-sm">Nouveau</span>
                    </div>

                    <div className="flex flex-col gap-1.5 px-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-teal-700 transition-colors truncate">{etab.nom}</h3>
                        {etab.note_moyenne && (
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-bold text-xs shrink-0 border border-amber-100">
                            <span className="material-symbols-outlined text-[14px]">star</span>
                            <span>{Number(etab.note_moyenne).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      {etab.description && <p className="text-sm text-gray-500 line-clamp-1">{etab.description}</p>}
                      
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mt-1">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">delivery_dining</span>
                          Livraison
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="truncate">{etab.ville}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 font-medium">Aucun établissement trouvé.</p>
              )}
            </div>
          )}
        </section>
      </main>

      {/* ================= PARTNERSHIP SECTION ================= */}
      <section className="bg-teal-900 text-white w-full py-16 sm:py-20 px-4 sm:px-6 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-12 text-center">Travaillons ensemble</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 w-full">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center bg-teal-800/50 p-6 sm:p-8 rounded-3xl backdrop-blur-sm border border-teal-700/50">
              <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3">
                <span className="material-symbols-outlined text-3xl">two_wheeler</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Devenir Livreur</h3>
              <p className="text-sm text-teal-100/80 mb-6 leading-relaxed">Profitez de la flexibilité et de revenus compétitifs en livrant avec notre plateforme.</p>
              <button className="mt-auto bg-white text-teal-900 font-bold py-2.5 px-6 rounded-full hover:bg-gray-100 transition-colors w-full">S'inscrire</button>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center text-center bg-teal-800/50 p-6 sm:p-8 rounded-3xl backdrop-blur-sm border border-teal-700/50">
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg -rotate-3">
                <span className="material-symbols-outlined text-3xl">storefront</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Inscrire votre restaurant</h3>
              <p className="text-sm text-teal-100/80 mb-6 leading-relaxed">Développez votre activité et boostez vos ventes en rejoignant notre réseau.</p>
              <button onClick={handGarant} className="mt-auto bg-amber-500 text-white font-bold py-2.5 px-6 rounded-full hover:bg-amber-600 transition-colors w-full">Ajouter mon établissement</button>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center text-center bg-teal-800/50 p-6 sm:p-8 rounded-3xl backdrop-blur-sm border border-teal-700/50">
              <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3">
                <span className="material-symbols-outlined text-3xl">work</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Carrières</h3>
              <p className="text-sm text-teal-100/80 mb-6 leading-relaxed">Si vous êtes ambitieux et aimez le travail d'équipe, nous voulons vous entendre !</p>
              <button className="mt-auto bg-white text-teal-900 font-bold py-2.5 px-6 rounded-full hover:bg-gray-100 transition-colors w-full">Postuler</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}