import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import AuthShell from "../components/AuthShell";

export default function ResetPassword() {
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

          
            setMessage(response.data.message);
            
       
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
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
        <AuthShell title="Nouveau mot de passe" subtitle={`Définissez un nouveau mot de passe pour ${email || "votre compte"}.`}>
                {message && <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-700">{message}</div>}
                {errorMessage && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-center text-sm font-semibold text-red-600">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Nouveau mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm tracking-widest outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm tracking-widest outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-teal-600 py-3.5 text-sm font-black text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {isLoading ? 'Modification en cours...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </div>
                </form>
        </AuthShell>
    );
}