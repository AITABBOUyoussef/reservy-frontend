import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axios";

export default function ResetPassword() {
    // Njibo token w email mn l'URL
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setMessage('');
        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/reset-password', {
                email: email,
                token: token,
                password: password,
                password_confirmation: passwordConfirmation
            });

            // Mli kaynj7 l'changement
            setMessage(response.data.message);
            
            // Ntsnaw 3 tawanin w ndiw l'user l'login
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            // Affichage dyal l'erreurs
            if (error.response?.data?.errors?.password) {
                setErrorMessage(error.response.data.errors.password[0]);
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Une erreur s'est produite lors de la réinitialisation.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] font-sans p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 sm:p-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Nouveau mot de passe</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Veuillez entrer votre nouveau mot de passe pour le compte <strong>{email}</strong>.
                </p>

                {/* Messages de succès ou d'erreur */}
                {message && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium text-center">{message}</div>}
                {errorMessage && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center">{errorMessage}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Input Mot de passe */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none transition-all text-sm tracking-widest"
                        />
                    </div>

                    {/* Input Confirmer le mot de passe */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none transition-all text-sm tracking-widest"
                        />
                    </div>

                    {/* Bouton de validation */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full text-white font-bold py-3.5 rounded-lg transition-colors text-sm ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#b04121] hover:bg-[#8e341a]'}`}
                        >
                            {isLoading ? 'Modification en cours...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}