import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // ================= LOGIC: LOGIN CLASSIQUE =================
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await axiosInstance.post('/login', {
                email: email,
                password: password
            });
            const token = response.data.token;
            const user = response.data.user;
            const role = response.data.role;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify(user));
            
            if (token && role === 'gerant') {
                navigate("/dashboardGarant");
                return;
            }
            if (token && role === 'admin') {
                navigate("/dashboardAdmin");
                return;
            }
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Erreur de connexion avec le serveur.");
            }
        }
    };

    // ================= LOGIC: GOOGLE LOGIN =================
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await axiosInstance.post('/auth/google', {
                    token: tokenResponse.access_token
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                window.location.href = '/profil';

            } catch (error) {
                console.error("Erreur connexion sur lbackend:", error);
            }
        },
        onError: errorResponse => console.log("Erreur Google:", errorResponse),
    });

    // ================= RENDU (DESIGN) =================
    return (
        <div className="min-h-screen flex bg-gray-50 font-sans text-gray-900 antialiased">
            
            {/* L'Jiha d Lisser (Tswira, Katban ghir f PC w Tablette) */}
            <div className="hidden lg:flex w-1/2 relative bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498837167922-41c543210940?q=80&w=2070&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-teal-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
                
                {/* Text fo9 Tswira */}
                <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl z-10">
                    <h1 className="text-white text-5xl font-black mb-3 tracking-tight">Reservy</h1>
                    <p className="text-gray-200 text-lg font-medium leading-relaxed">Réservez votre table et savourez le terroir. La meilleure expérience culinaire commence ici.</p>
                </div>
            </div>

            {/* L'Jiha d Limen (Formulaire) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                
                {/* Bouton Retour Accueil (Optionnel, zedto lik bach ykon 3amali) */}
                <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-teal-600 flex items-center gap-2 font-bold transition-colors">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    <span className="hidden sm:inline">Retour</span>
                </Link>

                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 sm:p-10 border border-gray-100 mt-8 sm:mt-0">
                    
                    {/* Les Tabs (Connexion / Inscription) */}
                    <div className="flex w-full border-b border-gray-100 mb-8">
                        <button className="w-1/2 pb-4 text-center text-sm font-black text-teal-600 border-b-2 border-teal-600">
                            Connexion
                        </button>
                        <button 
                            onClick={() => navigate('/register')}
                            className="w-1/2 pb-4 text-center text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Créer un compte
                        </button>
                    </div>

                    {/* Message d'erreur */}
                    {errorMessage && (
                        <div className="mb-6 bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-bold text-center border border-red-100 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {errorMessage}
                        </div>
                    )}

                    {/* Formulaire classique */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Adresse E-mail</label>
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
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider">Mot de passe</label>
                                <button 
                                    type="button"
                                    onClick={() => navigate('/forgot-password')} 
                                    className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all text-sm font-medium text-gray-900 tracking-widest placeholder:tracking-normal placeholder:text-gray-400"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-black py-3.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Se connecter
                                <span className="material-symbols-outlined text-[18px]">login</span>
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
                            className="w-full flex justify-center items-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-bold py-3.5 px-4 rounded-full transition-all shadow-sm hover:shadow-md"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Se connecter avec Google
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}