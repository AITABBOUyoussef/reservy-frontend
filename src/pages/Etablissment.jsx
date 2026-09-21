import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Navbar from '../components/Navbar';
import { getImageUrl } from '../utils/imageUrl';

// Icons SVG
const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const LocationIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function Etablissment() {
  const { id } = useParams();
  const [etablissement, setEtablissement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState([]);

  // Logique inchangée pour les images
  const sortImages = (imagesArray) => {
    if (!imagesArray || imagesArray.length === 0) return [];
    const mainImg = imagesArray.find(img => img.est_principale);
    const otherImgs = imagesArray.filter(img => !img.est_principale);
    return mainImg ? [mainImg, ...otherImgs] : imagesArray;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axiosInstance.post('/GetEtablissementDet', { etablissementId: id });
        if (response.data?.etablissements) {
          setEtablissement(response.data.etablissements);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  // Logique du panier inchangée
  const addToCart = (produit) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === produit.id);
      if (exists) return prev.map((item) => item.id === produit.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...produit, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, amount) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === productId) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId) => setCart((prev) => prev.filter((item) => item.id !== productId));
  const cartTotal = cart.reduce((acc, item) => acc + parseFloat(item.prix) * item.quantity, 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-teal-600 bg-gray-50"><span className="material-symbols-outlined animate-spin text-4xl">autorenew</span></div>;
  if (!etablissement) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold bg-gray-50">Aucun établissement trouvé.</div>;

  // Logique d'extraction des catégories (inchangée)
  const categories = Array.from(new Map((etablissement.produits || []).filter((p) => p.categorie).map((p) => [p.categorie.id, p.categorie])).values());
  // const options = Array.from(new Map((etablissement.produits || []).filter((p) => p.produit_options).map((p) => [p.produit_options.id, p.produit_options])).values());
  const filteredProduits = selectedCategory === 'ALL' ? etablissement.produits || [] : (etablissement.produits || []).filter((p) => p.categorie_id === selectedCategory);
  const etabImages = sortImages(etablissement.images);
  const mainImage = etabImages[0];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 pb-20 font-sans">
      <Navbar />

      {/* ================= HERO COVER (Design Wa3r fl Mobile w Desktop) ================= */}
      <div className="relative w-full h-[35vh] sm:h-[45vh] bg-gray-900 mt-[80px]">
        {mainImage ? (
          <img src={getImageUrl(mainImage.nom_image)} alt="Cover" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <span className="material-symbols-outlined text-white text-6xl">restaurant</span>
          </div>
        )}
        
        {/* Gradient Overlay w l-Ma3loumat */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="text-white max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">{etablissement.nom}</h1>
              {etablissement.description && (
                <p className="text-gray-200 mt-2 text-sm sm:text-base line-clamp-2">{etablissement.description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4">
                <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                  <StarIcon /> {parseFloat(etablissement.note_moyenne || 0).toFixed(1)}
                </span>
                <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                  <LocationIcon /> <span className="truncate max-w-[150px] sm:max-w-none">{etablissement.ville}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                  <PhoneIcon /> {etablissement.telephone}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= GAUCHE: MENU & CATÉGORIES ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* CATÉGORIES (Pills sans images, scrollable) */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">restaurant_menu</span>
                Catégories
              </h2>
              
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
                <button 
                  onClick={() => setSelectedCategory('ALL')} 
                  className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm shrink-0 border ${
                    selectedCategory === 'ALL' 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-105' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  Tous les plats
                </button>

                {categories.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm shrink-0 border ${
                      selectedCategory === cat.id 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-105' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    {cat.nom}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLES DISPONIBLES */}
            {etablissement.tables && etablissement.tables.length > 0 && (
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600">table_restaurant</span>
                  Tables Disponibles
                </h2>
                <div className="flex flex-wrap gap-3">
                  {etablissement.tables.map((tbl) => (
                    <div key={tbl.id} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">Table {tbl.numero}</span>
                      <span className="text-[11px] text-teal-800 font-bold bg-teal-100 px-2 py-0.5 rounded-md uppercase">
                        {tbl.capacite} pers
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MENU (GRILLE DES PLATS) */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-black">Menu</h2>
                <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {filteredProduits.length} plats
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredProduits.map((prod) => {
                  const prodImages = sortImages(prod.produit_images);

                  return (
                    <div key={prod.id} className="group border border-gray-100 rounded-2xl overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow">
                      
                      {/* Structure des images (inchangée, juste plus clean CSS) */}
                      {prodImages.length > 0 && (
                        <div className="flex h-[160px] sm:h-[180px] bg-gray-100">
                          {prodImages.length === 1 ? (
                            <div className="w-full h-full overflow-hidden">
                              <img src={getImageUrl(prodImages[0].nom_image)} alt={prod.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          ) : prodImages.length === 2 ? (
                            <>
                              <div className="w-[65%] border-r border-gray-100 overflow-hidden">
                                <img src={getImageUrl(prodImages[0].nom_image)} alt={prod.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              </div>
                              <div className="w-[35%] overflow-hidden">
                                <img src={getImageUrl(prodImages[1].nom_image)} alt="Option 1" className="w-full h-full object-cover" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-[65%] border-r border-gray-100 overflow-hidden">
                                <img src={getImageUrl(prodImages[0].nom_image)} alt={prod.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              </div>
                              <div className="w-[35%] flex flex-col">
                                <div className="h-1/2 border-b border-gray-100 overflow-hidden">
                                  <img src={getImageUrl(prodImages[1].nom_image)} alt="Option 1" className="w-full h-full object-cover" />
                                </div>
                                <div className="h-1/2 overflow-hidden">
                                  <img src={getImageUrl(prodImages[2].nom_image)} alt="Option 2" className="w-full h-full object-cover" />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Info & Bouton */}
            {/* Info & Bouton */}
                      <div className="p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
                        <div>
                          {/* Titre w Prix */}
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <h4 className="font-bold text-base text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                              {prod.nom}
                            </h4>
                            <span className="text-sm font-black text-amber-600 shrink-0 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                              {prod.prix} DH
                            </span>
                          </div>

                          {/* Options du Produit (Design Jdid) */}
                          {prod.produit_options && prod.produit_options.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {prod.produit_options.map((option) => (
                                <span 
                                  key={option.id} 
                                  className="text-[11px] font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                                >
                                  {option.nom_option}
                                  {/* Ila kant l'option 3ndha taman zayd (supplément), t9der tbiyno hna */}
                                  {option.prix_supplementaire > 0 && (
                                    <span className="text-teal-600">(+{option.prix_supplementaire} DH)</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Description */}
                          {prod.description && (
                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mt-1">
                              {prod.description}
                            </p>
                          )}
                        </div>

                        {/* Bouton Ajouter */}
                        <div className="pt-3 border-t border-gray-50 mt-auto">
                          <button 
                            onClick={() => addToCart(prod)} 
                            className="w-full py-2.5 bg-gray-50 hover:bg-teal-600 text-gray-700 hover:text-white border border-gray-200 hover:border-teal-600 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                            Ajouter au panier
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= DROITE: PANIER (STICKY SUR DESKTOP) ================= */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-200/40">
              <div className="flex items-center gap-3 mb-1">
                <span className="material-symbols-outlined text-teal-600 text-2xl">shopping_bag</span>
                <h3 className="text-2xl font-black tracking-tight">Votre Panier</h3>
              </div>
              <p className="text-sm text-gray-500 font-semibold mb-6">
                {cart.reduce((total, item) => total + item.quantity, 0)} produit(s) sélectionné(s)
              </p>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {cart.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">shopping_cart</span>
                    <p className="text-gray-500 text-sm font-semibold">Le panier est vide.</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const itemImg = sortImages(item.produit_images)[0];
                    return (
                      <div key={item.id} className="flex items-center justify-between gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                            {itemImg ? (
                              <img src={getImageUrl(itemImg.nom_image)} alt={item.nom} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-gray-300 text-[20px]">fastfood</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 truncate">{item.nom}</h4>
                            <span className="text-xs font-black text-amber-600">{item.prix} DH</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-full shrink-0">
                          {item.quantity === 1 ? (
                            <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-colors"><TrashIcon /></button>
                          ) : (
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold hover:bg-white rounded-full transition-colors">-</button>
                          )}
                          <span className="text-sm font-bold text-gray-900 w-3 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold hover:bg-white rounded-full transition-colors">+</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-bold">Total</span>
                  <span className="text-xl font-black text-gray-900">{cartTotal.toFixed(2)} DH</span>
                </div>
                <button 
                  disabled={cart.length === 0} 
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-sm font-black rounded-xl transition-all shadow-md disabled:shadow-none flex items-center justify-center gap-2"
                >
                  Passer la commande
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ================= AVIS CLIENTS ================= */}
        {etablissement.reviews && etablissement.reviews.length > 0 && (
          <section className="pt-10 border-t border-gray-200">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400">star</span>
              Avis Clients
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {etablissement.reviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-900">{rev.client?.name || 'Client Anonyme'}</span>
                    <span className="text-amber-500 font-bold text-xs flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                      <StarIcon /> {rev.note}/5
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{rev.commentaire}"</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}