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

            localStorage.setItem('token', token);
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
                // tokenResponse.access_token howa li Socialite kaytsna
                const response = await axiosInstance.post('/auth/google', {
                    token: tokenResponse.access_token
                });

                // Khbe3 Token w l'User
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Zid l'Token f header dyal Axios
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

                // Dih l'profil awla dashboard
                window.location.href = '/profil';

            } catch (error) {
                console.error("Erreur dyal connexion m3a l'backend:", error);
            }
        },
        onError: errorResponse => console.log("Erreur Google:", errorResponse),
    });

    return (
        <div className="min-h-screen flex bg-[#f8f9fa] font-sans">
            
            {/* L'Jiha d Lisser (Tswira w l'Glassmorphism) */}
            <div className="hidden lg:flex w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop')" }}>
                {/* L'mrebe3 dyal Reservy (Glass Effect) */}
                <div className="absolute bottom-12 left-12 right-12 bg-white/20 backdrop-blur-md border border-white/30 p-8 rounded-2xl shadow-lg">
                    <h1 className="text-white text-4xl font-bold mb-2">Reservy</h1>
                    <p className="text-white/90 text-lg">Book your seat at the table.</p>
                </div>
            </div>

            {/* L'Jiha d Limen (Formulaire) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 sm:p-10">
                    
                    {/* Les Tabs (Log In / Create Account) */}
                    <div className="flex w-full border-b border-gray-200 mb-8">
                        <button className="w-1/2 pb-4 text-center text-sm font-bold text-[#b04121] border-b-2 border-[#b04121]">
                            Log In
                        </button>
                        <button 
                            onClick={() => navigate('/register')}
                            className="w-1/2 pb-4 text-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Message d'erreur ila kayn */}
                    {errorMessage && (
                        <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        
                        {/* Email Input */}
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

                        {/* Password Input */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-gray-700">Password</label>
                          <button 
    type="button"
    onClick={() => navigate('/forgot-password')} 
    className="text-xs font-bold text-[#b04121] hover:underline"
>
    Forgot Password?
</button>
  </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none transition-all text-sm tracking-widest"
                            />
                        </div>

                        {/* Sign In Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-[#b04121] hover:bg-[#8e341a] text-white font-bold py-3.5 rounded-lg transition-colors text-sm"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>

                    {/* Or continue with */}
                    <div className="mt-8 flex items-center">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="px-4 text-xs text-gray-500 font-medium">Or continue with</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Social Buttons */}
                    <div className="mt-6 space-y-3">
                        <div className="mt-4 flex justify-center">
                            <button 
                                type="button" 
                                onClick={() => handleGoogleLogin()} 
                                className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gray-50"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                Se connecter avec Google
                            </button>
                        </div>
                        
                        <div className="mt-4 flex justify-center">
                            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors text-sm">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.31-.83 3.73-.7 1.15.11 2.2.53 3.02 1.25-2.61 1.57-2.14 5.48.56 6.64-1.12 2.8-2.31 4.54-2.39 4.98zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                </svg>
                                Apple
                            </button>
                        </div>
                    </div> {/* <-- Hada howa l'div li kan nakes */}
                    
                </div>
            </div>
        </div>
    );
}