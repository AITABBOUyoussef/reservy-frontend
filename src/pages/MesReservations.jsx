import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar"
import { getImageUrl } from '../utils/imageUrl';
;

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const response = await axiosInstance.get('/reservations');
      if (response.data && response.data.reservations) {
        setReservations(response.data.reservations);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const getStatutStyle = (statut) => {
    switch(statut) {
      case 'acceptee': 
        return 'bg-green-100 text-green-700 border-green-200';
      case 'refusee': 
        return 'bg-red-100 text-red-700 border-red-200';
      case 'en_attente': 
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default: 
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handNav = (id) => navigate(`/etablissment/${id}`);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900 antialiased">
      <Navbar />

      <main className="w-full pt-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
            Mes Réservations
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined animate-spin text-teal-600 text-4xl">autorenew</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservations.length > 0 ? (
                reservations.map((res) => {
                  // Hna kan-jbdo l-ma3loumat mn l-JSON dyalek
                  const nomRestaurant = res.etablissement.nom 
                  const ville = res.etablissement.ville ;
                  const dateReservation = res.date_reservation;
                  const heureReservation = res.heure_reservation;
                  const nombrePersonnes = res.nombre_personnes;
                  const montantTotal = res.montant_total;
                  const numeroTable = res.table?.numero || "?";
                  const statut = res.statut;
                  const img = res.etablissement.images[0].nom_image;
            //    console.log(img);

                  return (
                    <div key={res.id} onClick={() => handNav(res.etablissement?.id)} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer group">
                      
                      {/* Image w Statut l-fo9 */}
                      <div className="relative h-40 bg-gray-200 overflow-hidden">
                        <img 
                           src={getImageUrl(img)} alt='zz'
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border uppercase tracking-wider ${getStatutStyle(statut)}`}>
                            {statut.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Ma3loumat l-asasiya */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-xl font-black text-gray-900 mb-1 line-clamp-1 group-hover:text-teal-700 transition-colors">
                          {nomRestaurant}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          {ville}
                        </p>

                        {/* Détails dyal la réservation */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3 border border-gray-100">
                          <div className="flex items-center justify-between text-sm text-gray-700 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-teal-600 text-[18px]">calendar_month</span>
                              <span>{dateReservation}</span>
                            </div>
                            <span className="font-bold text-gray-900">{heureReservation.substring(0, 5)}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-700 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-teal-600 text-[18px]">group</span>
                              <span>{nombrePersonnes} personne(s)</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-sm text-xs font-bold">
                              <span className="material-symbols-outlined text-teal-600 text-[14px]">table_restaurant</span>
                              N° {numeroTable}
                            </div>
                          </div>
                        </div>

                        {/* Footer dyal l-carte: Prix w Bouton */}
                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Total</p>
                            <p className="text-lg font-black text-teal-700">{Number(montantTotal).toFixed(2)} DH</p>
                          </div>
                          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-teal-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                            Détails
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                      
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                  <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">event_busy</span>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune réservation</h3>
                  <p className="text-gray-500">Vous n'avez pas encore effectué de réservation.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}