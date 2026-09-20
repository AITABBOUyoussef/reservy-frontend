import { useState } from 'react';
import axiosInstance from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AllEtablissment from './AllEtablissment';
import AddEtablissment from './AddEtablissment';

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('attente');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
   <div className="flex flex-col md:flex-row min-h-screen pt-[30px] md:pt-0 md:h-screen bg-gray-50 font-sans text-gray-900 md:overflow-hidden">
      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shadow-sm z-20 shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center shrink-0">
          <h2 className="text-2xl font-black text-teal-600 flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
            Admin
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('attente')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'attente' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
          >
            <span className="material-symbols-outlined">pending_actions</span>
            En attente
          </button>

          <button 
            onClick={() => setActiveTab('tous')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'tous' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
          >
            <span className="material-symbols-outlined">storefront</span>
            Tous les restaurants
          </button>

          <button 
            onClick={() => setActiveTab('ajouter')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'ajouter' ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Ajouter
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all">
            <span className="material-symbols-outlined">logout</span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col h-full w-full overflow-hidden bg-gray-50/50">
        
        {/* ================= HEADER & NAV (MOBILE) ================= */}
        <div className="md:hidden flex flex-col bg-white border-b border-gray-200 z-20 shadow-sm shrink-0">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-black text-teal-600 flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
              Espace Admin
            </h2>
            <button onClick={handleLogout} className="text-red-500 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[20px] flex">logout</span>
            </button>
          </div>
          
          {/* Les boutons f t-téléphone wllaw hna (Scroll Horizontal) */}
          <div className="flex overflow-x-auto gap-2 px-4 pb-3 scrollbar-hide">
            <button 
              onClick={() => setActiveTab('attente')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all shadow-sm ${activeTab === 'attente' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
              En attente
            </button>
            <button 
              onClick={() => setActiveTab('tous')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all shadow-sm ${activeTab === 'tous' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              Tous les restaurants
            </button>
            <button 
              onClick={() => setActiveTab('ajouter')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all shadow-sm ${activeTab === 'ajouter' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Ajouter
            </button>
          </div>
        </div>

        {/* ================= CONTENU DES ONGLETS ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 w-full">
          {activeTab === 'attente' && <DemandesEnAttente />}
          {activeTab === 'tous' && <AllEtablissment />}
          {activeTab === 'ajouter' && <AddEtablissment />}
        </div>
      </main>

    </div>
  );
}

// ================= COMPOSANT: DEMANDES EN ATTENTE =================
function DemandesEnAttente() {
  const [attentes, setAttentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAttentes = async () => {
    try {
      const response = await axiosInstance.get('/EtablissementAttente');
      const data = response.data.Etablissement_en_attente;
      const dataArray = Array.isArray(data) ? data : (data ? [data] : []);
      setAttentes(dataArray);
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttentes();
  }, []);

  const handleAction = async (id, gerant_id, statutAction) => {
    setActionLoading(id);
    try {
      await axiosInstance.post('/AcceptEtablissement', {
        IdEtablissement: id,
        statut: statutAction,
        gerant_id: gerant_id
      });
      setAttentes(prev => prev.filter(etab => etab.id !== id));
    } catch (error) {
      console.error(`Erreur lors de l'action ${statutAction}:`, error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="material-symbols-outlined animate-spin text-teal-600 text-5xl">autorenew</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Demandes en attente</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Examinez et acceptez ou refusez les nouveaux établissements.</p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl font-bold text-sm border border-amber-100 self-start sm:self-auto shrink-0 shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          {attentes.length} Demande(s)
        </div>
      </div>

      {attentes.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
          {attentes.map((etab) => (
            <div key={etab.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-5 sm:p-6 flex-1">
                <div className="flex justify-between items-start mb-3 gap-3">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900">{etab.nom}</h3>
                  <span className="bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md border border-blue-100 uppercase tracking-wider shrink-0">
                    Nouveau
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">{etab.description}</p>
                
                <div className="space-y-3 text-sm text-gray-700 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-teal-600 bg-white p-1 rounded-md shadow-sm">location_on</span>
                    <span className="break-words line-clamp-1">{etab.adresse}, {etab.ville}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-teal-600 bg-white p-1 rounded-md shadow-sm">call</span>
                    <span>{etab.telephone}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAction(etab.id, etab.gerant_id, 'acceptee')}
                  disabled={actionLoading === etab.id}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all shadow-sm ${
                    actionLoading === etab.id ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] flex">check_circle</span>
                  Accepter
                </button>
                
                <button
                  onClick={() => handleAction(etab.id, etab.gerant_id, 'refusee')}
                  disabled={actionLoading === etab.id}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-red-600 bg-white border border-red-200 transition-all shadow-sm ${
                    actionLoading === etab.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:border-red-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] flex">cancel</span>
                  Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10 sm:p-16 text-center flex flex-col items-center mt-6 sm:mt-10">
          <div className="bg-green-50 text-green-500 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">Tout est à jour !</h2>
          <p className="text-gray-500 mt-2 max-w-sm text-sm sm:text-base">Il n'y a aucune demande d'établissement en attente pour le moment.</p>
        </div>
      )}
    </div>
  );
}