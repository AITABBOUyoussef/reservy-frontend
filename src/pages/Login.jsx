import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

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
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
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
                
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                window.location.href = '/profil';

            } catch (error) {
                console.error("Erreur dyal connexion m3a l'backend:", error);
            }
        },
        onError: errorResponse => console.log("Erreur Google:", errorResponse),
    });

    return (
        <div className="min-h-screen flex bg-surface font-body-md text-body-md text-on-surface antialiased">
            
            {/* L'Jiha d Lisser (Tswira w l'Glassmorphism) */}
            <div className="hidden lg:flex w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498837167922-41c543210940?q=80&w=2070&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-primary-fixed/20"></div>
                <div className="absolute bottom-12 left-12 right-12 bg-surface-white/20 backdrop-blur-md border border-surface-white/30 p-8 rounded-2xl shadow-lg z-10">
                    <h1 className="text-surface-white font-display-lg text-display-lg font-extrabold mb-2">Reservy</h1>
                    <p className="text-surface-white/90 font-headline-sm">Réservez votre table et savourez le terroir.</p>
                </div>
            </div>

            {/* L'Jiha d Limen (Formulaire) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-surface-white rounded-2xl shadow-sm p-8 sm:p-10 border border-surface-container">
                    
                    {/* Les Tabs */}
                    <div className="flex w-full border-b border-surface-container mb-8">
                        <button className="w-1/2 pb-4 text-center font-label-lg text-label-lg font-bold text-primary border-b-2 border-primary">
                            Connexion
                        </button>
                        <button 
                            onClick={() => navigate('/register')}
                            className="w-1/2 pb-4 text-center font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                            Créer un compte
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="mb-6 bg-error-container text-error p-3 rounded-lg text-sm font-medium text-center">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">Adresse E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="hello@reservy.com"
                                className="w-full px-4 py-3 rounded-lg bg-surface-card border border-outline-variant focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-body-md"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Mot de passe</label>
                                <button 
                                    type="button"
                                    onClick={() => navigate('/forgot-password')} 
                                    className="font-label-sm text-label-sm text-secondary hover:underline font-bold"
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
                                className="w-full px-4 py-3 rounded-lg bg-surface-card border border-outline-variant focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-body-md tracking-widest"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-bold py-3.5 rounded-full transition-colors shadow-sm active:scale-95"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 flex items-center">
                        <div className="flex-1 border-t border-surface-container"></div>
                        <span className="px-4 font-label-sm text-label-sm text-on-surface-variant">Ou continuer avec</span>
                        <div className="flex-1 border-t border-surface-container"></div>
                    </div>

                    {/* Social Buttons (Seulement Google) */}
                    <div className="mt-6">
                        <button 
                            type="button" 
                            onClick={() => handleGoogleLogin()} 
                            className="w-full flex justify-center items-center gap-space-xs bg-surface-white border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-label-md font-bold py-3 px-4 rounded-full transition-colors shadow-sm"
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