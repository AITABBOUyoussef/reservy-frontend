import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar"; 

export default function AddEtablissment() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
 

  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [telephone, setTelephone] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {  const response = await axiosInstance.post('/CreeEtablissement', {
       
        nom: nom,
        description: description,
        adresse: adresse,
        ville: ville,
        telephone: telephone
      });

     
      navigate('/dashboardGarant'); 
      
    } catch (error) {
      if (error.response?.data?.errors?.email) {
        setErrorMessage(error.response.data.errors.email[0]);
      } else if (error.response?.data?.errors) {
        const firstErr = Object.values(error.response.data.errors)[0][0];
        setErrorMessage(firstErr);
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Erreur de connexion avec le serveur.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Navbar />

      <main className="pt-24 pb-12 flex justify-center items-center px-4">
        <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="mb-8 text-center">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-teal-600 text-3xl">storefront</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Inscrire votre restaurant</h1>
            <p className="text-sm text-gray-500 mt-2">Renseignez les informations de base de votre établissement.</p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100 text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-5">
            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de l'établissement *</label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="Ex: Le Petit Chef"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
              <textarea
                required
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
                placeholder="Décrivez brièvement votre restaurant..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Ville */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ville *</label>
                <input
                  type="text"
                  required
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  placeholder="Ex: Beni Mellal"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  placeholder="Ex: +212600000000"
                />
              </div>
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse complète *</label>
              <input
                type="text"
                required
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                placeholder="Ex: 123 Avenue Mohammed V"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl text-white font-bold text-lg transition-all ${
                  isLoading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg'
                }`}
              >
                {isLoading ? 'Enregistrement...' : 'Créer l\'établissement'}
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}