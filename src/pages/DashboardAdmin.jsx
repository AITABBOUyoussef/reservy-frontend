import { useState, useEffect } from 'react';
import axiosInstance from "../api/axios";
import { useNavigate } from 'react-router-dom';
import AllEtablissment from './AllEtablissment';
export default function DashboardAdmin() {

  const [activeTab, setActiveTab] = useState('attente');
  const navigate = useNavigate();

 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
    
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100 text-center">
          <h2 className="text-2xl font-extrabold text-teal-600 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
            Admin
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('attente')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'attente' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined">pending_actions</span>
            En attente
          </button>

          <button 
            onClick={() => setActiveTab('tous')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'tous' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined">storefront</span>
            Tous les restaurants
          </button>

          <button 
            onClick={() => setActiveTab('ajouter')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'ajouter' ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Ajouter
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all">
            <span className="material-symbols-outlined">logout</span>
            Déconnexion
          </button>
        </div>
      </aside>

     
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
        {activeTab === 'attente' && <DemandesEnAttente />}
        {activeTab === 'tous' && <AllEtablissment />}
        {activeTab === 'ajouter' && <AjouterEtablissement />}
      </main>

    </div>
  );
}


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
      <div className="flex justify-center items-center h-full">
        <span className="material-symbols-outlined animate-spin text-teal-500 text-6xl">autorenew</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Demandes en attente</h2>
          <p className="text-gray-500 mt-1">Examinez et acceptez ou refusez les nouveaux établissements.</p>
        </div>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-bold text-sm border border-amber-200">
          {attentes.length} Demande(s)
        </div>
      </div>

      {attentes.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {attentes.map((etab) => (
            <div key={etab.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{etab.nom}</h3>
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md border border-blue-100">
                    Nouveau
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-5 line-clamp-2">{etab.description}</p>
                
                <div className="space-y-3 text-sm text-gray-600 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-teal-600">location_on</span>
                    {etab.adresse}, {etab.ville}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] text-teal-600">call</span>
                    {etab.telephone}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white p-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => handleAction(etab.id, etab.gerant_id, 'acceptee')}
                  disabled={actionLoading === etab.id}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white transition-all ${
                    actionLoading === etab.id ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 shadow-sm'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Accepter
                </button>
                
                <button
                  onClick={() => handleAction(etab.id, etab.gerant_id, 'refusee')}
                  disabled={actionLoading === etab.id}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-red-600 bg-red-50 border border-red-100 transition-all ${
                    actionLoading === etab.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100 hover:border-red-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">cancel</span>
                  Refuser
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center mt-10">
          <div className="bg-green-50 text-green-500 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Tout est à jour !</h2>
          <p className="text-gray-500 mt-2 max-w-sm">Il n'y a aucune demande d'établissement en attente pour le moment.</p>
        </div>
      )}
    </div>
  );
}

function AjouterEtablissement() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Créer un établissement</h2>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 text-center">
        <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">construction</span>
        <h3 className="text-xl font-bold text-gray-700">En cours de développement</h3>
        <p className="text-gray-500 mt-2">Le formulaire d'ajout pour l'admin s'affichera ici.</p>
      </div>
    </div>
  );
}