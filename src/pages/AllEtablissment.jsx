import { useState, useEffect } from 'react';
import axiosInstance from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

export default function AllEtablissment() {
  const [etablissements, setEtablissements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const navigate = useNavigate();
  const fetchEtablissements = async () => {
    try {
      const response = await axiosInstance.get('/AllEtablissement');
      if (response.data && response.data.Etablissement) {
        setEtablissements(response.data.Etablissement);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Le chargement asynchrone synchronise l’état avec l’API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEtablissements();
  }, []);

  const handNav = (id) => {
    navigate(`/etablissment/${id}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet établissement ? Cette action est irréversible.")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await axiosInstance.post('/DestroyEtablissement', { IdEtablissement: id });
      setEtablissements(prev => prev.filter(etab => etab.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression.");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <span className="material-symbols-outlined animate-spin text-teal-500 text-5xl">autorenew</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Tous les établissements</h2>
          <p className="text-gray-500 mt-1">Gérez l'ensemble des restaurants inscrits sur la plateforme.</p>
        </div>
        <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-lg font-bold text-sm border border-teal-200">
          {etablissements.length} Établissement(s)
        </div>
      </div>

      {etablissements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {etablissements.map((etab) => {
           const mainImg = etab.images?.find(img => img.est_principale === 1) || etab.images?.[0];

            return (
              <div 
                key={etab.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
              >
                
                {/* Image Container */}
                <div 
                  onClick={() => handNav(etab.id)} 
                  className="relative w-full h-40 bg-gray-200 cursor-pointer overflow-hidden"
                >
                  {mainImg ? (
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={getImageUrl(mainImg.nom_image)}
                      alt={etab.nom}
                    />
                  ) : (
                    <div className="w-full h-full bg-teal-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-5xl opacity-50">restaurant</span>
                    </div>
                  )}
                  
                  <span className="absolute top-3 left-3 bg-green-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow uppercase">
                    {etab.statut}
                  </span>
                </div>

                {/* Infos */}
                <div className="p-5 flex-1 flex flex-col cursor-pointer" onClick={() => handNav(etab.id)}>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 truncate">{etab.nom}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
                    {etab.description}
                  </p>
                  
                  <div className="space-y-1 text-xs font-semibold text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-teal-600">location_on</span>
                      <span className="truncate">{etab.adresse}, {etab.ville}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-teal-600">call</span>
                      <span>{etab.telephone}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => handNav(etab.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    Détails
                  </button>
                  
                  <button
                    onClick={(e) => handleDelete(etab.id, e)}
                    disabled={deleteLoading === etab.id}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-red-600 bg-red-50 border border-red-200 transition-all ${
                      deleteLoading === etab.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'
                    }`}
                  >
                    <span  className="material-symbols-outlined text-[18px]">delete</span>
                    {deleteLoading === etab.id ? '...' : 'Supprimer'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-12 text-center">
          <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">search_off</span>
          <h3 className="text-xl font-bold text-gray-700">Aucun établissement</h3>
          <p className="text-gray-500 mt-2">Vous n'avez pas encore d'établissements enregistrés.</p>
        </div>
      )}
    </div>
  );
}