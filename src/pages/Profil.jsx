import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

export default function Profil() {

    const [name , setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [logoutDevices, setLogoutDevices] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // const navigate = useNavigate();

    const handleAvatarChange = (e)=>{
        const file = e.target.files[0];
        if(file){
            setAvatar(file);
            setPreviewAvatar(URL.createObjectURL(file))
        }
    }
const editProfil = async (e) =>{
    e.preventDefault();
    setErrorMessage('');
    try{
        const formData = new FormData();
        formData.append('name', name);
            formData.append('email', email);
            if (phone) formData.append('phone', phone);
            if (avatar) formData.append('avatar', avatar);
            if (oldPassword) formData.append('old_password', oldPassword);
            if (password) formData.append('password', password);
            if (passwordConfirmation) formData.append('password_confirmation', passwordConfirmation);
            if (logoutDevices) formData.append('logout_other_devices', logoutDevices ? '1' : '0');
        const response = await axiosInstance.post('/editProfil', formData , {
            headers : {'Content-Type': 'multipart/form-data',}

            
        });
            
            const user = response.data.user;

            localStorage.setItem('user', JSON.stringify(user));
            alert("Profil mis à jour avec succès !");
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
                <p className="text-white/90 text-lg">Gérez vos informations personnelles en toute simplicité.</p>
            </div>
        </div>

        {/* L'Jiha d Limen (Formulaire Profil) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-8 sm:p-10 my-8">
                
                {/* Header d Profil */}
                <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Modifier mon profil</h2>
                    <p className="text-xs text-gray-500 mt-1">Mettez à jour vos informations de compte et votre mot de passe</p>
                </div>

                {/* Message d'erreur */}
                {errorMessage && (
                    <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center break-words">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={editProfil} className="space-y-4">
                    {/* Avatar Upload Preview */}
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border border-emerald-300 shrink-0">
                                {previewAvatar ? (
                                    <img src={previewAvatar} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-emerald-700 font-bold text-lg">
                                        {name ? name.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-700 mb-1">Photo de profil</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#b04121] file:text-white hover:file:bg-[#8e341a] cursor-pointer"
                                />
                            </div>
                        </div>
                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nom complet</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Votre nom"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none text-sm transition-all"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Adresse e-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="nom@exemple.com"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none text-sm transition-all"
                        />
                    </div>

                    {/* Phone & Avatar (Grid 2 cols) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Téléphone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="06 12 34 56 78"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none text-sm transition-all"
                            />
                        </div>
                     
                    </div>

                    {/* Section Mot de passe */}
                    <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Sécurité du compte</p>
                        
                        {/* Old Password */}
                        <div className="mb-3">
                            <label className="block text-xs font-bold text-gray-700 mb-1">Ancien mot de passe</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none text-sm tracking-widest transition-all"
                            />
                        </div>

                        {/* New Password & Confirmation */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none text-sm tracking-widest transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Confirmer nouveau</label>
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#b04121] focus:border-[#b04121] outline-none text-sm tracking-widest transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Checkbox Logout other devices */}
                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="logout_devices"
                            checked={Boolean(logoutDevices)}
                            onChange={(e) => setLogoutDevices(e.target.checked)}
                            className="w-4 h-4 text-[#b04121] border-gray-300 rounded focus:ring-[#b04121]"
                        />
                        <label htmlFor="logout_devices" className="text-xs font-medium text-gray-600 select-none">
                            Déconnecter les autres appareils
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#b04121] hover:bg-[#8e341a] text-white font-bold py-3.5 rounded-lg transition-colors text-sm shadow-sm"
                        >
                            Enregistrer les modifications
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
);
}