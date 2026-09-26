import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useGoogleLogin } from '@react-oauth/google';

const googleLoginAvailable = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

export default function Register() {
    const [name , setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) =>{
        e.preventDefault();
        setErrorMessage('');
        try{
            const response = await axiosInstance.post('/Register',{
                name : name, 
                email: email,
                password: password,
                password_confirmation : passwordConfirmation
            });
            const token = response.data.token;
            const user = response.data.user;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', response.data.role);
            navigate('/');
        }catch (error) {
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
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await axiosInstance.post('/auth/google', {
                    token: tokenResponse.access_token
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('role', response.data.role);
                
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                window.location.href = '/profil';

            } catch (error) {
                setErrorMessage(error.response?.data?.message || "La connexion avec Google a échoué.");
            }
        },
        onError: () => setErrorMessage("La connexion avec Google a été annulée ou a échoué."),
    });

    return (
        <div className="min-h-screen flex bg-gray-50 font-sans text-gray-900 antialiased">
            
            <div className="hidden lg:flex w-1/2 relative bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-teal-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
                
                <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl z-10">
                    <h1 className="text-white text-5xl font-black mb-3 tracking-tight">Reservy</h1>
                    <p className="text-gray-200 text-lg font-medium leading-relaxed">Rejoignez-nous et réservez les meilleures tables. Votre aventure gastronomique commence ici.</p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                
                <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-teal-600 flex items-center gap-2 font-bold transition-colors">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    <span className="hidden sm:inline">Retour</span>
                </Link>

                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 sm:p-10 border border-gray-100 mt-8 sm:mt-0">
                    
                    <div className="flex w-full border-b border-gray-100 mb-8">
                        <button 
                            onClick={() => navigate('/login')}
                            className="w-1/2 pb-4 text-center text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Connexion
                        </button>
                        <button className="w-1/2 pb-4 text-center text-sm font-black text-teal-600 border-b-2 border-teal-600">
                            Créer un compte
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="mb-6 bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-bold text-center border border-red-100 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
                            <span className="text-left leading-tight break-words">{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Nom Complet</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Votre nom complet"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Adresse E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="hello@reservy.com"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all text-sm font-medium text-gray-900 tracking-widest placeholder:tracking-normal placeholder:text-gray-400"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all text-sm font-medium text-gray-900 tracking-widest placeholder:tracking-normal placeholder:text-gray-400"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-black py-3.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Créer mon compte
                                <span className="material-symbols-outlined text-[18px]">person_add</span>
                            </button>
                        </div>
                    </form>

                    {/* Separateur */}
                    <div className="mt-8 flex items-center">
                        <div className="flex-1 border-t border-gray-100"></div>
                        <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ou continuer avec</span>
                        <div className="flex-1 border-t border-gray-100"></div>
                    </div>

                    {/* Bouton Google */}
                    <div className="mt-6">
                        <button 
                            type="button" 
                            onClick={() => handleGoogleLogin()} 
                            disabled={!googleLoginAvailable}
                            className="w-full flex justify-center items-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold py-3.5 px-4 rounded-full transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            {googleLoginAvailable ? "S'inscrire avec Google" : 'Inscription Google indisponible'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}