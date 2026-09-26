import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const formatPrice = (price) =>
  `${Number(price || 0).toFixed(2).replace(".", ",")} DH`;

function EmptyReservations() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
        <span className="material-symbols-outlined text-4xl">event_busy</span>
      </div>
      <h2 className="text-xl font-black text-gray-900">
        Aucune réservation pour le moment
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        Vos réservations et commandes apparaîtront ici dès que vous aurez
        réservé une table ou commandé un plat.
      </p>
    </div>
  );
}

function ReservationCard({ commande }) {
  const isDineIn = commande.type_commande === "sur_place";
  const articles = Array.isArray(commande.articles) ? commande.articles : [];

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              isDineIn
                ? "bg-teal-50 text-teal-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {isDineIn ? "table_restaurant" : "shopping_bag"}
            </span>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-gray-400">
              {isDineIn ? "Réservation sur place" : "Commande à emporter"}
            </p>
            <h2 className="mt-1 text-lg font-black text-gray-900">
              {isDineIn
                ? `Table ${commande.table_id ?? "—"}`
                : "Commande à emporter"}
            </h2>
            {isDineIn && (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-500">
                <span className="material-symbols-outlined text-base">
                  group
                </span>
                {commande.nombre_personnes ?? 0} personne
                {commande.nombre_personnes === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </div>
        <span className="w-fit rounded-full bg-teal-50 px-3 py-1.5 text-xs font-black text-teal-700">
          Confirmée
        </span>
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-400">
          <span>Articles</span>
          <span>{articles.length} article{articles.length === 1 ? "" : "s"}</span>
        </div>

        <div className="divide-y divide-gray-100 rounded-2xl bg-gray-50 px-4">
          {articles.map((article) => (
            <div
              key={article.id_ligne}
              className="flex items-start justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-800">
                  <span className="mr-2 text-teal-700">
                    {article.quantite}×
                  </span>
                  {article.nom}
                </p>
                {article.instructions_speciales && (
                  <p className="mt-1 text-xs font-medium text-gray-500">
                    Note : {article.instructions_speciales}
                  </p>
                )}
              </div>
              <span className="shrink-0 text-sm font-bold text-gray-700">
                {formatPrice(article.prix_total)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-bold text-gray-500">Total</span>
          <span className="text-lg font-black text-gray-900">
            {formatPrice(commande.total_commande)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function MesReservations() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await axiosInstance.get("/Mescommandes");
        setCommandes(
          Array.isArray(response.data?.MesCommande)
            ? response.data.MesCommande
            : []
        );
      } catch (error) {
        console.error("Erreur de récupération des réservations :", error);
        setErrorMessage(
          error.response?.data?.message ||
            "Impossible de charger vos réservations. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-20 font-sans text-gray-900 antialiased">
      <section className="border-b border-gray-100 bg-white px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-teal-600">
            Votre espace
          </p>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Mes réservations
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Retrouvez toutes vos réservations et commandes en un seul
                endroit.
              </p>
            </div>
            {!loading && !errorMessage && commandes.length > 0 && (
              <div className="flex w-fit items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600">
                <span className="material-symbols-outlined text-lg text-teal-700">
                  receipt_long
                </span>
                {commandes.length} réservation{commandes.length === 1 ? "" : "s"}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {loading && (
          <div className="flex min-h-64 items-center justify-center rounded-3xl bg-white">
            <span className="material-symbols-outlined animate-spin text-4xl text-teal-600">
              autorenew
            </span>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-center text-sm font-bold text-red-600">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && commandes.length === 0 && (
          <EmptyReservations />
        )}

        {!loading && !errorMessage && commandes.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {commandes.map((commande) => (
              <ReservationCard
                key={commande.id_commande}
                commande={commande}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
