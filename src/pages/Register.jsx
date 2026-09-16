import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

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
            navigate('/dashboard');
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

    return (
        <div className="mt-[60px] flex bg-surface font-body-md text-body-md text-on-surface antialiased">
            
            <div className="hidden lg:flex w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-primary-fixed/20"></div>
                <div className="absolute bottom-12 left-12 right-12 bg-surface-white/20 backdrop-blur-md border border-surface-white/30 p-8 rounded-2xl shadow-lg z-10">
                    <h1 className="text-surface-white font-display-lg text-display-lg font-extrabold mb-2">Reservy</h1>
                    <p className="text-surface-white/90 font-headline-sm">Rejoignez-nous et réservez les meilleures tables.</p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-surface-white rounded-2xl shadow-sm p-8 sm:p-10 border border-surface-container">
                    
                    <div className="flex w-full border-b border-surface-container mb-8">
                        <button 
                            onClick={() => navigate('/login')}
                            className="w-1/2 pb-4 text-center font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                            Connexion
                        </button>
                        <button className="w-1/2 pb-4 text-center font-label-lg text-label-lg font-bold text-primary border-b-2 border-primary">
                            Créer un compte
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="mb-6 bg-error-container text-error p-3 rounded-lg text-sm font-medium text-center break-words">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        
                        <div>
                            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">Nom Complet</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Votre nom"
                                className="w-full px-4 py-3 rounded-lg bg-surface-card border border-outline-variant focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-body-md"
                            />
                        </div>

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
                            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg bg-surface-card border border-outline-variant focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface font-body-md tracking-widest"
                            />
                        </div>
                        
                        <div>
                            <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-2">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                                Créer un compte
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 flex items-center">
                        <div className="flex-1 border-t border-surface-container"></div>
                        <span className="px-4 font-label-sm text-label-sm text-on-surface-variant">Ou continuer avec</span>
                        <div className="flex-1 border-t border-surface-container"></div>
                    </div>

                    <div className="mt-6">
                        <button className="w-full flex justify-center items-center gap-space-xs bg-surface-white border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-label-md font-bold py-3 px-4 rounded-full transition-colors shadow-sm">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Se connecter avec Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}