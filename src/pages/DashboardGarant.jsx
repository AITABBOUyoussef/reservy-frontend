import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Navbar from '../components/Navbar';

export default function DashboardGarant() {
  const navigate = useNavigate();
  const [etablissement, setEtablissement] = useState(null);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE_URL = "http://127.0.0.1:8000/photos/";

  // ================= ETATS POUR LES MODALS =================
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTable, setNewTable] = useState({ numero: '', capacite: '' });

  const [showAddImageModal, setShowAddImageModal] = useState(false);
  // 7yedna est_principale mn state hit wlat dima 0 f l'ajout
  const [newImage, setNewImage] = useState({ file: null });

  // ================= FETCH DETAILS =================
  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/MonEtablissment');
      if (response.data && response.data.etablissements && response.data.etablissements.length > 0) {
        setEtablissement(response.data.etablissements[0]);
      } else {
        setEtablissement(null);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // ================= FONCTIONNALITÉS =================

  // 1. Modifier l'établissement
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/EditEtablissement', {
        IdEtablissement: etablissement.id,
        gerant_id: etablissement.gerant_id,
        nom: editData.nom,
        description: editData.description,
        adresse: editData.adresse,
        ville: editData.ville,
        telephone: editData.telephone
      });
      setEtablissement({ ...etablissement, ...editData });
      setShowEditModal(false);
      alert("Etablissement modifié avec succès !");
    } catch (error) {
      console.error("Erreur de modification:", error);
      alert("Erreur lors de la modification.");
    }
  };

  // 2. Supprimer l'établissement
  const supprimerEtablissement = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet établissement ?")) return;
    try {
      await axiosInstance.post('/DestroyEtablissement', {
        IdEtablissement: etablissement.id,
        gerant_id: etablissement.gerant_id
      });
      setEtablissement(null);
      alert("Etablissement supprimé.");
    } catch (error) {
      console.error("Erreur suppression etablissement:", error);
      alert("Erreur lors de la suppression.");
    }
  };

  // 3. Ajouter une table
 const handleAddTableSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/AddTabl', {
        etablissement_id: etablissement.id,
        numero: newTable.numero,
        capacite: parseInt(newTable.capacite)
      });
      fetchDetails(); 
      setShowAddTableModal(false);
      setNewTable({ numero: '', capacite: '' });
      alert("Table ajoutée b naja7!");
      
    } catch (error) {
      // 🚨 Hna fin zedna l'affichage dyal l'erreur s7i7a dyal Laravel
      if (error.response && error.response.status === 422) {
        // Hada ghadi yjbed l'message "Had ra9m dyal la table deja kayn..."
        const errorMessages = error.response.data.errors;
        if (errorMessages && errorMessages.numero) {
          alert(errorMessages.numero[0]); // Ki2afichi l'erreur dyal ra9m
        } else {
          alert(error.response.data.message || "Kayn mochkil f les données li sifti.");
        }
      } else {
        console.error("Erreur ajout table:", error);
        alert("Erreur f serveur ola connexion.");
      }
    }
  };

  // 4. Supprimer une table
  const supprimerTable = async (tableId) => {
    if (!window.confirm("Voulez-vous supprimer cette table ?")) return;
    try {
      await axiosInstance.post('/DaleteTabl', {
        IdEtablissement: etablissement.id,
        IdTabl: tableId,
        gerant_id: etablissement.gerant_id
      });
      setEtablissement(prev => ({
        ...prev,
        tables: prev.tables.filter(table => table.id !== tableId)
      }));
    } catch (error) {
      console.error("Erreur de suppression:", error);
      alert("Erreur lors de la suppression de la table.");
    }
  };

  // 5. Ajouter une image (Modifié : Dima 0 f l'ajout)
  const handleAddImageSubmit = async (e) => {
    e.preventDefault();
    if (!newImage.file) return alert("Veuillez sélectionner une image !");
    
    const formData = new FormData();
    formData.append('nom_image', newImage.file);
    formData.append('est_principale', "0"); // <-- Dima tsift 0 f l'ajout
    formData.append('etablissement_id', etablissement.id);

    try {
      await axiosInstance.post('/AddImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDetails(); 
      setShowAddImageModal(false);
      setNewImage({ file: null });
    } catch (error) {
      console.error("Erreur ajout image:", error);
      alert("Erreur lors de l'ajout de l'image.");
    }
  };

  // 6. Supprimer une image
  const supprimerImage = async (imageId) => {
    if (!window.confirm("Voulez-vous supprimer cette image ?")) return;
    try {
      await axiosInstance.post('/DaleteImage', {
        IdEtablissement: etablissement.id,
        IdImage: imageId,
        gerant_id: etablissement.gerant_id
      });
      setEtablissement(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }));
    } catch (error) {
      console.error("Erreur suppression image:", error);
      alert("Erreur lors de la suppression de l'image.");
    }
  };

  // 7. Rendre une image Principale (Cover)
  const setMainImage = async (imageId) => {
    if (!window.confirm("Voulez-vous définir cette image comme Cover principale ?")) return;

    try {
      await axiosInstance.post('/EditImage', {
        IdEtablissement: etablissement.id,
        IdImage: imageId,
        gerant_id: etablissement.gerant_id
      });

      setEtablissement(prev => ({
        ...prev,
        images: prev.images.map(img => ({
          ...img,
          est_principale: img.id === imageId ? 1 : 0
        }))
      }));

    } catch (error) {
      console.error("Erreur mise à jour image principale:", error);
      alert("Erreur lors du changement de l'image principale.");
    }
  };


  // ================= RENDU =================
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <span className="material-symbols-outlined animate-spin text-teal-500 text-5xl">autorenew</span>
      </div>
    );
  }

  if (!etablissement) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans text-gray-900 pb-12">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-32 text-center">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-16">
            <span className="material-symbols-outlined text-teal-500 text-6xl mb-4">storefront</span>
            <h2 className="text-2xl font-bold text-gray-800">Bienvenue dans votre espace !</h2>
            <p className="text-gray-500 mt-2 mb-8">Créez votre premier restaurant pour commencer à gérer vos commandes.</p>
            <button 
              onClick={() => navigate('/addEtablissment')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-md transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              Ajouter mon restaurant
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = etablissement.images?.find(img => img.est_principale === 1) || etablissement.images?.[0];

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans text-gray-900 relative">
      <Navbar />
      
      {/* HEADER & COVER */}
      <div className="relative w-full h-72 bg-teal-900 mt-[64px]">
        {mainImage ? (
          <img 
            src={`${IMAGE_BASE_URL}${mainImage.nom_image}`} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-50 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <span className="material-symbols-outlined text-white text-6xl">restaurant</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex items-end">
          <div className="max-w-6xl mx-auto px-6 pb-8 w-full flex justify-between items-end">
            <div className="text-white">
              <span className={`text-xs font-bold px-3 py-1.5 rounded shadow-sm flex items-center gap-1 w-max mb-3 uppercase ${etablissement.statut === 'acceptee' ? 'bg-green-500' : 'bg-amber-500'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {etablissement.statut === 'acceptee' ? 'check_circle' : 'pending'}
                </span> 
                {etablissement.statut?.replace('_', ' ')}
              </span>
              
              <h1 className="text-4xl md:text-5xl font-extrabold">{etablissement.nom}</h1>
              <p className="text-gray-200 mt-2 flex items-center gap-2 text-lg">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
                {etablissement.ville}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={supprimerEtablissement}
                className="bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 shadow-lg transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
                Supprimer l'établissement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD GRID */}
      <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Informations */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">info</span>
                Informations
              </h2>
              <button 
                onClick={() => {
                  setEditData({
                    nom: etablissement.nom,
                    description: etablissement.description,
                    adresse: etablissement.adresse,
                    ville: etablissement.ville,
                    telephone: etablissement.telephone
                  });
                  setShowEditModal(true);
                }}
                className="text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-teal-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Modifier
              </button>
            </div>
            <p className="text-gray-600 mb-5">{etablissement.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="material-symbols-outlined text-gray-400">map</span>
                <span className="text-sm font-medium text-gray-700">{etablissement.adresse}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="material-symbols-outlined text-gray-400">call</span>
                <span className="text-sm font-medium text-gray-700">{etablissement.telephone}</span>
              </div>
            </div>
          </section>

          {/* Menu */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">restaurant_menu</span>
                Menu ({etablissement.produits?.length || 0})
              </h2>
              <button className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-teal-700 shadow-sm transition-colors">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Nouveau plat
              </button>
            </div>
            
            <div className="space-y-4">
              {etablissement.produits?.length > 0 ? (
                etablissement.produits.map((prod) => (
                  <div key={prod.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50/50">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {prod.produit_images?.[0] ? (
                        <img src={`${IMAGE_BASE_URL}${prod.produit_images[0].nom_image}`} alt={prod.nom} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined w-full h-full flex justify-center items-center text-gray-400">fastfood</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{prod.nom}</h3>
                          {prod.categorie && (
                            <span className="text-[10px] uppercase font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded mt-1 inline-block">
                              {prod.categorie.nom}
                            </span>
                          )}
                        </div>
                        <span className="font-extrabold text-amber-600 bg-white border border-amber-100 px-2 py-1 rounded-md shadow-sm">
                          {Number(prod.prix).toFixed(2)} DH
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{prod.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-xl">Aucun plat dans votre menu.</p>
              )}
            </div>
          </section>

          {/* Avis Clients */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-amber-500">star</span>
              Avis Clients ({etablissement.reviews?.length || 0})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {etablissement.reviews?.length > 0 ? (
                etablissement.reviews.map(rev => (
                  <div key={rev.id} className="p-4 bg-amber-50/30 rounded-xl border border-amber-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-gray-800">{rev.client?.name || "Client"}</span>
                      <span className="text-amber-500 text-xs font-bold flex items-center gap-0.5 bg-white px-2 py-1 rounded shadow-sm border border-amber-50">
                        <span className="material-symbols-outlined text-[14px]">star</span> {rev.note}/5
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 italic">"{rev.commentaire}"</p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center py-6 text-gray-500 text-sm border border-dashed rounded-xl">Aucun avis pour le moment.</p>
              )}
            </div>
          </section>

        </div>

        {/* COLONNE DROITE */}
        <div className="space-y-8">
          
          {/* Galerie Photos */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">photo_library</span>
                Galerie
              </h2>
              <button 
                onClick={() => setShowAddImageModal(true)}
                className="text-teal-600 bg-teal-50 p-2 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
              </button>
            </div>
            
            {etablissement.images?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {etablissement.images.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-gray-100 bg-gray-100">
                    <img src={`${IMAGE_BASE_URL}${img.nom_image}`} alt="gallery" className="w-full h-full object-cover" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2">
                      
                      {/* Bouton Nejma (Cover) */}
                      {img.est_principale !== 1 && (
                        <button 
                          onClick={() => setMainImage(img.id)}
                          title="Définir comme Cover"
                          className="text-white hover:text-amber-400 bg-black/40 p-2 rounded-full backdrop-blur-sm transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">star</span>
                        </button>
                      )}

                      {/* Bouton Delete */}
                      <button 
                        onClick={() => supprimerImage(img.id)}
                        title="Supprimer l'image"
                        className="text-white hover:text-red-400 bg-black/40 p-2 rounded-full backdrop-blur-sm transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    {/* Badge Cover */}
                    {img.est_principale === 1 && (
                      <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">star</span> Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-xl">Aucune photo ajoutée.</p>
            )}
          </section>

          {/* Tables */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">table_restaurant</span>
                Tables ({etablissement.tables?.length || 0})
              </h2>
              <button 
                onClick={() => setShowAddTableModal(true)}
                className="text-teal-600 bg-teal-50 p-2 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
            
            {etablissement.tables?.length > 0 ? (
              <div className="space-y-3">
                {etablissement.tables.map(table => (
                  <div key={table.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="bg-white w-10 h-10 rounded-lg shadow-sm flex justify-center items-center font-extrabold text-teal-700 border border-gray-100">
                        N°{table.numero}
                      </div>
                      <span className="text-sm font-bold text-gray-600">{table.capacite} places</span>
                    </div>
                    <button 
                      onClick={() => supprimerTable(table.id)}
                      className="text-gray-400 hover:text-red-500 bg-white p-1.5 rounded-md shadow-sm border border-gray-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-xl">Aucune table ajoutée.</p>
            )}
          </section>
        </div>
      </div>

      {/* ================= MODALS (POP-UPS) ================= */}

      {/* MODAL MODIFIER ETABLISSEMENT */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Modifier l'établissement</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input type="text" placeholder="Nom" className="w-full border p-2 rounded"
                value={editData.nom} onChange={e => setEditData({...editData, nom: e.target.value})} required />
              <textarea placeholder="Description" className="w-full border p-2 rounded"
                value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} required />
              <input type="text" placeholder="Adresse" className="w-full border p-2 rounded"
                value={editData.adresse} onChange={e => setEditData({...editData, adresse: e.target.value})} required />
              <input type="text" placeholder="Ville" className="w-full border p-2 rounded"
                value={editData.ville} onChange={e => setEditData({...editData, ville: e.target.value})} required />
              <input type="text" placeholder="Téléphone" className="w-full border p-2 rounded"
                value={editData.telephone} onChange={e => setEditData({...editData, telephone: e.target.value})} required />
              
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-600">Annuler</button>
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJOUTER TABLE */}
      {showAddTableModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Ajouter une Table</h2>
            <form onSubmit={handleAddTableSubmit} className="space-y-3">
              <input type="text" placeholder="Numéro de table (ex: 3)" className="w-full border p-2 rounded"
                value={newTable.numero} onChange={e => setNewTable({...newTable, numero: e.target.value})} required />
              <input type="number" placeholder="Capacité (ex: 4)" className="w-full border p-2 rounded"
                value={newTable.capacite} onChange={e => setNewTable({...newTable, capacite: e.target.value})} required />
              
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowAddTableModal(false)} className="px-4 py-2 text-gray-600">Annuler</button>
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL AJOUTER IMAGE (CheckBox m7yeda) */}
      {showAddImageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Ajouter une Photo</h2>
            <form onSubmit={handleAddImageSubmit} className="space-y-3">
              <input type="file" accept="image/*" className="w-full border p-2 rounded"
                onChange={e => setNewImage({ file: e.target.files[0] })} required />
              
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowAddImageModal(false)} className="px-4 py-2 text-gray-600">Annuler</button>
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Uploader</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}