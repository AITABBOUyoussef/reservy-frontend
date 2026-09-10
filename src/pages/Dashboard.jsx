import React, { useState, useEffect } from 'react';
// Zidna Navbar w axiosInstance li katkhdem bih f ga3 les composants
import Navbar from '../components/Navbar'; 
import axiosInstance from "../api/axios";

export default function Dashboard() {
  const [etablissements, setEtablissements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('delivery'); // Gère le switch Livraison/Réservation

  // Fetch data mn l'API
  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        // Bdelna axios b axiosInstance bach yakhod baseURL w l'token automatiquement
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

  const scrollCategories = (delta) => {
    const track = document.getElementById('category-track');
    if (track) {
      track.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      
      {/* 1. 7etina Navbar lfo9 */}
      <Navbar />

      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full">
          
          {/* HERO SECTION */}
          <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-main via-surface-card to-surface pb-space-3xl">
            <div className="max-w-container-max mx-auto px-gutter-desktop pt-space-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                <div className="lg:col-span-7 flex flex-col gap-space-md z-10">
                  <div className="inline-flex items-center gap-space-xs self-start bg-badge-organic px-space-md py-1.5 rounded-full shadow-sm">
                    <span className="material-symbols-outlined text-badge-organic-text text-[18px]">verified</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-badge-organic-text font-extrabold">Circuit Court & 100% Terroir</span>
                  </div>
                  <h1 className="font-display-lg text-display-lg text-on-surface leading-tight font-extrabold">
                    Les saveurs fraîches & locales livrées à votre porte, <span className="text-primary-container">ou sur votre table réservée.</span>
                  </h1>
                  
                  <div className="bg-surface-white rounded-lg p-space-md shadow-xl flex flex-col gap-space-sm mt-space-xs">
                    {/* Mode Switcher Tabs */}
                    <div className="grid grid-cols-2 p-1 bg-surface-card rounded-full">
                      <button 
                        onClick={() => setMode('delivery')} 
                        className={`flex items-center justify-center gap-space-xs py-2.5 px-space-md rounded-full font-label-lg text-label-lg transition-all ${mode === 'delivery' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">moped</span>
                        <span>Livraison express</span>
                      </button>
                      <button 
                        onClick={() => setMode('reserve')} 
                        className={`flex items-center justify-center gap-space-xs py-2.5 px-space-md rounded-full font-label-lg text-label-lg transition-all ${mode === 'reserve' ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">table_restaurant</span>
                        <span>Réserver une table</span>
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-space-xs bg-surface rounded-full p-1.5 pl-space-md">
                      <div className="flex items-center gap-space-xs flex-1 w-full">
                        <span className="material-symbols-outlined text-secondary text-[22px]">pin_drop</span>
                        <input className="w-full bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-outline font-medium" placeholder={mode === 'delivery' ? "Saisissez votre quartier ou adresse..." : "Rechercher une table..."} type="text" />
                      </div>
                      <button className="w-full sm:w-auto px-space-lg py-3 rounded-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md transition-all active:scale-95">
                        Trouver mon festin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DYNAMIC FEATURED RESTAURANT CARDS GRID */}
          <section className="max-w-container-max mx-auto px-gutter-desktop pb-space-3xl w-full pt-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
              <div>
                <div className="inline-flex items-center gap-space-xs text-secondary font-label-sm text-label-sm uppercase font-extrabold tracking-widest mb-1">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span> Sélection Éthique & Certifiée
                </div>
                <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Tables & Fourneaux en Vedette</h2>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
                {etablissements.length > 0 ? (
                  etablissements.map((etab) => (
                    <div key={etab.id} className="group bg-surface-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-card">
                        <img 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400" 
                          alt={etab.nom} 
                        />
                        <div className="absolute top-3 left-3 bg-secondary text-on-secondary font-label-sm text-label-sm font-black px-space-xs py-1 rounded-full shadow-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span> {etab.ville}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-badge-organic text-badge-organic-text font-label-sm text-label-sm font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[14px]">eco</span> {etab.statut === 'acceptee' ? 'Vérifié' : 'Nouveau'}
                        </div>
                      </div>
                      
                      <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                        <div>
                          <div className="flex items-center justify-between gap-space-xs">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold group-hover:text-primary-container transition-colors truncate">
                              {etab.nom}
                            </h3>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2" title={etab.description}>
                            {etab.description}
                          </p>
                          <p className="font-body-sm text-body-sm text-outline mt-1 truncate">
                            <span className="material-symbols-outlined text-[14px] align-middle mr-1">map</span> 
                            {etab.adresse}
                          </p>
                        </div>
                        
                        <div className="pt-space-xs flex items-center justify-between border-t border-surface-container/60">
                          <div className="flex flex-col">
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{etab.telephone}</span>
                          </div>
                          <button aria-label={`Réserver chez ${etab.nom}`} className="w-10 h-10 rounded-full bg-primary-container hover:bg-primary text-on-primary flex items-center justify-center shadow-sm transition-transform active:scale-95" type="button">
                            <span className="material-symbols-outlined text-[20px]">event_seat</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-on-surface-variant py-10">Aucun établissement trouvé pour le moment.</p>
                )}
              </div>
            )}
          </section>

          {/* FOOTER */}
          <footer className="w-full bg-surface-card mt-space-3xl">
            <div className="max-w-container-max mx-auto px-gutter-desktop pt-space-2xl pb-space-xl">
              <div className="mt-space-2xl pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-on-surface-variant">
                <p>© 2026 Reservy Inc. Cultivé & cuisiné avec passion.</p>
              </div>
            </div>
          </footer>
          
        </div>
      </main>
    </div>
  );
}