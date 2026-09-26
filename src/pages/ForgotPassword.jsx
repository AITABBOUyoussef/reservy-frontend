import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import AuthShell from "../components/AuthShell";

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
            setMessage(response.data.message);
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
        <AuthShell title="Mot de passe oublié ?" subtitle="Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.">
                {message && <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</div>}
                {errorMessage && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-600">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Adresse e-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="hello@reservy.com"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-teal-600 py-3.5 text-sm font-black text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-sm font-bold text-slate-500 transition hover:text-teal-700"
                    >
                        &larr; Retour à la connexion
                    </button>
                </div>
            </AuthShell>
    );
}