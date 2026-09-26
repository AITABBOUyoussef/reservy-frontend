import { Link } from "react-router-dom";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden overflow-hidden bg-teal-900 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(45,212,191,0.4),_transparent_42%),linear-gradient(145deg,#134e4a,#0f172a)]" />
          <div className="relative">
            <Link to="/" className="text-2xl font-black tracking-tight text-white">Reservy</Link>
            <p className="mt-2 max-w-xs text-sm leading-6 text-teal-100">
              Une expérience simple pour découvrir, réserver et profiter de vos établissements préférés.
            </p>
          </div>
          <div className="relative rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-md">
            <span className="material-symbols-outlined text-4xl text-teal-200">restaurant</span>
            <p className="mt-4 text-lg font-bold">Votre prochaine bonne adresse est à quelques clics.</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-5 sm:p-10">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-8 inline-flex text-sm font-bold text-slate-400 transition hover:text-teal-700 lg:hidden">
              ← Retour à l'accueil
            </Link>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-600">Reservy</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
