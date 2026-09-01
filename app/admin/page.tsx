"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as XLSX from "xlsx";

import { createClient } from "../../utils/supabase/client";

type Kandidatas = {
  id: number;
  created_at: string;
  vardas: string;
  pavarde: string;
  telefonas: string;
  email: string;
  profesija: string;
  patirtis: string;
  norvegu_kalba: string | null;
  anglu_kalba: string | null;
  apie: string | null;
  cv_path: string | null;
  statusas: string | null;
  admin_pastabos: string | null;
  darbas_id: number | null;
  issiusta_darbdaviui_at: string | null;

  darbai: {
    pavadinimas: string;
    miestas: string;
    atlyginimas: string | null;
    darbdavio_email: string | null;
  } | null;
};

type Darbas = {
  id: number;
  created_at: string;
  pavadinimas: string;
  miestas: string;
  atlyginimas: string | null;
  aprasymas: string | null;
  darbdavio_email: string | null;
  aktyvus: boolean;

  grafikas: string | null;
  rotacija: string | null;
  apgyvendinimas: string | null;
  kelione: string | null;
  patirtis_reikalavimas: string | null;
  kalba_reikalavimas: string | null;
  vairuotojo_pazymejimas: string | null;
  darbo_pradzia: string | null;

  video_url: string | null;
};

type Filtras =
  | "Nauji"
  | "Išsiųsti"
  | "Pokalbis"
  | "Įdarbinti"
  | "Atmesti"
  | "Visi";

const ADMIN_EMAIL = "info@optinvest.lt";

const MAX_VIDEO_SIZE = 10 * 1024 * 1024;

export default function AdminPage() {
  const [supabase] = useState(() => createClient());

  const [userEmail, setUserEmail] =
    useState<string | null>(null);

  const [loginEmail, setLoginEmail] =
    useState(ADMIN_EMAIL);

  const [loginPassword, setLoginPassword] =
    useState("");

  const [loginLoading, setLoginLoading] =
    useState(false);

  const [loginError, setLoginError] =
    useState("");

  const [kandidatai, setKandidatai] =
    useState<Kandidatas[]>([]);

  const [darbai, setDarbai] =
    useState<Darbas[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [filtras, setFiltras] =
    useState<Filtras>("Nauji");

  const [paieska, setPaieska] =
    useState("");

  const [
    pazymetiKandidatai,
    setPazymetiKandidatai,
  ] = useState<Set<number>>(new Set());

  const [
    pasirinktasDarbdavioEmail,
    setPasirinktasDarbdavioEmail,
  ] = useState("");

  const [sending, setSending] =
    useState(false);

  const [
    naujasPavadinimas,
    setNaujasPavadinimas,
  ] = useState("");

  const [
    naujasMiestas,
    setNaujasMiestas,
  ] = useState("");

  const [
    naujasAtlyginimas,
    setNaujasAtlyginimas,
  ] = useState("");

  const [
    naujasAprasymas,
    setNaujasAprasymas,
  ] = useState("");

  const [
    naujasDarbdavioEmail,
    setNaujasDarbdavioEmail,
  ] = useState("");

  const [
    naujasGrafikas,
    setNaujasGrafikas,
  ] = useState("");

  const [
    naujaRotacija,
    setNaujaRotacija,
  ] = useState("");

  const [
    naujasApgyvendinimas,
    setNaujasApgyvendinimas,
  ] = useState("");

  const [
    naujaKelione,
    setNaujaKelione,
  ] = useState("");

  const [
    naujaPatirtisReikalavimas,
    setNaujaPatirtisReikalavimas,
  ] = useState("");

  const [
    naujaKalbaReikalavimas,
    setNaujaKalbaReikalavimas,
  ] = useState("");

  const [
    naujasVairuotojoPazymejimas,
    setNaujasVairuotojoPazymejimas,
  ] = useState("");

  const [
    naujaDarboPradzia,
    setNaujaDarboPradzia,
  ] = useState("");

  const [jobLoading, setJobLoading] =
    useState(false);

  const [
    changingJobId,
    setChangingJobId,
  ] = useState<number | null>(null);

  const [
    savingJobEmailId,
    setSavingJobEmailId,
  ] = useState<number | null>(null);

  const [
    uploadingVideoJobId,
    setUploadingVideoJobId,
  ] = useState<number | null>(null);

  const [
    removingVideoJobId,
    setRemovingVideoJobId,
  ] = useState<number | null>(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email === ADMIN_EMAIL) {
        setUserEmail(user.email);
      }

      setLoading(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (
          session?.user?.email === ADMIN_EMAIL
        ) {
          setUserEmail(session.user.email);
        } else {
          setUserEmail(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (userEmail === ADMIN_EMAIL) {
      loadCandidates();
      loadJobs();
    }
  }, [userEmail]);

  async function handleLogin(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoginError("");
    setLoginLoading(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

    if (error) {
      setLoginError(error.message);
      setLoginLoading(false);
      return;
    }

    if (
      data.user?.email !== ADMIN_EMAIL
    ) {
      await supabase.auth.signOut();

      setLoginError(
        "Šiai paskyrai administratoriaus prieiga nesuteikta."
      );

      setLoginLoading(false);
      return;
    }

    setUserEmail(data.user.email);
    setLoginPassword("");
    setLoginLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setUserEmail(null);
    setKandidatai([]);
    setDarbai([]);
    setPazymetiKandidatai(
      new Set()
    );
  }

  async function loadCandidates() {
    setErrorMessage("");

    const { data, error } =
      await supabase
        .from("kandidatai")
        .select(`
          id,
          created_at,
          vardas,
          pavarde,
          telefonas,
          email,
          profesija,
          patirtis,
          norvegu_kalba,
          anglu_kalba,
          apie,
          cv_path,
          statusas,
          admin_pastabos,
          darbas_id,
          issiusta_darbdaviui_at,
          darbai (
            pavadinimas,
            miestas,
            atlyginimas,
            darbdavio_email
          )
        `)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      setErrorMessage(
        `Nepavyko gauti kandidatų: ${error.message}`
      );
      return;
    }

    setKandidatai(
      (data || []) as unknown as Kandidatas[]
    );

    setPazymetiKandidatai(
      new Set()
    );
  }

  async function loadJobs() {
    const { data, error } =
      await supabase
        .from("darbai")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      alert(
        `Nepavyko gauti darbų: ${error.message}`
      );
      return;
    }

    setDarbai(
      (data || []) as Darbas[]
    );
  }

  async function updateCandidateStatus(
    id: number,
    statusas: string
  ) {
    const updateData: {
      statusas: string;
      issiusta_darbdaviui_at?:
        | string
        | null;
    } = {
      statusas,
    };

    if (
      statusas ===
      "Išsiųstas darbdaviui"
    ) {
      updateData.issiusta_darbdaviui_at =
        new Date().toISOString();
    }

    if (statusas === "Naujas") {
      updateData.issiusta_darbdaviui_at =
        null;
    }

    const { error } =
      await supabase
        .from("kandidatai")
        .update(updateData)
        .eq("id", id);

    if (error) {
      alert(
        `Nepavyko atnaujinti būsenos: ${error.message}`
      );
      return;
    }

    await loadCandidates();
  }

  async function updateNotes(
    id: number,
    adminPastabos: string
  ) {
    const { error } =
      await supabase
        .from("kandidatai")
        .update({
          admin_pastabos:
            adminPastabos,
        })
        .eq("id", id);

    if (error) {
      alert(
        `Nepavyko išsaugoti pastabų: ${error.message}`
      );
    }
  }

  async function openCv(
    cvPath: string | null
  ) {
    if (!cvPath) {
      alert("CV nepridėtas.");
      return;
    }

    const { data, error } =
      await supabase.storage
        .from("cv")
        .createSignedUrl(
          cvPath,
          300
        );

    if (
      error ||
      !data?.signedUrl
    ) {
      alert(
        `Nepavyko atidaryti CV: ${
          error?.message ||
          "Nežinoma klaida"
        }`
      );
      return;
    }

    window.open(
      data.signedUrl,
      "_blank"
    );
  }

  function toggleCandidate(
    id: number
  ) {
    setPazymetiKandidatai(
      (current) => {
        const next =
          new Set(current);

        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      }
    );
  }

  async function deleteCandidates(
    ids: number[]
  ) {
    if (ids.length === 0) {
      return;
    }

    const confirmed =
      window.confirm(
        ids.length === 1
          ? "Ar tikrai norite ištrinti šią kandidato anketą?"
          : `Ar tikrai norite ištrinti ${ids.length} pažymėtas kandidatų anketas?`
      );

    if (!confirmed) {
      return;
    }

    const candidatesToDelete =
      kandidatai.filter(
        (kandidatas) =>
          ids.includes(
            kandidatas.id
          )
      );

    const { error } =
      await supabase
        .from("kandidatai")
        .delete()
        .in("id", ids);

    if (error) {
      alert(
        `Nepavyko ištrinti kandidatų: ${error.message}`
      );
      return;
    }

    const cvPaths =
      candidatesToDelete
        .map(
          (kandidatas) =>
            kandidatas.cv_path
        )
        .filter(
          (
            path
          ): path is string =>
            Boolean(path)
        );

    if (
      cvPaths.length > 0
    ) {
      const {
        error: storageError,
      } =
        await supabase.storage
          .from("cv")
          .remove(cvPaths);

      if (storageError) {
        console.warn(
          "Anketos ištrintos, bet nepavyko pašalinti kai kurių CV failų.",
          storageError
        );
      }
    }

    setPazymetiKandidatai(
      new Set()
    );

    await loadCandidates();
  }

  function downloadSelectedExcel() {
    const ids = Array.from(
      pazymetiKandidatai
    );

    if (ids.length === 0) {
      alert(
        "Pirmiausia pažymėkite bent vieną kandidatą."
      );
      return;
    }

    const selectedCandidates =
      kandidatai.filter(
        (kandidatas) =>
          ids.includes(
            kandidatas.id
          )
      );

    const excelData =
      selectedCandidates.map(
        (kandidatas, index) => ({
          "Nr.": index + 1,

          Vardas:
            kandidatas.vardas ||
            "",

          Pavardė:
            kandidatas.pavarde ||
            "",

          Telefonas:
            kandidatas.telefonas ||
            "",

          "El. paštas":
            kandidatas.email ||
            "",

          Profesija:
            kandidatas.profesija ||
            "",

          Patirtis:
            kandidatas.patirtis ||
            "",

          "Norvegų kalba":
            kandidatas.norvegu_kalba ||
            "",

          "Anglų kalba":
            kandidatas.anglu_kalba ||
            "",

          Darbas:
            kandidatas.darbai
              ?.pavadinimas ||
            "",

          Miestas:
            kandidatas.darbai
              ?.miestas ||
            "",

          Atlyginimas:
            kandidatas.darbai
              ?.atlyginimas ||
            "",

          "Apie kandidatą":
            kandidatas.apie ||
            "",

          Statusas:
            kandidatas.statusas ||
            "Naujas",

          "Admin pastabos":
            kandidatas.admin_pastabos ||
            "",
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 18 },
      { wch: 18 },
      { wch: 50 },
      { wch: 24 },
      { wch: 40 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Kandidatai"
    );

    const today =
      new Date();

    const dateText =
      today.getFullYear() +
      "-" +
      String(
        today.getMonth() + 1
      ).padStart(2, "0") +
      "-" +
      String(
        today.getDate()
      ).padStart(2, "0");

    XLSX.writeFile(
      workbook,
      `norgeworkis-kandidatai-${dateText}.xlsx`
    );
  }

  async function sendSelectedToEmployer() {
    const ids = Array.from(
      pazymetiKandidatai
    );

    if (ids.length === 0) {
      alert(
        "Pirmiausia pažymėkite bent vieną kandidatą."
      );
      return;
    }

    if (
      !pasirinktasDarbdavioEmail
    ) {
      alert(
        "Pasirinkite darbdavį."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Ar tikrai siųsti ${ids.length} pažymėtų kandidatų Excel failą adresu ${pasirinktasDarbdavioEmail}?`
      );

    if (!confirmed) {
      return;
    }

    setSending(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (
        sessionError ||
        !session?.access_token
      ) {
        throw new Error(
          "Administratoriaus sesija nebegalioja. Prisijunkite iš naujo."
        );
      }

      const response =
        await fetch(
          "/api/siusti-darbdaviui",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${session.access_token}`,
            },

            body: JSON.stringify({
              kandidatIds: ids,

              darbdavioEmail:
                pasirinktasDarbdavioEmail,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          await supabase.auth.signOut();

          setUserEmail(null);
        }

        throw new Error(
          result.error ||
            "Nepavyko išsiųsti kandidatų."
        );
      }

      alert(
        result.message ||
          "Kandidatų sąrašas sėkmingai išsiųstas darbdaviui."
      );

      setPazymetiKandidatai(
        new Set()
      );

      await loadCandidates();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Nepavyko išsiųsti kandidatų."
      );
    } finally {
      setSending(false);
    }
  }

  async function addJob(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setJobLoading(true);

    const { error } =
      await supabase
        .from("darbai")
        .insert({
          pavadinimas:
            naujasPavadinimas.trim(),

          miestas:
            naujasMiestas.trim(),

          atlyginimas:
            naujasAtlyginimas.trim() ||
            null,

          aprasymas:
            naujasAprasymas.trim() ||
            null,

          darbdavio_email:
            naujasDarbdavioEmail.trim() ||
            null,

          grafikas:
            naujasGrafikas.trim() ||
            null,

          rotacija:
            naujaRotacija.trim() ||
            null,

          apgyvendinimas:
            naujasApgyvendinimas.trim() ||
            null,

          kelione:
            naujaKelione.trim() ||
            null,

          patirtis_reikalavimas:
            naujaPatirtisReikalavimas.trim() ||
            null,

          kalba_reikalavimas:
            naujaKalbaReikalavimas.trim() ||
            null,

          vairuotojo_pazymejimas:
            naujasVairuotojoPazymejimas.trim() ||
            null,

          darbo_pradzia:
            naujaDarboPradzia.trim() ||
            null,

          video_url: null,

          aktyvus: true,
        });

    if (error) {
      alert(
        `Nepavyko sukurti darbo pasiūlymo: ${error.message}`
      );

      setJobLoading(false);
      return;
    }

    setNaujasPavadinimas("");
    setNaujasMiestas("");
    setNaujasAtlyginimas("");
    setNaujasAprasymas("");
    setNaujasDarbdavioEmail("");
    setNaujasGrafikas("");
    setNaujaRotacija("");
    setNaujasApgyvendinimas("");
    setNaujaKelione("");
    setNaujaPatirtisReikalavimas("");
    setNaujaKalbaReikalavimas("");
    setNaujasVairuotojoPazymejimas("");
    setNaujaDarboPradzia("");

    await loadJobs();

    setJobLoading(false);
  }

  async function updateJob(
    id: number,

    field: keyof Pick<
      Darbas,
      | "pavadinimas"
      | "miestas"
      | "atlyginimas"
      | "aprasymas"
      | "darbdavio_email"
      | "aktyvus"
      | "grafikas"
      | "rotacija"
      | "apgyvendinimas"
      | "kelione"
      | "patirtis_reikalavimas"
      | "kalba_reikalavimas"
      | "vairuotojo_pazymejimas"
      | "darbo_pradzia"
      | "video_url"
    >,

    value:
      | string
      | boolean
      | null
  ) {
    const { error } =
      await supabase
        .from("darbai")
        .update({
          [field]: value,
        })
        .eq("id", id);

    if (error) {
      alert(
        `Nepavyko atnaujinti darbo: ${error.message}`
      );

      await loadJobs();

      return false;
    }

    await loadJobs();

    return true;
  }

  async function saveEmployerEmail(
    darbasId: number
  ) {
    const input =
      document.getElementById(
        `darbdavio-email-${darbasId}`
      ) as HTMLInputElement | null;

    if (!input) {
      return;
    }

    const email =
      input.value.trim();

    if (
      email &&
      !email.includes("@")
    ) {
      alert(
        "Įveskite teisingą el. pašto adresą."
      );
      return;
    }

    setSavingJobEmailId(
      darbasId
    );

    const saved =
      await updateJob(
        darbasId,
        "darbdavio_email",
        email || null
      );

    setSavingJobEmailId(
      null
    );

    if (saved) {
      alert(
        "Darbdavio el. paštas išsaugotas."
      );
    }
  }

  function getVideoStoragePath(
    videoUrl: string | null
  ) {
    if (!videoUrl) {
      return null;
    }

    const marker =
      "/storage/v1/object/public/job-videos/";

    const markerIndex =
      videoUrl.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const path =
      videoUrl.slice(
        markerIndex +
          marker.length
      );

    return decodeURIComponent(
      path
    );
  }

  async function uploadJobVideo(
    darbas: Darbas,
    file: File
  ) {
    if (
      file.type !== "video/mp4"
    ) {
      alert(
        "Galima įkelti tik MP4 formato video."
      );
      return;
    }

    if (
      file.size >
      MAX_VIDEO_SIZE
    ) {
      alert(
        "Video failas per didelis. Maksimalus dydis – 10 MB."
      );
      return;
    }

    setUploadingVideoJobId(
      darbas.id
    );

    try {
      const safeName =
        file.name
          .toLowerCase()
          .replace(
            /[^a-z0-9._-]/g,
            "-"
          );

      const filePath =
        `${darbas.id}/${Date.now()}-${safeName}`;

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from("job-videos")
          .upload(
            filePath,
            file,
            {
              contentType:
                "video/mp4",

              cacheControl:
                "3600",

              upsert: false,
            }
          );

      if (uploadError) {
        throw new Error(
          `Nepavyko įkelti video: ${uploadError.message}`
        );
      }

      const { data } =
        supabase.storage
          .from("job-videos")
          .getPublicUrl(
            filePath
          );

      const publicUrl =
        data.publicUrl;

      const { error: dbError } =
        await supabase
          .from("darbai")
          .update({
            video_url:
              publicUrl,
          })
          .eq(
            "id",
            darbas.id
          );

      if (dbError) {
        await supabase.storage
          .from("job-videos")
          .remove([
            filePath,
          ]);

        throw new Error(
          `Video įkeltas, tačiau nepavyko jo priskirti darbo pasiūlymui: ${dbError.message}`
        );
      }

      const oldVideoPath =
        getVideoStoragePath(
          darbas.video_url
        );

      if (oldVideoPath) {
        const {
          error:
            oldDeleteError,
        } =
          await supabase.storage
            .from("job-videos")
            .remove([
              oldVideoPath,
            ]);

        if (
          oldDeleteError
        ) {
          console.warn(
            "Naujas video įkeltas, tačiau seno failo pašalinti nepavyko.",
            oldDeleteError
          );
        }
      }

      await loadJobs();

      alert(
        "Video sėkmingai įkeltas."
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Nepavyko įkelti video."
      );
    } finally {
      setUploadingVideoJobId(
        null
      );
    }
  }

  async function removeJobVideo(
    darbas: Darbas
  ) {
    if (!darbas.video_url) {
      return;
    }

    const confirmed =
      window.confirm(
        "Ar tikrai norite pašalinti šio darbo video?"
      );

    if (!confirmed) {
      return;
    }

    setRemovingVideoJobId(
      darbas.id
    );

    try {
      const path =
        getVideoStoragePath(
          darbas.video_url
        );

      const { error: dbError } =
        await supabase
          .from("darbai")
          .update({
            video_url: null,
          })
          .eq(
            "id",
            darbas.id
          );

      if (dbError) {
        throw new Error(
          `Nepavyko pašalinti video iš darbo pasiūlymo: ${dbError.message}`
        );
      }

      if (path) {
        const {
          error: removeError,
        } =
          await supabase.storage
            .from("job-videos")
            .remove([path]);

        if (removeError) {
          console.warn(
            "Video URL pašalintas, tačiau failo iš Storage pašalinti nepavyko.",
            removeError
          );
        }
      }

      await loadJobs();

      alert(
        "Video pašalintas."
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Nepavyko pašalinti video."
      );
    } finally {
      setRemovingVideoJobId(
        null
      );
    }
  }

  async function toggleJobActive(
    darbas: Darbas
  ) {
    setChangingJobId(
      darbas.id
    );

    await updateJob(
      darbas.id,
      "aktyvus",
      !darbas.aktyvus
    );

    setChangingJobId(null);
  }

  async function deleteJob(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "Ar tikrai norite ištrinti šį darbo pasiūlymą?"
      );

    if (!confirmed) {
      return;
    }

    const darbas =
      darbai.find(
        (item) =>
          item.id === id
      );

    const { error } =
      await supabase
        .from("darbai")
        .delete()
        .eq("id", id);

    if (error) {
      alert(
        `Nepavyko ištrinti darbo: ${error.message}`
      );
      return;
    }

    if (
      darbas?.video_url
    ) {
      const videoPath =
        getVideoStoragePath(
          darbas.video_url
        );

      if (videoPath) {
        const {
          error:
            videoDeleteError,
        } =
          await supabase.storage
            .from("job-videos")
            .remove([
              videoPath,
            ]);

        if (
          videoDeleteError
        ) {
          console.warn(
            "Darbas ištrintas, tačiau video failo pašalinti nepavyko.",
            videoDeleteError
          );
        }
      }
    }

    await loadJobs();
  }

  const filteredCandidates =
    useMemo(() => {
      let result =
        kandidatai;

      if (
        filtras === "Nauji"
      ) {
        result =
          result.filter(
            (k) =>
              !k.statusas ||
              k.statusas ===
                "Naujas"
          );
      }

      if (
        filtras ===
        "Išsiųsti"
      ) {
        result =
          result.filter(
            (k) =>
              k.statusas ===
              "Išsiųstas darbdaviui"
          );
      }

      if (
        filtras ===
        "Pokalbis"
      ) {
        result =
          result.filter(
            (k) =>
              k.statusas ===
              "Pokalbis"
          );
      }

      if (
        filtras ===
        "Įdarbinti"
      ) {
        result =
          result.filter(
            (k) =>
              k.statusas ===
              "Įdarbintas"
          );
      }

      if (
        filtras ===
        "Atmesti"
      ) {
        result =
          result.filter(
            (k) =>
              k.statusas ===
              "Atmestas"
          );
      }

      const search =
        paieska
          .trim()
          .toLowerCase();

      if (search) {
        result =
          result.filter(
            (k) => {
              const text = [
                k.vardas,
                k.pavarde,
                k.email,
                k.telefonas,
                k.profesija,
                k.darbai
                  ?.pavadinimas ||
                  "",
                k.darbai
                  ?.miestas ||
                  "",
                k.darbai
                  ?.darbdavio_email ||
                  "",
              ]
                .join(" ")
                .toLowerCase();

              return text.includes(
                search
              );
            }
          );
      }

      return result;
    }, [
      kandidatai,
      filtras,
      paieska,
    ]);

  const darbdaviai =
    useMemo(() => {
      const map =
        new Map<
          string,
          {
            email: string;
            label: string;
          }
        >();

      darbai.forEach(
        (darbas) => {
          const email =
            darbas.darbdavio_email?.trim();

          if (!email) {
            return;
          }

          if (
            !map.has(email)
          ) {
            map.set(
              email,
              {
                email,

                label:
                  `${darbas.pavadinimas} – ${email}`,
              }
            );
          }
        }
      );

      return Array.from(
        map.values()
      );
    }, [darbai]);

  const allVisibleSelected =
    filteredCandidates.length >
      0 &&
    filteredCandidates.every(
      (kandidatas) =>
        pazymetiKandidatai.has(
          kandidatas.id
        )
    );

  function toggleAllVisible() {
    setPazymetiKandidatai(
      (current) => {
        const next =
          new Set(current);

        if (
          allVisibleSelected
        ) {
          filteredCandidates.forEach(
            (kandidatas) =>
              next.delete(
                kandidatas.id
              )
          );
        } else {
          filteredCandidates.forEach(
            (kandidatas) =>
              next.add(
                kandidatas.id
              )
          );
        }

        return next;
      }
    );
  }

  const newCount =
    kandidatai.filter(
      (k) =>
        !k.statusas ||
        k.statusas ===
          "Naujas"
    ).length;

  const sentCount =
    kandidatai.filter(
      (k) =>
        k.statusas ===
        "Išsiųstas darbdaviui"
    ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="mx-auto max-w-7xl">
          Kraunama...
        </div>
      </main>
    );
  }

  if (
    userEmail !== ADMIN_EMAIL
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-slate-900">
            Norgeworkis administravimas
          </h1>

          <form
            onSubmit={
              handleLogin
            }
            className="mt-8 space-y-5"
          >
            <input
              type="email"
              required
              value={
                loginEmail
              }
              onChange={(e) =>
                setLoginEmail(
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="password"
              required
              value={
                loginPassword
              }
              onChange={(e) =>
                setLoginPassword(
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            {loginError && (
              <div className="rounded-lg bg-red-50 p-4 text-red-700">
                {
                  loginError
                }
              </div>
            )}

            <button
              type="submit"
              disabled={
                loginLoading
              }
              className="w-full rounded-lg bg-slate-900 px-5 py-3 font-bold text-white disabled:opacity-40"
            >
              {loginLoading
                ? "Jungiama..."
                : "Prisijungti"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 px-6 py-5 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Norgeworkis administravimas
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              {userEmail}
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="rounded-lg border border-slate-700 px-4 py-2 font-semibold"
          >
            Atsijungti
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-slate-600">
              Naujos anketos
            </div>

            <div className="mt-2 text-4xl font-bold">
              {newCount}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-slate-600">
              Išsiųstos
            </div>

            <div className="mt-2 text-4xl font-bold">
              {sentCount}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-slate-600">
              Visos anketos
            </div>

            <div className="mt-2 text-4xl font-bold">
              {
                kandidatai.length
              }
            </div>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-3xl font-bold">
            Kandidatų anketos
          </h2>

          <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "Nauji",
                  "Išsiųsti",
                  "Pokalbis",
                  "Įdarbinti",
                  "Atmesti",
                  "Visi",
                ] as Filtras[]
              ).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    setFiltras(
                      item
                    )
                  }
                  className={`rounded-lg px-4 py-2 font-semibold ${
                    filtras === item
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              value={paieska}
              onChange={(e) =>
                setPaieska(
                  e.target.value
                )
              }
              placeholder="Ieškoti kandidato..."
              className="mt-5 w-full rounded-lg border px-4 py-3"
            />

            <div className="mt-5 border-t pt-5">
              <label className="flex items-center gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={
                    allVisibleSelected
                  }
                  onChange={
                    toggleAllVisible
                  }
                  className="h-5 w-5"
                />

                Pažymėti visus rodomus
              </label>

              <p className="mt-3 font-semibold">
                Pažymėta:{" "}
                {
                  pazymetiKandidatai.size
                }
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <select
                  value={
                    pasirinktasDarbdavioEmail
                  }
                  onChange={(e) =>
                    setPasirinktasDarbdavioEmail(
                      e.target.value
                    )
                  }
                  className="min-w-72 rounded-lg border px-4 py-3"
                >
                  <option value="">
                    Pasirinkite darbdavį
                  </option>

                  {darbdaviai.map(
                    (
                      darbdavys
                    ) => (
                      <option
                        key={
                          darbdavys.email
                        }
                        value={
                          darbdavys.email
                        }
                      >
                        {
                          darbdavys.label
                        }
                      </option>
                    )
                  )}
                </select>

                <button
                  type="button"
                  disabled={
                    sending ||
                    pazymetiKandidatai.size ===
                      0 ||
                    !pasirinktasDarbdavioEmail
                  }
                  onClick={
                    sendSelectedToEmployer
                  }
                  className="rounded-lg bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending
                    ? "Siunčiama..."
                    : "Siųsti darbdaviui"}
                </button>

                <button
                  type="button"
                  disabled={
                    pazymetiKandidatai.size ===
                    0
                  }
                  onClick={
                    downloadSelectedExcel
                  }
                  className="rounded-lg bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Atsisiųsti Excel
                </button>

                <button
                  type="button"
                  disabled={
                    pazymetiKandidatai.size ===
                    0
                  }
                  onClick={() =>
                    deleteCandidates(
                      Array.from(
                        pazymetiKandidatai
                      )
                    )
                  }
                  className="rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Ištrinti pažymėtas
                </button>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">
              {
                errorMessage
              }
            </div>
          )}

          <div className="mt-6 space-y-5">
            {filteredCandidates.map(
              (
                kandidatas
              ) => (
                <article
                  key={
                    kandidatas.id
                  }
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="flex gap-4">
                      <input
                        type="checkbox"
                        checked={pazymetiKandidatai.has(
                          kandidatas.id
                        )}
                        onChange={() =>
                          toggleCandidate(
                            kandidatas.id
                          )
                        }
                        className="mt-2 h-5 w-5"
                      />

                      <div>
                        <h3 className="text-xl font-bold">
                          {
                            kandidatas.vardas
                          }{" "}
                          {
                            kandidatas.pavarde
                          }
                        </h3>

                        <p className="mt-1 text-slate-600">
                          {
                            kandidatas.profesija
                          }
                        </p>
                      </div>
                    </div>

                    <select
                      value={
                        kandidatas.statusas ||
                        "Naujas"
                      }
                      onChange={(e) =>
                        updateCandidateStatus(
                          kandidatas.id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border px-4 py-3"
                    >
                      <option value="Naujas">
                        Naujas
                      </option>

                      <option value="Išsiųstas darbdaviui">
                        Išsiųstas darbdaviui
                      </option>

                      <option value="Pokalbis">
                        Pokalbis
                      </option>

                      <option value="Įdarbintas">
                        Įdarbintas
                      </option>

                      <option value="Atmestas">
                        Atmestas
                      </option>
                    </select>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <strong>
                        Telefonas:
                      </strong>{" "}
                      {
                        kandidatas.telefonas
                      }
                    </div>

                    <div>
                      <strong>
                        El. paštas:
                      </strong>{" "}
                      {
                        kandidatas.email
                      }
                    </div>

                    <div>
                      <strong>
                        Patirtis:
                      </strong>{" "}
                      {
                        kandidatas.patirtis
                      }
                    </div>

                    <div>
                      <strong>
                        Norvegų kalba:
                      </strong>{" "}
                      {kandidatas.norvegu_kalba ||
                        "–"}
                    </div>

                    <div>
                      <strong>
                        Anglų kalba:
                      </strong>{" "}
                      {kandidatas.anglu_kalba ||
                        "–"}
                    </div>

                    <div>
                      <strong>
                        Darbas:
                      </strong>{" "}
                      {kandidatas.darbai
                        ?.pavadinimas ||
                        "–"}
                    </div>
                  </div>

                  {kandidatas.apie && (
                    <div className="mt-5">
                      <strong>
                        Apie kandidatą:
                      </strong>

                      <p className="mt-2 whitespace-pre-wrap text-slate-700">
                        {
                          kandidatas.apie
                        }
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        openCv(
                          kandidatas.cv_path
                        )
                      }
                      disabled={
                        !kandidatas.cv_path
                      }
                      className="rounded-lg border px-4 py-2 disabled:opacity-40"
                    >
                      {kandidatas.cv_path
                        ? "Atidaryti CV"
                        : "CV nepridėtas"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteCandidates(
                          [
                            kandidatas.id,
                          ]
                        )
                      }
                      className="rounded-lg border border-red-300 px-4 py-2 text-red-700 hover:bg-red-50"
                    >
                      Ištrinti anketą
                    </button>
                  </div>

                  <textarea
                    defaultValue={
                      kandidatas.admin_pastabos ||
                      ""
                    }
                    onBlur={(e) =>
                      updateNotes(
                        kandidatas.id,
                        e.target.value
                      )
                    }
                    placeholder="Administratoriaus pastabos"
                    className="mt-5 w-full rounded-lg border px-4 py-3"
                  />
                </article>
              )
            )}

            {filteredCandidates.length ===
              0 && (
              <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
                Kandidatų pagal pasirinktą filtrą nėra.
              </div>
            )}
          </div>
        </section>

        <section className="mt-16 border-t pt-10">
          <h2 className="text-3xl font-bold">
            Darbo pasiūlymų valdymas
          </h2>

          <form
            onSubmit={addJob}
            className="mt-6 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-bold">
              Naujas darbo pasiūlymas
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                required
                value={
                  naujasPavadinimas
                }
                onChange={(e) =>
                  setNaujasPavadinimas(
                    e.target.value
                  )
                }
                placeholder="Pareigos"
                className="rounded-lg border px-4 py-3"
              />

              <input
                required
                value={
                  naujasMiestas
                }
                onChange={(e) =>
                  setNaujasMiestas(
                    e.target.value
                  )
                }
                placeholder="Miestas / regionas"
                className="rounded-lg border px-4 py-3"
              />

              <input
                value={
                  naujasAtlyginimas
                }
                onChange={(e) =>
                  setNaujasAtlyginimas(
                    e.target.value
                  )
                }
                placeholder="Atlyginimas, pvz. 260–290 NOK/val."
                className="rounded-lg border px-4 py-3"
              />

              <input
                value={
                  naujasGrafikas
                }
                onChange={(e) =>
                  setNaujasGrafikas(
                    e.target.value
                  )
                }
                placeholder="Grafikas"
                className="rounded-lg border px-4 py-3"
              />

              <input
                value={
                  naujaRotacija
                }
                onChange={(e) =>
                  setNaujaRotacija(
                    e.target.value
                  )
                }
                placeholder="Rotacija"
                className="rounded-lg border px-4 py-3"
              />

              <input
                value={
                  naujasApgyvendinimas
                }
                onChange={(e) =>
                  setNaujasApgyvendinimas(
                    e.target.value
                  )
                }
                placeholder="Apgyvendinimas"
                className="rounded-lg border px-4 py-3"
              />

              <input
                value={
                  naujaKelione
                }
                onChange={(e) =>
                  setNaujaKelione(
                    e.target.value
                  )
                }
                placeholder="Kelionė"
                className="rounded-lg border px-4 py-3"
              />

              <input
                value={
                  naujaPatirtisReikalavimas
                }
                onChange={(e) =>
                  setNaujaPatirtisReikalavimas(
                    e.target.value
                  )
                }
                placeholder="Reikalaujama patirtis"
                className="rounded-lg border px-4 py-3"
              />

              <input
                value={
                  naujaKalbaReikalavimas
                }
                onChange={(e) =>
                  setNaujaKalbaReikalavimas(
                    e.target.value
                  )
                }
                placeholder="Kalbos reikalavimai"
                className="rounded-lg border px-4 py-3"
              />

              <input
                value={
                  naujasVairuotojoPazymejimas
                }
                onChange={(e) =>
                  setNaujasVairuotojoPazymejimas(
                    e.target.value
                  )
                }
                placeholder="Vairuotojo pažymėjimas"
                className="rounded-lg border px-4 py-3"
              />

              <input
                value={
                  naujaDarboPradzia
                }
                onChange={(e) =>
                  setNaujaDarboPradzia(
                    e.target.value
                  )
                }
                placeholder="Darbo pradžia"
                className="rounded-lg border px-4 py-3"
              />

              <input
                type="email"
                value={
                  naujasDarbdavioEmail
                }
                onChange={(e) =>
                  setNaujasDarbdavioEmail(
                    e.target.value
                  )
                }
                placeholder="Darbdavio el. paštas"
                className="rounded-lg border px-4 py-3"
              />

              <textarea
                value={
                  naujasAprasymas
                }
                onChange={(e) =>
                  setNaujasAprasymas(
                    e.target.value
                  )
                }
                placeholder="Darbo aprašymas"
                className="min-h-32 rounded-lg border px-4 py-3 md:col-span-2"
              />
            </div>

            <button
              type="submit"
              disabled={
                jobLoading
              }
              className="mt-5 rounded-lg bg-slate-900 px-5 py-3 font-bold text-white disabled:opacity-40"
            >
              {jobLoading
                ? "Kuriama..."
                : "Sukurti darbo pasiūlymą"}
            </button>
          </form>

          <div className="mt-6 space-y-5">
            {darbai.map(
              (darbas) => (
                <div
                  key={
                    darbas.id
                  }
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${
                        darbas.aktyvus
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {darbas.aktyvus
                        ? "AKTYVUS"
                        : "NEAKTYVUS"}
                    </span>

                    <button
                      type="button"
                      disabled={
                        changingJobId ===
                        darbas.id
                      }
                      onClick={() =>
                        toggleJobActive(
                          darbas
                        )
                      }
                      className="rounded-lg border px-4 py-2 font-semibold disabled:opacity-40"
                    >
                      {changingJobId ===
                      darbas.id
                        ? "Keičiama..."
                        : darbas.aktyvus
                        ? "Padaryti neaktyvų"
                        : "Padaryti aktyvų"}
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <JobField
                      label="Pareigos"
                      value={
                        darbas.pavadinimas
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "pavadinimas",
                          value
                        )
                      }
                    />

                    <JobField
                      label="Miestas / regionas"
                      value={
                        darbas.miestas
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "miestas",
                          value
                        )
                      }
                    />

                    <JobField
                      label="Atlyginimas"
                      value={
                        darbas.atlyginimas
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "atlyginimas",
                          value ||
                            null
                        )
                      }
                    />

                    <JobField
                      label="Grafikas"
                      value={
                        darbas.grafikas
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "grafikas",
                          value ||
                            null
                        )
                      }
                    />

                    <JobField
                      label="Rotacija"
                      value={
                        darbas.rotacija
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "rotacija",
                          value ||
                            null
                        )
                      }
                    />

                    <JobField
                      label="Apgyvendinimas"
                      value={
                        darbas.apgyvendinimas
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "apgyvendinimas",
                          value ||
                            null
                        )
                      }
                    />

                    <JobField
                      label="Kelionė"
                      value={
                        darbas.kelione
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "kelione",
                          value ||
                            null
                        )
                      }
                    />

                    <JobField
                      label="Reikalaujama patirtis"
                      value={
                        darbas.patirtis_reikalavimas
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "patirtis_reikalavimas",
                          value ||
                            null
                        )
                      }
                    />

                    <JobField
                      label="Kalbos reikalavimai"
                      value={
                        darbas.kalba_reikalavimas
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "kalba_reikalavimas",
                          value ||
                            null
                        )
                      }
                    />

                    <JobField
                      label="Vairuotojo pažymėjimas"
                      value={
                        darbas.vairuotojo_pazymejimas
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "vairuotojo_pazymejimas",
                          value ||
                            null
                        )
                      }
                    />

                    <JobField
                      label="Darbo pradžia"
                      value={
                        darbas.darbo_pradzia
                      }
                      onSave={(value) =>
                        updateJob(
                          darbas.id,
                          "darbo_pradzia",
                          value ||
                            null
                        )
                      }
                    />

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-600">
                        Darbdavio el. paštas
                      </label>

                      <div className="flex gap-2">
                        <input
                          id={`darbdavio-email-${darbas.id}`}
                          type="email"
                          defaultValue={
                            darbas.darbdavio_email ||
                            ""
                          }
                          placeholder="darbdavys@imone.no"
                          className="min-w-0 flex-1 rounded-lg border px-4 py-3"
                        />

                        <button
                          type="button"
                          disabled={
                            savingJobEmailId ===
                            darbas.id
                          }
                          onClick={() =>
                            saveEmployerEmail(
                              darbas.id
                            )
                          }
                          className="rounded-lg bg-green-700 px-4 py-3 font-bold text-white hover:bg-green-800 disabled:opacity-40"
                        >
                          {savingJobEmailId ===
                          darbas.id
                            ? "Saugoma..."
                            : "Išsaugoti"}
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-semibold text-slate-600">
                        Aprašymas
                      </label>

                      <textarea
                        defaultValue={
                          darbas.aprasymas ||
                          ""
                        }
                        onBlur={(e) =>
                          updateJob(
                            darbas.id,
                            "aprasymas",
                            e.target
                              .value ||
                              null
                          )
                        }
                        className="min-h-32 w-full rounded-lg border px-4 py-3"
                      />
                    </div>
                  </div>

                  <div className="mt-7 border-t border-slate-200 pt-6">
                    <h4 className="text-lg font-bold text-slate-900">
                      Darbo video
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      MP4 formatas, iki 10 MB.
                    </p>

                    {darbas.video_url && (
                      <div className="mt-5">
                        <video
                          key={
                            darbas.video_url
                          }
                          src={
                            darbas.video_url
                          }
                          controls
                          muted
                          playsInline
                          className="aspect-video w-full max-w-2xl rounded-xl bg-black object-cover"
                        />
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer rounded-lg bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">
                        {uploadingVideoJobId ===
                        darbas.id
                          ? "Įkeliama..."
                          : darbas.video_url
                          ? "Pakeisti video"
                          : "Įkelti video"}

                        <input
                          type="file"
                          accept="video/mp4,.mp4"
                          disabled={
                            uploadingVideoJobId ===
                            darbas.id
                          }
                          onChange={async (
                            e
                          ) => {
                            const file =
                              e
                                .target
                                .files?.[0];

                            if (
                              file
                            ) {
                              await uploadJobVideo(
                                darbas,
                                file
                              );
                            }

                            e.target.value =
                              "";
                          }}
                          className="hidden"
                        />
                      </label>

                      {darbas.video_url && (
                        <button
                          type="button"
                          disabled={
                            removingVideoJobId ===
                            darbas.id
                          }
                          onClick={() =>
                            removeJobVideo(
                              darbas
                            )
                          }
                          className="rounded-lg border border-red-300 px-5 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
                        >
                          {removingVideoJobId ===
                          darbas.id
                            ? "Šalinama..."
                            : "Pašalinti video"}
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteJob(
                        darbas.id
                      )
                    }
                    className="mt-7 rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
                  >
                    Ištrinti darbo pasiūlymą
                  </button>
                </div>
              )
            )}

            {darbai.length ===
              0 && (
              <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
                Darbo pasiūlymų nėra.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function JobField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string | null;
  onSave: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-slate-600">
        {label}
      </label>

      <input
        defaultValue={
          value || ""
        }
        onBlur={(e) =>
          onSave(
            e.target.value
          )
        }
        className="w-full rounded-lg border px-4 py-3"
      />
    </div>
  );
}