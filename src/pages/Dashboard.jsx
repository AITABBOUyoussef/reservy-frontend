import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axiosInstance from "../api/axios";

export default function Dashboard() {
  const [etablissements, setEtablissements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('delivery'); // Switch Livraison / Réservation

  const IMAGE_BASE_URL = "http://127.0.0.1:8000/photos/";

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await axiosInstance.get('/GetEtablissement');
        if (response.data && response.data.etablissements) {
          setEtablissements(response.data.etablissements);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des établissements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEtablissements();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 antialiased">
      {/* 1. Navbar */}
      <Navbar />

      <main className="w-full pt-20">
        <div className="flex flex-col w-full">
          
          {/* HERO & SEARCH SECTION */}
          <section className="bg-white border-b border-gray-100 py-10 px-6">
            <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
                Commandez vos plats préférés ou réservez votre table
              </h1>

              {/* Mode Switcher */}
              <div className="bg-gray-100 p-1 rounded-full flex gap-1">
                <button
                  onClick={() => setMode('delivery')}
                  className={`flex items-center gap-2 py-2 px-6 rounded-full text-sm font-bold transition-all ${
                    mode === 'delivery'
                      ? 'bg-amber-400 text-gray-900 shadow'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">moped</span>
                  Livraison
                </button>
                <button
                  onClick={() => setMode('reserve')}
                  className={`flex items-center gap-2 py-2 px-6 rounded-full text-sm font-bold transition-all ${
                    mode === 'reserve'
                      ? 'bg-teal-700 text-white shadow'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">table_restaurant</span>
                  Réservation
                </button>
              </div>

              {/* Search Bar */}
              <div className="w-full max-w-xl flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-amber-400">
                <span className="material-symbols-outlined text-gray-400 mr-2">search</span>
                <input
                  className="w-full bg-transparent outline-none text-sm font-medium placeholder-gray-400"
                  type="text"
                  placeholder={mode === 'delivery' ? "Adresse de livraison ou plat..." : "Nom du restaurant, ville..."}
                />
              </div>

            </div>
          </section>

          {/* RESTAURANTS GRID */}
          <section className="max-w-6xl mx-auto px-6 py-10 w-full">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
              Tous les restaurants
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="material-symbols-outlined animate-spin text-amber-500 text-4xl">
                  autorenew
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {etablissements.length > 0 ? (
                  etablissements.map((etab) => (
                    <div
                      key={etab.id}
                      className="group cursor-pointer flex flex-col gap-2 transition-transform duration-200 hover:-translate-y-1"
                    >
                      {/* Image Container */}
                      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-200 shadow-sm">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={`${IMAGE_BASE_URL}${etab.nom_image}`}
                          alt={etab.nom}
                        />
  
     <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow">
                          Nouveau
                        </span>
    <div className="absolute bottom-2 left-3 w-11 h-11 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center overflow-hidden">
                          <span className="material-symbols-outlined text-gray-700 text-xl">
                            restaurant
                          </span>
                        </div>
                      </div>

                      
                      <div className="flex flex-col gap-1 px-1">
                       
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-gray-900 text-base group-hover:text-amber-500 transition-colors truncate">
                            {etab.nom}
                          </h3>

                          {etab.note_moyenne && (
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold text-xs">
                              <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
                              <span>{Number(etab.note_moyenne).toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                      
                        {etab.description && (
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {etab.description}
                          </p>
                        )}

                        
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mt-1">
                          <span className="bg-red-500 text-white font-bold px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">delivery_dining</span>
                            Livraison
                          </span>
                          <span>•</span>
                          <span>{etab.ville}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-12">
                    Aucun établissement trouvé.
                  </p>
                )}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}