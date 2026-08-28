import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrorMessage('');
        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/forgot-password', { email });
            setMessage(response.data.message); // "Le lien a été envoyé..."
        } catch (error) {
            if (error.response?.data?.errors?.email) {
                setErrorMessage(error.response.data.errors.email[0]);
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] font-sans p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 sm:p-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Mot de passe oublié ?</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                {message && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium">{message}</div>}
                {errorMessage && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">{errorMessage}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="hello@reservy.com"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none transition-all text-sm"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full text-white font-bold py-3.5 rounded-lg transition-colors text-sm ${isLoading ? 'bg-gray-400' : 'bg-[#b04121] hover:bg-[#8e341a]'}`}
                        >
                            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        &larr; Retour à la connexion
                    </button>
                </div>
            </div>
        </div>
    );
}