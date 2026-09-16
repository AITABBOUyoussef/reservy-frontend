import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Navbar from '../components/Navbar';

export default function DashboardGarant() {
  const navigate = useNavigate();
  // غنخزنو المطعم الأول مباشرة هنا
  const [etablissement, setEtablissement] = useState(null);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE_URL = "http://127.0.0.1:8000/photos/";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axiosInstance.get('/MonEtablissment');
        
        // 💡 هنا السر: كنفحصو واش كاين Array وناخدو المطعم الأول [0]
        if (response.data && response.data.etablissements && response.data.etablissements.length > 0) {
          setEtablissement(response.data.etablissements[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <span className="material-symbols-outlined animate-spin text-teal-500 text-5xl">autorenew</span>
      </div>
    );
  }

  // 🔴 يلا الجيرو عاد تسجل وماعندو حتى مطعم
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

  // 🟢 تحديد الصورة الرئيسية للكوفر
  const mainImage = etablissement.images?.find(img => img.est_principale === 1) || etablissement.images?.[0];

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans text-gray-900">
      <Navbar />
      
      {/* ================= HEADER & COVER ================= */}
      <div className="relative w-full h-72 bg-teal-900 mt-[64px]">
        {mainImage ? (
          <img 
            src={`${IMAGE_BASE_URL}${mainImage.nom_image}`} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <span className="material-symbols-outlined text-white text-6xl">restaurant</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex items-end">
          <div className="max-w-6xl mx-auto px-6 pb-8 w-full flex justify-between items-end">
            <div className="text-white">
              {/* شارة الحالة (Statut) */}
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
            
            <button className="bg-white text-gray-900 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 shadow-lg transition-all">
              <span className="material-symbols-outlined text-[20px]">visibility</span>
              Aperçu
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN DASHBOARD GRID ================= */}
      <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE (Infos, Menu, Avis) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Informations de base */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">info</span>
                Informations
              </h2>
              <button className="text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-teal-100 transition-colors">
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

          {/* 2. Menu (Produits) */}
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
                    <div className="flex flex-col gap-2 justify-center border-l pl-3 border-gray-200">
                      <button className="text-gray-400 hover:text-teal-600 bg-white p-1.5 rounded-md shadow-sm border border-gray-100"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                      <button className="text-gray-400 hover:text-red-600 bg-white p-1.5 rounded-md shadow-sm border border-gray-100"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-xl">Aucun plat dans votre menu.</p>
              )}
            </div>
          </section>

          {/* 3. Avis Clients */}
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

        {/* COLONNE DROITE (Galerie, Tables) */}
        <div className="space-y-8">
          
          {/* 4. Galerie Photos */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">photo_library</span>
                Galerie
              </h2>
              <button className="text-teal-600 bg-teal-50 p-2 rounded-lg hover:bg-teal-100 transition-colors">
                <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
              </button>
            </div>
            
            {etablissement.images?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {etablissement.images.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-gray-100">
                    <img src={`${IMAGE_BASE_URL}${img.nom_image}`} alt="gallery" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2">
                      <button className="text-white hover:text-red-400 bg-black/40 p-2 rounded-full backdrop-blur-sm"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                    {img.est_principale === 1 && <span className="absolute bottom-2 left-2 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md uppercase">Cover</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-xl">Aucune photo ajoutée.</p>
            )}
          </section>

          {/* 5. Tables */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">table_restaurant</span>
                Tables ({etablissement.tables?.length || 0})
              </h2>
              <button className="text-teal-600 bg-teal-50 p-2 rounded-lg hover:bg-teal-100 transition-colors">
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
                    <button className="text-gray-400 hover:text-red-500 bg-white p-1.5 rounded-md shadow-sm border border-gray-100"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500 text-sm border border-dashed rounded-xl">Aucune table ajoutée.</p>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}