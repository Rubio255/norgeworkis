import { Suspense } from "react";
import RegistracijaClient from "./RegistracijaClient";

export default function RegistracijaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[20px] glass p-8 shadow-card">
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