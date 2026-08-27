import { Suspense } from "react";
import RegistracijaClient from "./RegistracijaClient";

export default function RegistracijaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-100 px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl bg-white p-8 shadow">
              Kraunama kandidato anketa...
            </div>
          </div>
        </main>
      }
    >
      <RegistracijaClient />
    </Suspense>
  );
}