import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Navbar from '../components/Navbar';
import { getImageUrl } from '../utils/imageUrl';

// Icons SVG
const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const LocationIcon = () => (
  <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Chargement en cours...</div>;
  if (!etablissement) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Aucun établissement trouvé.</div>;

  const categories = Array.from(new Map((etablissement.produits || []).filter((p) => p.categorie).map((p) => [p.categorie.id, p.categorie])).values());
  const filteredProduits = selectedCategory === 'ALL' ? etablissement.produits || [] : (etablissement.produits || []).filter((p) => p.categorie_id === selectedCategory);
  const etabImages = sortImages(etablissement.images);

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-12">
        
        {/* Titre & Informations */}
        <section>
          <h1 className="text-3xl font-black">{etablissement.nom}</h1>
          <p className="text-gray-500 text-sm mt-1">{etablissement.description}</p>
          <div className="flex flex-wrap items-center gap-6 mt-3 text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1.5"><LocationIcon /> {etablissement.ville} - {etablissement.adresse}</span>
            <span className="flex items-center gap-1.5"><PhoneIcon /> {etablissement.telephone}</span>
            <span className="flex items-center gap-1.5 text-amber-500">
              <StarIcon /> {parseFloat(etablissement.note_moyenne || 0).toFixed(1)}
            </span>
          </div>
        </section>

        {/* 1. Layout Galerie Dynamique */}
        {etabImages.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex gap-4 h-[250px] md:h-[300px]">
              <div className={`${etabImages[1] ? 'w-[65%]' : 'w-full'} rounded-2xl overflow-hidden`}>
                <img src={getImageUrl(etabImages[0].nom_image)} alt="Principal" className="w-full h-full object-cover" />
              </div>
              {etabImages[1] && (
                <div className="w-[35%] rounded-2xl overflow-hidden">
                  <img src={getImageUrl(etabImages[1].nom_image)} alt="Side" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            {etabImages.length > 2 && (
              <div className={`grid gap-4 h-[160px] md:h-[200px] ${
                etabImages.length === 3 ? 'grid-cols-1' : 
                etabImages.length === 4 ? 'grid-cols-2' : 
                'grid-cols-3'
              }`}>
                {etabImages.slice(2, 5).map((img, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden">
                    <img src={getImageUrl(img.nom_image)} alt={`Gallery ${idx + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 2. Menu, Categories & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-8 space-y-8">
            
            {/* Categories */}
            <div>
              <h2 className="text-xl font-black mb-4">Catégories</h2>
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <div 
                  onClick={() => setSelectedCategory('ALL')} 
                  className={`flex flex-col border rounded-xl overflow-hidden cursor-pointer min-w-[120px] transition-all ${selectedCategory === 'ALL' ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <div className="h-[90px] bg-gray-50 flex items-center justify-center">
                    <span className="text-gray-400 text-xs font-bold">Tous</span>
                  </div>
                  <div className="border-t border-gray-200 p-2 text-center text-xs font-bold bg-white">
                    Tous les produits
                  </div>
                </div>

                {categories.map((cat) => {
                  const firstProduct = etablissement.produits?.find((p) => p.categorie_id === cat.id);
                  const catImg = firstProduct?.produit_images?.[0];

                  return (
                    <div 
                      key={cat.id} 
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col border rounded-xl overflow-hidden cursor-pointer min-w-[120px] transition-all ${selectedCategory === cat.id ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      <div className="h-[90px] bg-gray-50">
                        {catImg && (
                          <img src={getImageUrl(catImg.nom_image)} alt={cat.nom} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="border-t border-gray-200 p-2 text-center text-xs font-bold bg-white">
                        {cat.nom}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tables Disponibles */}
            {etablissement.tables && etablissement.tables.length > 0 && (
              <div>
                <h2 className="text-xl font-black mb-4">Tables Disponibles</h2>
                <div className="flex flex-wrap gap-3">
                  {etablissement.tables.map((tbl) => (
                    <div key={tbl.id} className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">Table {tbl.numero}</span>
                      <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {tbl.capacite} pers
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Produits Grid Dynamique */}
            <div>
              <h2 className="text-xl font-black mb-4">Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredProduits.map((prod) => {
                  const prodImages = sortImages(prod.produit_images);

                  return (
                    <div key={prod.id} className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow">
                      
                      {/* Structure des images */}
                      {prodImages.length > 0 && (
                        <div className="flex h-[150px]">
                          {prodImages.length === 1 ? (
                            <div className="w-full">
                              <img src={getImageUrl(prodImages[0].nom_image)} alt={prod.nom} className="w-full h-full object-cover" />
                            </div>
                          ) : prodImages.length === 2 ? (
                            <>
                              <div className="w-[65%] border-r border-gray-200">
                                <img src={getImageUrl(prodImages[0].nom_image)} alt={prod.nom} className="w-full h-full object-cover" />
                              </div>
                              <div className="w-[35%]">
                                <img src={getImageUrl(prodImages[1].nom_image)} alt="Option 1" className="w-full h-full object-cover" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-[65%] border-r border-gray-200">
                                <img src={getImageUrl(prodImages[0].nom_image)} alt={prod.nom} className="w-full h-full object-cover" />
                              </div>
                              <div className="w-[35%] flex flex-col">
                                <div className="h-1/2 border-b border-gray-200">
                                  <img src={getImageUrl(prodImages[1].nom_image)} alt="Option 1" className="w-full h-full object-cover" />
                                </div>
                                <div className="h-1/2">
                                  <img src={getImageUrl(prodImages[2].nom_image)} alt="Option 2" className="w-full h-full object-cover" />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Info, Description & Bouton */}
                      <div className="p-4 flex flex-col gap-2.5 border-t border-gray-200 bg-white">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-bold text-sm text-gray-900">{prod.nom}</h4>
                          <span className="text-xs font-black text-emerald-700 shrink-0">{prod.prix} MAD</span>
                        </div>

                        {/* Description Produit */}
                        {prod.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>
                        )}

                        <div className="pt-1 flex justify-end">
                          <button onClick={() => addToCart(prod)} className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all">
                            + Ajouter
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar (Your order) */}
          <aside className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm sticky top-24">
            <h3 className="text-2xl font-black tracking-tight">Your order</h3>
            <p className="text-xs text-gray-400 font-semibold mt-1 mb-6">
              {cart.reduce((total, item) => total + item.quantity, 0)} produits
            </p>

            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs font-semibold">Le panier est vide.</div>
              ) : (
                cart.map((item) => {
                  const itemImg = sortImages(item.produit_images)[0];
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border border-gray-100 overflow-hidden shrink-0">
                          {itemImg && (
                            <img src={getImageUrl(itemImg.nom_image)} alt={item.nom} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{item.nom}</h4>
                          <span className="text-[11px] font-bold text-gray-500">{item.prix} MAD</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-bold">
                        {item.quantity === 1 ? (
                          <button onClick={() => removeFromCart(item.id)}><TrashIcon /></button>
                        ) : (
                          <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-gray-600">-</button>
                        )}
                        <span className="px-1 text-gray-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-gray-600">+</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100">
              <button disabled={cart.length === 0} className="w-full py-3.5 bg-[#0e6b56] hover:bg-[#0b5443] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-black rounded-full transition-all">
                Go to checkout • {cartTotal.toFixed(2)} MAD
              </button>
            </div>
          </aside>
        </div>

        {/* 3. Avis Clients (Reviews) */}
        {etablissement.reviews && etablissement.reviews.length > 0 && (
          <section className="pt-10 border-t border-gray-200">
            <h2 className="text-xl font-black mb-6">Avis Clients</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {etablissement.reviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-900">{rev.client?.name || 'Client Anonyme'}</span>
                    <span className="text-amber-500 font-bold text-xs flex items-center gap-1">
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