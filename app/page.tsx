"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  useSeasonRaces,
  useSeasonDrivers,
  useSeasonConstructors,
  useDriverStandings,
  useConstructorStandings,
  useRaceResults,
} from "@/lib/useF1";

import {
  ErgastRace,
  ErgastDriver,
  ErgastConstructor,
  ErgastDriverStanding,
  ErgastConstructorStanding,
  ErgastResult,
} from "@/types/f1";


// ======================================================
// ✅ DRIVER PHOTO MAPPING (Fixes all image loading)
// ======================================================
const DRIVER_PHOTO_2025: Record<string, string> = {
  // Red Bull
  max_verstappen: "MAXVER01_Max_Verstappen",
  piegas01: "PIEGAS01_Pierre_Gasly",

  // Mercedes
  georus01: "GEORUS01_George_Russell",
  lewham01: "LEWHAM01_Lewis_Hamilton",

  // McLaren
  lannor01: "LANNOR01_Lando_Norris",
  oscpia01: "OSCPIA01_Oscar_Piastri",

  // Ferrari
  chalec01: "CHALEC01_Charles_Leclerc",
  carsai01: "CARSAI01_Carlos_Sainz",

  // Aston Martin
  feralo01: "FERALO01_Fernando_Alonso",
  lanstr01: "LANSTR01_Lance_Stroll",

  // Alpine
  estoco01: "ESTOCO01_Esteban_Ocon",
  olibea01: "OLIBEA01_Oliver_Bearman",

  // Williams
  alealb01: "ALEALB01_Alexander_Albon",
  fracol01: "FRACOL01_Franco_Colapinto",

  // RB (Visa CashApp RB)
  yuktsu01: "YUKTSU01_Yuki_Tsunoda",
  isahad01: "ISAHAD01_Isack_Hadjar",

  // Haas
  nichul01: "NICHUL01_Nico_Hulkenberg",
  gabbor01: "GABBOR01_Gabriel_Bortoleto",

  // Sauber
  andant01: "ANDANT01_Andrea%20Kimi_Antonelli",
  lialaw01: "LIALAW01_Liam_Lawson",

  // Reserve / New
  jacdoo01: "JACDOO01_Jack_Doohan",
};



// ======================================================
// ✅ DRIVER PHOTO FUNCTION
// Formula 1 image format:
// https://www.formula1.com/.../drivers/M/MAXVER01/maxver01.png.transform/2col/image.png
// ======================================================
function driverPhoto(ergastId: string) {
  if (!ergastId) return "/driver-placeholder.png";

  const mapped = DRIVER_PHOTO_2025[ergastId.toLowerCase()];
  if (!mapped) return "/driver-placeholder.png";

  const firstLetter = mapped[0];

  const photoId = mapped.split("_")[0].toLowerCase(); // like maxver01
  const folder = mapped; // like MAXVER01_Max_Verstappen

  return `https://www.formula1.com/content/dam/fom-website/drivers/${firstLetter}/${folder}/${photoId}.png.transform/1col/image.png`;
}



// ======================================================
// ✅ TEAM COLORS
// ======================================================
function teamColor(team: string) {
  const colors: Record<string, string> = {
    red_bull: "#3671C6",
    mercedes: "#00A19C",
    ferrari: "#DC0000",
    mclaren: "#FF8000",
    aston_martin: "#229971",
    rb: "#2B4562",
    haas: "#B6BABD",
    alpine: "#0090FF",
    sauber: "#52E252",
    williams: "#005AFF",
  };

  const key = Object.keys(colors).find((c) =>
    team.toLowerCase().includes(c.replace("_", " "))
  );

  return key ? colors[key] : "#888";
}


// ======================================================
// HELPERS
// ======================================================
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}


// ======================================================
// PAGE STARTS HERE
// ======================================================
export default function Home() {
  const { races } = useSeasonRaces(2025);
  const { drivers } = useSeasonDrivers(2025);
  const { constructors } = useSeasonConstructors(2025);
  const { standings: driverStandings } = useDriverStandings(2025);
  const { standings: constructorStandings } = useConstructorStandings(2025);

  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { results: modalResultsRaw } = useRaceResults(2025, selectedRound ?? 1);

  const [countdown, setCountdown] = useState("");

  const raceList: ErgastRace[] = races || [];
  const driverList: ErgastDriver[] = drivers || [];
  const teamList: ErgastConstructor[] = constructors || [];
  const driverStandList: ErgastDriverStanding[] = driverStandings || [];
  const constructorStandList: ErgastConstructorStanding[] = constructorStandings || [];
  const modalResults: ErgastResult[] = modalResultsRaw || [];


  // ======================================================
  // NEXT RACE DETECTION
  // ======================================================
  const nextRace: ErgastRace | null = useMemo(() => {
    if (!raceList.length) return null;
    const now = new Date();

    const upcoming = raceList
      .map((race) => {
        const dateTime = new Date(
          race.time ? `${race.date}T${race.time}` : `${race.date}T00:00:00Z`
        );
        return { race, ts: dateTime.getTime() };
      })
      .filter((r) => r.ts > now.getTime())
      .sort((a, b) => a.ts - b.ts)[0];

    return upcoming?.race ?? null;
  }, [raceList]);


  // ======================================================
  // COUNTDOWN
  // ======================================================
  useEffect(() => {
    if (!nextRace) return;

    const target = new Date(
      nextRace.time
        ? `${nextRace.date}T${nextRace.time}`
        : `${nextRace.date}T00:00:00Z`
    ).getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown("Race ongoing!");
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);

      setCountdown(`${d}d ${h}h ${m}m`);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [nextRace]);


  // ======================================================
  // RENDER PAGE
  // ======================================================
  return (
    <main className="min-h-screen bg-black text-white w-full">

      {/* NAV */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-red-900/20">
        <div className="max-w-6xl mx-auto flex justify-between px-6 py-3">
          <h1 className="font-bold text-red-500 tracking-wide">F1 Companion 2025</h1>

          <nav className="flex gap-4 text-sm text-gray-300">
            {[
              ["Home", "hero"],
              ["Races", "races"],
              ["Drivers", "drivers"],
              ["Teams", "teams"],
              ["Driver Standings", "driver-standings"],
              ["Constructors", "constructor-standings"],
            ].map(([label, id]) => (
              <button key={id} onClick={() => scrollToSection(id)} className="hover:text-red-400">
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>


      {/* HERO */}
      <section id="hero" className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.h1 initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-red-500">
          Formula 1 — 2025 Season
        </motion.h1>

        <p className="text-gray-300 mt-4 max-w-2xl">
          Unofficial F1 Companion. Data from Jolpica / Ergast.
        </p>

        {nextRace && (
          <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg max-w-lg">

            <h2 className="text-xl font-bold text-red-400">Next Race</h2>

            <p className="font-semibold mt-1">
              {nextRace.Circuit.Location.country} Grand Prix
            </p>

            <p className="text-gray-400 text-sm">
              {nextRace.Circuit.circuitName}
            </p>

            <p className="mt-2 text-gray-300">
              {nextRace.date} {nextRace.time?.replace("Z", " UTC")}
            </p>

            <p className="text-red-300 font-bold mt-3">⏳ {countdown}</p>
          </motion.div>
        )}
      </section>


      {/* RACES */}
      <section id="races" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">2025 Race Calendar</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {raceList.map((race) => {
            const dt = new Date(
              race.time ? `${race.date}T${race.time}` : `${race.date}T00:00:00Z`
            );

            return (
              <motion.div key={race.round}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl shadow hover:scale-[1.02] transition cursor-pointer"
                onClick={() => {
                  setSelectedRound(Number(race.round));
                  setShowModal(true);
                }}>

                <p className="text-xs text-gray-400">Round {race.round}</p>

                <h3 className="text-xl font-bold text-red-400">
                  {race.Circuit.Location.country} GP
                </h3>

                <p className="text-gray-300">{race.Circuit.circuitName}</p>

                <p className="text-gray-400 text-sm mt-2">
                  {dt.toDateString()} —{" "}
                  {dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>



      {/* DRIVERS */}
      <section id="drivers" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Drivers — 2025</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {driverList.map((d) => (
            <motion.div key={d.driverId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl text-center hover:border-red-500/80 transition">

              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto text-lg font-bold mb-3">
                {getInitials(`${d.givenName} ${d.familyName}`)}
              </div>

              <h3 className="font-bold text-red-400">
                {d.givenName} {d.familyName}
              </h3>

              <p className="text-gray-400 text-sm mt-1">{d.nationality}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* TEAMS */}
      <section id="teams" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Teams — 2025</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamList.map((t) => (
            <motion.div key={t.constructorId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-red-500/80 transition">

              <h3 className="text-lg font-bold text-red-400">{t.name}</h3>
              <p className="text-gray-300 text-sm">Nationality: {t.nationality}</p>
              <p className="text-gray-500 text-xs mt-1">ID: {t.constructorId}</p>
            </motion.div>
          ))}
        </div>
      </section>



      {/* DRIVER STANDINGS */}
      <section id="driver-standings" className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Driver Standings</h2>

        {driverStandList.map((s) => (
          <div key={s.Driver.driverId}
            className="p-4 mb-3 bg-neutral-900 border border-neutral-800 rounded-xl flex justify-between hover:border-red-500/80 transition">

            <div>
              <p className="text-xl font-bold text-red-400">
                #{s.position} — {s.Driver.givenName} {s.Driver.familyName}
              </p>
              <p className="text-gray-400 text-sm">Team: {s.Constructors[0]?.name}</p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">{s.points} pts</p>
              <p className="text-sm text-gray-500">{s.wins} wins</p>
            </div>
          </div>
        ))}
      </section>



      {/* CONSTRUCTOR STANDINGS */}
      <section id="constructor-standings" className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Constructor Standings</h2>

        {constructorStandList.map((t) => (
          <div key={t.Constructor.constructorId}
            className="p-4 mb-3 bg-neutral-900 border border-neutral-800 rounded-xl flex justify-between hover:border-red-500/80 transition">

            <p className="text-xl font-bold text-red-400">
              #{t.position} — {t.Constructor.name}
            </p>

            <div className="text-right">
              <p className="text-lg font-bold">{t.points} pts</p>
              <p className="text-sm text-gray-500">{t.wins} wins</p>
            </div>
          </div>
        ))}
      </section>



      {/* ======================================================
         RACE RESULT MODAL
      ====================================================== */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-red-400 mb-6 text-center">
              Round {selectedRound} — Race Results
            </h2>

            {/* If no results */}
            {modalResults.length === 0 ? (
              <p className="text-center text-gray-300 py-10">Race didn’t start yet.</p>
            ) : (
              <>
                {/* Podium */}
                <div className="grid grid-cols-3 gap-3 mb-10 text-center">

                  {/* 3rd */}
                  <div className="p-3 rounded-xl bg-gradient-to-b from-[#cd7f32] to-[#754922] border border-[#cd7f32] shadow">
                    <p className="text-xs text-orange-200">3rd</p>
                    <img
                      className="w-14 h-14 rounded-full mx-auto mt-1 object-cover border border-orange-300"
                      src={driverPhoto(modalResults[2]?.Driver.driverId)}
                    />
                    <p className="font-bold text-orange-100 text-sm mt-2">
                      {modalResults[2]?.Driver.givenName} {modalResults[2]?.Driver.familyName}
                    </p>
                  </div>

                  {/* 1st */}
                  <div className="p-4 rounded-xl bg-gradient-to-b from-[#FFD700] to-[#A68B00] border border-[#FFD700] shadow-xl scale-110">
                    <p className="text-xs text-yellow-900">1st</p>
                    <img
                      className="w-16 h-16 rounded-full mx-auto mt-1 object-cover border border-yellow-200"
                      src={driverPhoto(modalResults[0]?.Driver.driverId)}
                    />
                    <p className="font-bold text-yellow-50 text-base mt-2">
                      {modalResults[0]?.Driver.givenName} {modalResults[0]?.Driver.familyName}
                    </p>
                  </div>

                  {/* 2nd */}
                  <div className="p-3 rounded-xl bg-gradient-to-b from-[#C0C0C0] to-[#7a7a7a] border border-[#C0C0C0] shadow">
                    <p className="text-xs text-gray-800">2nd</p>
                    <img
                      className="w-14 h-14 rounded-full mx-auto mt-1 object-cover border border-gray-200"
                      src={driverPhoto(modalResults[1]?.Driver.driverId)}
                    />
                    <p className="font-bold text-gray-100 text-sm mt-2">
                      {modalResults[1]?.Driver.givenName} {modalResults[1]?.Driver.familyName}
                    </p>
                  </div>

                </div>


                {/* Positions 4–20 */}
                <div className="space-y-3">
                  {modalResults.slice(3).map((r) => {
                    const color = teamColor(r.Constructor.constructorId);
                    return (
                      <div
                        key={r.Driver.driverId}
                        className="flex justify-between items-center p-3 bg-neutral-800 rounded-xl shadow border-l-4 hover:bg-neutral-700 transition"
                        style={{ borderColor: color }}
                      >
                        <div>
                          <p className="text-gray-200 font-semibold">
                            P{r.position} — {r.Driver.givenName} {r.Driver.familyName}
                          </p>
                          <p className="text-gray-500 text-xs">{r.Constructor.name}</p>
                        </div>

                        <p className="text-gray-400 text-sm">
                          {r.Time?.time ?? r.status}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}


      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-500 py-6">
        © {new Date().getFullYear()} F1 Companion · Unofficial — Data from Jolpica / Ergast.
      </footer>

    </main>
  );
}
