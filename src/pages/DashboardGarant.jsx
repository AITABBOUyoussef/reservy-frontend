import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Navbar from '../components/Navbar';
import { getImageUrl } from '../utils/imageUrl';

export default function DashboardGarant() {
  const navigate = useNavigate();
  const [etablissement, setEtablissement] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= NOTIFICATIONS =================
  const [notifications, setNotifications] = useState([]);

  const notify = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => {
      if (prev.some(notification => notification.message === message && notification.type === type)) {
        return prev;
      }
      return [...prev, { id, message, type }];
    });
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // ================= MODALS STATES =================
  const [editType, setEditType] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showEditTableModal, setShowEditTableModal] = useState(false);
  const [newTable, setNewTable] = useState({ numero: '', capacite: '' });
  
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [newImage, setNewImage] = useState({ file: null });

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ nom: '' });

  const [showProductModal, setShowProductModal] = useState(false);
  const [showProductImageModal, setShowProductImageModal] = useState(false);
  const [showProductOptionModal, setShowProductOptionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [productData, setProductData] = useState({
    IdProduit: null,
    nom: '',
    description: '',
    prix: '',
    categorie_id: ''
  });
  const [productOptionData, setProductOptionData] = useState({
    produit_id: null,
    nom_option: '',
    prix_supplementaire: ''
    
  });
  const [activeCategory, setActiveCategory] = useState('all');

  // ================= FETCH DATA =================
  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/MonEtablissment');
      if (response.data?.etablissements?.length > 0) {
        setEtablissement(response.data.etablissements[0]);
      } else {
        setEtablissement(null);
      }
    } catch {
      notify("Impossible de charger les données de l'établissement.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Le chargement asynchrone synchronise l’état avec l’API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDetails();
  }, [fetchDetails]);

  // ================= FILTRAGE CATÉGORIES =================
  const categoriesList = etablissement?.categories || [];
  
  const displayedProducts = activeCategory === 'all' 
    ? etablissement?.produits 
    : etablissement?.produits?.filter(prod => String(prod.categorie_id) === String(activeCategory));

  // ================= LOGIC: ÉTABLISSEMENT =================
  const handleEditSubmit = async () => {
    try {
      await axiosInstance.post('/EditEtablissement', {
        IdEtablissement: etablissement.id,
        gerant_id: etablissement.gerant_id,
        ...editData
      });
      setEtablissement({ ...etablissement, ...editData });
      setShowEditModal(false);
      notify("L'établissement a été mis à jour.");
    } catch {
      notify("Erreur lors de la mise à jour.", "error");
    }
  };

  const supprimerEtablissement = async () => {
    if (!window.confirm("Supprimer cet établissement ? Action irréversible.")) return;
    try {
      await axiosInstance.post('/DestroyEtablissement', {
        IdEtablissement: etablissement.id,
        gerant_id: etablissement.gerant_id
      });
      setEtablissement(null);
      notify("Établissement supprimé.");
    } catch {
      notify("Erreur de suppression.", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editType === 'etablissement') handleEditSubmit();
    else if (editType === 'tabl') editTable(editData.IdTabl);
  };

  // ================= LOGIC: TABLES =================
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
      notify("Table ajoutée.");
    } catch (error) {
      notify(error.response?.data?.message || "Données invalides.", "error");
    }
  };

  const editTable = async (tableId) => {
    try {
      await axiosInstance.post('/EditTabl', {
        etablissement_id: etablissement.id,
        IdTabl: tableId,
        numero: editData.numero,
        capacite: parseInt(editData.capacite),
        gerant_id: etablissement.gerant_id
      });
      setEtablissement(prev => ({
        ...prev,
        tables: prev.tables.map(t => t.id === tableId ? { ...t, ...editData } : t)
      }));
      setShowEditTableModal(false);
      notify("Table modifiée.");
    } catch {
      notify("Erreur de modification.", "error");
    }
  };

  const supprimerTable = async (tableId) => {
    if (!window.confirm("Retirer cette table ?")) return;
    try {
      await axiosInstance.post('/DaleteTabl', {
        IdEtablissement: etablissement.id,
        IdTabl: tableId,
        gerant_id: etablissement.gerant_id
      });
      setEtablissement(prev => ({ ...prev, tables: prev.tables.filter(t => t.id !== tableId) }));
      notify("Table supprimée.");
    } catch {
      notify("Erreur de suppression.", "error");
    }
  };

  // ================= LOGIC: GALERIE (IMAGES) =================
  const handleAddImageSubmit = async (e) => {
    e.preventDefault();
    if (!newImage.file) return notify("Veuillez sélectionner une image.", "error");
    const formData = new FormData();
    formData.append('nom_image', newImage.file);
    formData.append('est_principale', "0");
    formData.append('etablissement_id', etablissement.id);

    try {
      await axiosInstance.post('/AddImage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchDetails(); 
      setShowAddImageModal(false);
      setNewImage({ file: null });
      notify("Image ajoutée à la galerie.");
    } catch {
      notify("Erreur d'upload.", "error");
    }
  };

  const supprimerImage = async (imageId) => {
    if (!window.confirm("Supprimer cette image ?")) return;
    try {
      await axiosInstance.post('/DaleteImage', {
        IdEtablissement: etablissement.id,
        IdImage: imageId,
        gerant_id: etablissement.gerant_id
      });
      setEtablissement(prev => ({ ...prev, images: prev.images.filter(img => img.id !== imageId) }));
      notify("Image retirée.");
    } catch {
      notify("Erreur de suppression.", "error");
    }
  };

  const setMainImage = async (imageId) => {
    if (!window.confirm("Définir comme couverture ?")) return;
    try {
      await axiosInstance.post('/EditImage', {
        IdEtablissement: etablissement.id,
        IdImage: imageId,
        gerant_id: etablissement.gerant_id
      });
      setEtablissement(prev => ({
        ...prev,
        images: prev.images.map(img => ({ ...img, est_principale: img.id === imageId ? 1 : 0 }))
      }));
      notify("Couverture mise à jour.");
    } catch {
      notify("Erreur de mise à jour.", "error");
    }
  };

  // ================= LOGIC: CATÉGORIES =================
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.nom.trim()) return notify("Le nom est requis.", "error");
    try {
      await axiosInstance.post('/AddCategorie', { etablissement_id: etablissement.id, nom: newCategory.nom });
      fetchDetails(); 
      setShowAddCategoryModal(false);
      setNewCategory({ nom: '' });
      notify("Catégorie ajoutée.");
    } catch (error) {
      notify(error.response?.data?.message || "Données invalides.", "error");
    }
  };

  const supprimerCategorie = async (categorieId) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await axiosInstance.post('/DeletCategorie', { IdEtablissement: etablissement.id, IdCategorie: categorieId });
      if (String(activeCategory) === String(categorieId)) setActiveCategory('all');
      setEtablissement(prev => ({ ...prev, categories: prev.categories.filter(cat => cat.id !== categorieId) }));
      notify("Catégorie supprimée.");
    } catch {
      notify("Erreur de suppression.", "error");
    }
  };

  // ================= LOGIC: PRODUITS =================
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const isEditing = Boolean(productData.IdProduit);
    const payload = {
      etablissement_id: etablissement.id,
      categorie_id: Number(productData.categorie_id),
      nom: productData.nom.trim(),
      description: productData.description.trim() || null,
      prix: Number(productData.prix)
    };

    try {
      const response = await axiosInstance.post(
        isEditing ? '/EditProduit' : '/AddProduit',
        isEditing ? { ...payload, IdProduit: productData.IdProduit } : payload
      );
      
      const produit = response.data.produit;
      setEtablissement(prev => ({
        ...prev,
        produits: isEditing
          ? prev.produits.map(item => item.id === produit.id ? produit : item)
          : [...(prev.produits || []), produit].sort((a, b) => a.nom.localeCompare(b.nom))
      }));
      
      setShowProductModal(false);
      notify(isEditing ? "Produit modifié." : "Produit ajouté.");
    } catch (error) {
      notify(error.response?.data?.message || "Erreur produit.", "error");
    }
  };

  const supprimerProduit = async (produitId) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axiosInstance.post('/DeletProduit', { IdEtablissement: etablissement.id, IdProduit: produitId });
      setEtablissement(prev => ({ ...prev, produits: prev.produits.filter(p => p.id !== produitId) }));
      notify("Produit supprimé.");
    } catch {
      notify("Erreur de suppression.", "error");
    }
  };

  const openProductModal = (produit = null) => {
    setProductData(produit ? {
      IdProduit: produit.id,
      nom: produit.nom,
      description: produit.description || '',
      prix: produit.prix,
      categorie_id: produit.categorie_id
    } : {
      IdProduit: null,
      nom: '',
      description: '',
      prix: '',
      categorie_id: activeCategory !== 'all' ? activeCategory : (categoriesList[0]?.id || '')
    });
    setShowProductModal(true);
  };

  ////////////////////////////
 const openProductOptoinModal = (produit) => {
    setSelectedProduct(produit);
    setShowProductOptionModal(true);
  };
    const handleProductOptionSubmit = async (e) => {
    e.preventDefault();
    if (!productOptionData) return notify("Sélectionnez une Produit.", "error");
  const payload = {
      produit_id: selectedProduct.id,
      nom_option: productOptionData.nom_option.trim(),
      prix_supplementaire: Number(productOptionData.prix_supplementaire)
    };


    try {
      await axiosInstance.post('/AddProduitOption', payload);
      
   
      
    fetchDetails();
      setShowProductOptionModal(false);
      notify("Option ajoutée au produit.");
      
    } catch {
      notify("Erreur d'upload.", "error");
    }
  };

  const supprimerOption = async (produit , optionId) => {
    
    if (!window.confirm("Supprimer cette Option ?")) return;
    try {
      await axiosInstance.post('/DeletProduitOption', { produit_id: produit, option_id: optionId });
      fetchDetails();
      notify("Option supprimée.");

    } catch {
      notify("Erreur de suppression.", "error");
    }
  };

  // ================= LOGIC: IMAGES PRODUITS =================
  const openProductImageModal = (produit) => {
    setSelectedProduct(produit);
    setProductImage(null);
    setShowProductImageModal(true);
  };

  const handleProductImageSubmit = async (e) => {
    e.preventDefault();
    if (!productImage) return notify("Sélectionnez une image.", "error");

    const formData = new FormData();
    formData.append('produit_id', selectedProduct.id);
    formData.append('est_principale', '0');
    formData.append('nom_image', productImage);

    try {
      const response = await axiosInstance.post('/AddProduitImage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const image = response.data.image;
      
      setEtablissement(prev => ({
        ...prev,
        produits: prev.produits.map(p => p.id === selectedProduct.id
          ? { ...p, produit_images: [...(p.produit_images || []).map(i => ({ ...i, est_principale: 0 })), image] }
          : p)
      }));
      
      setSelectedProduct(prev => prev ? { ...prev, produit_images: [...(prev.produit_images || []), image] } : prev);
      setShowProductImageModal(false);
      setProductImage(null);
      notify("Image ajoutée au produit.");
    } catch {
      notify("Erreur d'upload.", "error");
    }
  };

  const supprimerImageProduit = async (produit, imageId) => {
    if (!window.confirm("Supprimer cette image ?")) return;
    try {
      await axiosInstance.post('/DeletProduitImage', { IdProduit: produit.id, IdImage: imageId });
      setEtablissement(prev => ({
        ...prev,
        produits: prev.produits.map(p => p.id === produit.id ? { ...p, produit_images: p.produit_images.filter(i => i.id !== imageId) } : p)
      }));
      setSelectedProduct(prev => prev ? { ...prev, produit_images: prev.produit_images.filter(i => i.id !== imageId) } : prev);
      notify("Image supprimée.");
    } catch {
      notify("Erreur de suppression.", "error");
    }
  };

  const setMainImageProduit = async (produit, imageId) => {
    try {
      await axiosInstance.post('/EditProduitImage', { IdProduit: produit.id, IdImage: imageId });
      const updateImages = images => images.map(i => ({ ...i, est_principale: i.id === imageId ? 1 : 0 }));
      
      setEtablissement(prev => ({
        ...prev,
        produits: prev.produits.map(p => p.id === produit.id ? { ...p, produit_images: updateImages(p.produit_images || []) } : p)
      }));
      setSelectedProduct(prev => prev ? { ...prev, produit_images: updateImages(prev.produit_images || []) } : prev);
      notify("Cover du produit mis à jour.");
    } catch {
      notify("Erreur de mise à jour.", "error");
    }
  };

  // ================= RENDER DE BASE =================
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-50"><span className="material-symbols-outlined animate-spin text-teal-500 text-5xl">autorenew</span></div>;
  }

  if (!etablissement) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans text-gray-900 pb-12">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-32 text-center">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 sm:p-16">
            <span className="material-symbols-outlined text-teal-500 text-6xl mb-4">storefront</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Bienvenue dans votre espace !</h2>
            <p className="text-gray-500 mt-2 mb-8 text-sm sm:text-base">Créez votre premier restaurant pour commencer à gérer vos commandes.</p>
            <button onClick={() => navigate('/addEtablissment')} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-bold inline-flex items-center gap-2 shadow-md transition-all w-full sm:w-auto justify-center">
              <span className="material-symbols-outlined">add</span> Ajouter mon restaurant
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

      {/* TOASTS */}
      <div className="fixed top-20 right-4 sm:right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-[calc(100%-2rem)] sm:w-auto">
        {notifications.map((n) => (
          <div key={n.id} className={`flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-xl shadow-lg transition-all duration-300 min-w-full sm:min-w-[300px] pointer-events-auto ${n.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            <span className="material-symbols-outlined shrink-0">{n.type === 'success' ? 'check_circle' : 'error'}</span>
            <p className="text-sm font-semibold">{n.message}</p>
          </div>
        ))}
      </div>
      
      {/* HEADER & COVER RESPONSIVE FIX */}
      <div className="relative w-full h-[400px] sm:h-72 bg-gray-900 mt-[80px]">
        {mainImage ? (
          <img src={getImageUrl(mainImage.nom_image)} alt="Cover" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <span className="material-symbols-outlined text-white text-6xl">restaurant</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="text-white w-full sm:w-auto">
              <span className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded shadow-sm flex items-center gap-1 w-max mb-3 uppercase ${etablissement.statut === 'acceptee' ? 'bg-green-500' : 'bg-amber-500'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {etablissement.statut === 'acceptee' ? 'check_circle' : 'pending'}
                </span> 
                {etablissement.statut?.replace('_', ' ')}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight break-words">{etablissement.nom}</h1>
              <p className="text-gray-200 mt-2 flex items-center gap-2 text-sm sm:text-lg">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">location_on</span>
                {etablissement.ville}
              </p>
            </div>
            <button onClick={supprimerEtablissement} className="bg-red-600 text-white px-4 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-red-700 shadow-lg transition-all w-full sm:w-auto">
              <span className="material-symbols-outlined text-[20px]">delete</span>
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* INFORMATIONS */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">info</span> Informations
              </h2>
              <button onClick={() => { setEditType('etablissement'); setEditData({ nom: etablissement.nom, description: etablissement.description, adresse: etablissement.adresse, ville: etablissement.ville, telephone: etablissement.telephone }); setShowEditModal(true); }} className="text-teal-700 bg-teal-50 px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 hover:bg-teal-100 transition-colors w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined text-[18px]">edit</span> Modifier
              </button>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-5 leading-relaxed">{etablissement.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
                <span className="material-symbols-outlined text-gray-400 shrink-0">map</span>
                <span className="text-sm font-medium text-gray-700 break-words">{etablissement.adresse}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
                <span className="material-symbols-outlined text-gray-400 shrink-0">call</span>
                <span className="text-sm font-medium text-gray-700">{etablissement.telephone}</span>
              </div>
            </div>
          </section>

          {/* MENU & CATEGORIES & PRODUITS */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">restaurant_menu</span> Menu
              </h2>
              <button onClick={() => setShowAddCategoryModal(true)} className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 hover:bg-teal-100 transition-colors w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined text-[18px]">category</span> Nouvelle Catégorie
              </button>
            </div>
            
            {/* TABS (SCROLLABLE ON MOBILE) */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-hide">
              <button 
                onClick={() => setActiveCategory('all')}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${activeCategory === 'all' ? 'bg-teal-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Toutes
              </button>
              
              {categoriesList.map(cat => (
                <div key={cat.id} className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 border ${String(activeCategory) === String(cat.id) ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                  <button onClick={() => setActiveCategory(cat.id)} className="outline-none whitespace-nowrap">
                    {cat.nom}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); supprimerCategorie(cat.id); }} className={`p-1 ml-1 rounded-full transition-colors ${String(activeCategory) === String(cat.id) ? 'text-teal-200 hover:text-white hover:bg-teal-700' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
                    <span className="material-symbols-outlined text-[14px] flex">close</span>
                  </button>
                </div>
              ))}
            </div>

            {/* HEADER PRODUITS */}
            <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b border-gray-100 gap-4">
              <h3 className="font-bold text-gray-800 text-base sm:text-lg flex items-center gap-2">
                {activeCategory === 'all' ? 'Tous les plats' : categoriesList.find(c => String(c.id) === String(activeCategory))?.nom}
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">{displayedProducts?.length || 0}</span>
              </h3>
              <button onClick={() => openProductModal()} className="bg-teal-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 hover:bg-teal-700 shadow-sm transition-colors w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined text-[18px]">add</span> Nouveau plat
              </button>
            </div>
            
            {/* LISTE DES PRODUITS */}
            <div className="space-y-4">
              {displayedProducts?.length > 0 ? (
                displayedProducts.map((prod) => (
                  <div key={prod.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50/50">
                    <div className="w-full sm:w-28 h-48 sm:h-28 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                      {prod.produit_images?.[0] ? (
                        <img src={getImageUrl((prod.produit_images.find(image => image.est_principale) || prod.produit_images[0]).nom_image)} alt={prod.nom} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined w-full h-full flex justify-center items-center text-gray-400 text-3xl">fastfood</span>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">{prod.nom}</h3>
                            {prod.categorie && activeCategory === 'all' && (
                              <span className="text-[10px] uppercase font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded mt-1 inline-block">
                                {prod.categorie.nom}
                              </span>
                            )}
                          </div>
                               {prod.produit_options && prod.produit_options.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {prod.produit_options.map((option) => (
                                <span 
                                  key={option.id} 
                                  className="text-[11px] font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                                >
                                  {option.nom_option}
                                  {option.prix_supplementaire > 0 && (
                                    <span className="text-teal-600">(+{option.prix_supplementaire} DH)</span>
                                    
                                  )}
                                   <button onClick={(e) => { e.stopPropagation(); supprimerOption(prod.id , option.id); }} className={`p-1 ml-1 rounded-full transition-colors`}>
                    <span className="material-symbols-outlined text-[14px] flex">close</span>
                  </button>
                                </span>
                                
                                
                              ))}
                            </div>
                          )}
                          <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-sm border border-amber-100">
                            {Number(prod.prix).toFixed(2)} DH
                          </span>
                          
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2">{prod.description}</p>
                      </div>
                      
                      {/* ACTION BUTTONS PRODUITS */}
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 justify-end">
                        <button onClick={() => openProductImageModal(prod)} title="Gérer l'image" className="text-gray-500 hover:text-teal-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors">
                          <span className="material-symbols-outlined text-[16px]">add_a_photo</span> Image
                        </button>
                         <button onClick={() => openProductOptoinModal(prod)} title="Gérer l'image" className="text-gray-500 hover:text-teal-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors">
                          <span className="material-symbols-outlined text-[16px]">add</span> Option
                        </button>
                        <button onClick={() => openProductModal(prod)} title="Modifier" className="text-gray-500 hover:text-teal-600 bg-white border border-gray-200 p-1.5 rounded-lg shadow-sm transition-colors">
                          <span className="material-symbols-outlined text-[18px] flex">edit</span>
                        </button>
                        <button onClick={() => supprimerProduit(prod.id)} title="Supprimer" className="text-gray-500 hover:text-red-500 bg-white border border-gray-200 p-1.5 rounded-lg shadow-sm transition-colors">
                          <span className="material-symbols-outlined text-[18px] flex">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                  <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">no_meals</span>
                  <p className="text-gray-500 text-sm font-medium">Aucun plat dans cette catégorie.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* GALERIE */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">photo_library</span> Galerie
              </h2>
              <button onClick={() => setShowAddImageModal(true)} className="text-teal-700 bg-teal-50 p-2 rounded-full hover:bg-teal-100 transition-colors">
                <span className="material-symbols-outlined text-[20px] flex">add_a_photo</span>
              </button>
            </div>
            
            {etablissement.images?.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {etablissement.images.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-gray-100 bg-gray-100">
                    <img src={getImageUrl(img.nom_image)} alt="gallery" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-2">
                      <div className="flex justify-end gap-2">
                        {img.est_principale !== 1 && (
                          <button onClick={() => setMainImage(img.id)} className="text-white bg-black/50 p-1.5 rounded-full hover:bg-amber-500 transition-colors backdrop-blur-sm">
                            <span className="material-symbols-outlined text-[16px] flex">star</span>
                          </button>
                        )}
                        <button onClick={() => supprimerImage(img.id)} className="text-white bg-black/50 p-1.5 rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm">
                          <span className="material-symbols-outlined text-[16px] flex">delete</span>
                        </button>
                      </div>
                    </div>
                    {img.est_principale === 1 && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">COVER</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-xl">Aucune photo ajoutée.</p>
            )}
          </section>

          {/* TABLES */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">table_restaurant</span> Tables ({etablissement.tables?.length || 0})
              </h2>
              <button onClick={() => setShowAddTableModal(true)} className="text-teal-700 bg-teal-50 p-2 rounded-full hover:bg-teal-100 transition-colors">
                <span className="material-symbols-outlined text-[20px] flex">add</span>
              </button>
            </div>
            
            {etablissement.tables?.length > 0 ? (
              <div className="space-y-3">
                {etablissement.tables.map(table => (
                  <div key={table.id} className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-white w-10 h-10 rounded-lg shadow-sm flex justify-center items-center font-extrabold text-teal-700 border border-gray-100 text-sm">
                        N°{table.numero}
                      </div>
                      <span className="text-sm font-bold text-gray-600">{table.capacite} places</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditType('tabl'); setEditData({ IdTabl: table.id, numero: table.numero, capacite: table.capacite }); setShowEditTableModal(true); }} className="text-gray-400 hover:text-teal-600 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-[18px] flex">edit</span>
                      </button>
                      <button onClick={() => supprimerTable(table.id)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-[18px] flex">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-xl">Aucune table ajoutée.</p>
            )}
          </section>
        </div>
      </div>

      {/* ================= MODALS (RESPONSIVE) ================= */}

      {/* MODAL EDIT ETAB */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Modifier l'établissement</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" placeholder="Nom" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={editData.nom || ''} onChange={e => setEditData({...editData, nom: e.target.value})} required />
              <textarea placeholder="Description" rows="3" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium resize-none" value={editData.description || ''} onChange={e => setEditData({...editData, description: e.target.value})} required />
              <input type="text" placeholder="Adresse" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={editData.adresse || ''} onChange={e => setEditData({...editData, adresse: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Ville" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={editData.ville || ''} onChange={e => setEditData({...editData, ville: e.target.value})} required />
                <input type="text" placeholder="Téléphone" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={editData.telephone || ''} onChange={e => setEditData({...editData, telephone: e.target.value})} required />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full font-bold w-full sm:w-auto transition-colors">Annuler</button>
                <button type="submit" className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold w-full sm:w-auto hover:bg-teal-700 shadow-md transition-colors">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD TABLE */}
      {showAddTableModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Ajouter une Table</h2>
            <form onSubmit={handleAddTableSubmit} className="space-y-4">
              <input type="number" min="1" placeholder="Numéro (ex: 3)" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={newTable.numero} onChange={e => setNewTable({...newTable, numero: e.target.value})} required />
              <input type="number" min="1" placeholder="Capacité (ex: 4)" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={newTable.capacite} onChange={e => setNewTable({...newTable, capacite: e.target.value})} required />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowAddTableModal(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full font-bold w-full sm:w-auto">Annuler</button>
                <button type="submit" className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold w-full sm:w-auto hover:bg-teal-700 shadow-md">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT TABLE */}
      {showEditTableModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Modifier la Table</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="number" min="1" placeholder="Numéro" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={editData.numero || ''} onChange={e => setEditData({...editData, numero: e.target.value})} required />
              <input type="number" min="1" placeholder="Capacité" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={editData.capacite || ''} onChange={e => setEditData({...editData, capacite: e.target.value})} required />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowEditTableModal(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full font-bold w-full sm:w-auto">Annuler</button>
                <button type="submit" className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold w-full sm:w-auto hover:bg-teal-700 shadow-md">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD IMAGE (GALERIE) */}
      {showAddImageModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Ajouter une Photo</h2>
            <form onSubmit={handleAddImageSubmit} className="space-y-4">
              <input type="file" accept="image/*" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" onChange={e => setNewImage({ file: e.target.files[0] })} required />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowAddImageModal(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-full font-bold w-full sm:w-auto">Annuler</button>
                <button type="submit" className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold w-full sm:w-auto hover:bg-teal-700 shadow-md">Uploader</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD CATEGORIE */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Ajouter Catégorie</h2>
            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <input type="text" placeholder="Nom de la catégorie" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={newCategory.nom} onChange={e => setNewCategory({ nom: e.target.value })} required />
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowAddCategoryModal(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-full font-bold w-full sm:w-auto">Annuler</button>
                <button type="submit" className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold w-full sm:w-auto hover:bg-teal-700 shadow-md">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD/EDIT PRODUIT (HADA LI KAN NA9ESS) */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              {productData.IdProduit ? 'Modifier le plat' : 'Ajouter un plat'}
            </h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <input type="text" placeholder="Nom du plat" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={productData.nom} onChange={e => setProductData({ ...productData, nom: e.target.value })} required />
              
              <textarea placeholder="Description (facultatif)" rows="3" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium resize-none" value={productData.description} onChange={e => setProductData({ ...productData, description: e.target.value })} />
              
              <div className="grid grid-cols-2 gap-4">
                <input type="number" min="0" step="0.01" placeholder="Prix (DH)" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" value={productData.prix} onChange={e => setProductData({ ...productData, prix: e.target.value })} required />
                
                <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium cursor-pointer" value={productData.categorie_id} onChange={e => setProductData({ ...productData, categorie_id: e.target.value })} required >
                  <option value="" disabled>Catégorie</option>
                  {categoriesList.map(category => (
                    <option key={category.id} value={category.id}>{category.nom}</option>
                  ))}
                </select>
              </div>
              
              {categoriesList.length === 0 && (
                <p className="text-sm text-red-600 font-bold bg-red-50 p-3 rounded-xl">⚠️ Ajoutez d'abord une catégorie !</p>
              )}
              
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full font-bold w-full sm:w-auto transition-colors">Annuler</button>
                <button type="submit" disabled={categoriesList.length === 0} className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold w-full sm:w-auto hover:bg-teal-700 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {productData.IdProduit ? 'Sauvegarder' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GESTION IMAGES DU PRODUIT (HADA TA HOWA KAN NA9ESS) */}
      {showProductOptionModal  && selectedProduct &&(
         <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Options de <span className="text-teal-600">{selectedProduct.nom}</span></h2>
            
           <form onSubmit={handleProductOptionSubmit} className="space-y-4">
            
              <input type="text" placeholder="Nom du Option" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium" onChange={e => setProductOptionData({ ...productOptionData, nom_option: e.target.value })} required />
           
              <input type="number" min="0" step="0.10" placeholder="Prix (DH)" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-medium"  onChange={e => setProductOptionData({ ...productOptionData, prix_supplementaire: e.target.value })} required />
                
             
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowProductOptionModal(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full font-bold w-full sm:w-auto transition-colors">Fermer</button>
                <button type="submit" className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold w-full sm:w-auto hover:bg-teal-700 shadow-md transition-colors">Ajouter Option</button>
              </div>
            </form>
            </div>
            </div>)
      }
      {showProductImageModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Images de <span className="text-teal-600">{selectedProduct.nom}</span></h2>
            
            {selectedProduct.produit_images?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {selectedProduct.produit_images.map(image => (
                  <div key={image.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-100 shadow-sm group">
                    <img src={getImageUrl(image.nom_image)} alt={selectedProduct.nom} className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2 backdrop-blur-[2px]">
                      {image.est_principale !== 1 && (
                        <button type="button" onClick={() => setMainImageProduit(selectedProduct, image.id)} className="bg-black/60 text-white p-1.5 rounded-full hover:bg-amber-500 transition-colors" title="Cover">
                          <span className="material-symbols-outlined text-[16px] flex">star</span>
                        </button>
                      )}
                      <button type="button" onClick={() => supprimerImageProduit(selectedProduct, image.id)} className="bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors" title="Supprimer">
                        <span className="material-symbols-outlined text-[16px] flex">delete</span>
                      </button>
                    </div>

                    {image.est_principale === 1 && (
                      <span className="absolute bottom-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase shadow-sm">Cover</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-xl mb-6">Aucune image pour ce plat.</p>
            )}
            
            <form onSubmit={handleProductImageSubmit} className="space-y-4">
              <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" onChange={e => setProductImage(e.target.files[0] || null)} required />
              
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                <button type="button" onClick={() => setShowProductImageModal(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full font-bold w-full sm:w-auto transition-colors">Fermer</button>
                <button type="submit" className="bg-teal-600 text-white px-5 py-2.5 rounded-full font-bold w-full sm:w-auto hover:bg-teal-700 shadow-md transition-colors">Ajouter photo</button>
              </div>
            </form>
             
          </div>
        </div>
      )}

    </div>
  );
}