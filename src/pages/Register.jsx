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
        <div className="min-h-screen flex bg-[#f8f9fa] font-sans">
            
            {/* L'Jiha d Lisser (Tswira w l'Glassmorphism) */}
            <div className="hidden lg:flex w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop')" }}>
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
                        {/* Tab: Log In (Inactif) */}
                        <button 
                            onClick={() => navigate('/login')}
                            className="w-1/2 pb-4 text-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Log In
                        </button>
                        {/* Tab: Create Account (Actif) */}
                        <button className="w-1/2 pb-4 text-center text-sm font-bold text-[#b04121] border-b-2 border-[#b04121]">
                            Create Account
                        </button>
                    </div>
    {/* Message d'erreur ila kayn */}
                   {errorMessage && (
    <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center break-words">
        {errorMessage}
    </div>
)}
                    {/* Formulaire (Bla Logique) */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        
                        {/* Name Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                  value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Nom Complet"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none transition-all text-sm"
                            />
                        </div>

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
                            <label className="block text-xs font-bold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                  value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none transition-all text-sm tracking-widest"
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">Password_confirmation</label>
                            <input
                                type="password"
                                  value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none transition-all text-sm tracking-widest"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-[#b04121] hover:bg-[#8e341a] text-white font-bold py-3.5 rounded-lg transition-colors text-sm"
                            >
                                Create Account
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
                        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors text-sm">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors text-sm">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.31-.83 3.73-.7 1.15.11 2.2.53 3.02 1.25-2.61 1.57-2.14 5.48.56 6.64-1.12 2.8-2.31 4.54-2.39 4.98zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                            </svg>
                            Apple
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}