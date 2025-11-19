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
const DRIVER_IMAGE_2025: Record<string, string> = {
  // Max Verstappen
  max_verstappen: "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",

  // Lando Norris
  norris: "https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/1col/image.png",

  // Pierre Gasly
  gasly: "https://www.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/1col/image.png",

  // George Russell
  russell: "https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png",

  // Lewis Hamilton
  hamilton: "https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/1col/image.png",

  // Oscar Piastri
  piastri: "https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png",

  // Andrea Kimi Antonelli
  antonelli: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ANDANT01_Andrea%20Kimi_Antonelli/andant01.png.transform/1col/image.png",

  // Yuki Tsunoda
  tsunoda: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/1col/image.png",

  // Charles Leclerc
  leclerc: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/1col/image.png",

  // Alex Albon
  albon: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/1col/image.png",

  // Fernando Alonso
  alonso: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/1col/image.png",

  // Oliver Bearman
  bearman: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png.transform/1col/image.png",

  // Gabriel Bortoleto
  bortoleto: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png.transform/1col/image.png",

  // Franco Colapinto
  colapinto: "https://www.formula1.com/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png.transform/1col/image.png",

  // Jack Doohan
  doohan: "https://www.formula1.com/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png.transform/1col/image.png",

  // Isack Hadjar
  hadjar: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png.transform/1col/image.png",

  // Nico Hulkenberg
  hulkenberg: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png",

  // Liam Lawson
  lawson: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png.transform/1col/image.png",

  // Esteban Ocon
  ocon: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/1col/image.png",

  // Carlos Sainz
  sainz: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/1col/image.png",

  // Lance Stroll
  stroll: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/1col/image.png",
};

// ======================================================
// ✅ DRIVER PHOTO FUNCTION
// Formula 1 image format:
// https://www.formula1.com/.../drivers/M/MAXVER01/maxver01.png.transform/2col/image.png
// ======================================================
function driverPhoto(ergastId: string) {
  if (!ergastId) return "/driver-placeholder.png";

  const key = ergastId.toLowerCase();

  return DRIVER_IMAGE_2025[key] || "/driver-placeholder.png";
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

  const { results: round7Results } = useRaceResults(2025, 7);

  const [countdown, setCountdown] = useState("");

  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [showDriverModal, setShowDriverModal] = useState(false);

  const raceList: ErgastRace[] = races || [];
  const driverList: ErgastDriver[] = drivers || [];
  const teamList: ErgastConstructor[] = constructors || [];
  const driverStandList: ErgastDriverStanding[] = driverStandings || [];
  const constructorStandList: ErgastConstructorStanding[] = constructorStandings || [];
  const modalResults: ErgastResult[] = modalResultsRaw || [];

  const driverTeamMap: Record<string, string> = {};

  round7Results?.forEach((result) => {
    const driverId = result.Driver.driverId;
    const teamName = result.Constructor.name;

    driverTeamMap[driverId] = teamName;
  });

  const selectedDriver = selectedDriverId
    ? driverList.find((d) => d.driverId === selectedDriverId) || null
    : null;

  const selectedDriverStanding = selectedDriverId
    ? driverStandList.find((s) => s.Driver.driverId === selectedDriverId) || null
    : null;

  const selectedDriverTeamName = 
    selectedDriverStanding?.Constructors[0]?.name ?? "Unknown Team";


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

  const teamsArray = Object.entries(driverTeamMap)
    .reduce<Record<string, ErgastDriver[]>>((acc, [driverId, teamName]) => {
      if (!teamName || teamName.includes("Unknown")) return acc;

      const driver = driverList.find((d) => d.driverId === driverId);
      if (driver) {
        if (!acc[teamName]) acc[teamName] = [];
        acc[teamName].push(driver);
      }
      return acc;
    }, {});

  // const driversByTeam: Record<string, ErgastDriver[]> = {};

  // driverList.forEach((driver) => {
  //   const teamName = driverTeamMap[driver.driverId] ?? "Unknown Team";

  //   if (!driversByTeam[teamName]) driversByTeam[teamName] = [];

  //   driversByTeam[teamName].push(driver);
  // });

  // driverStandList.forEach((standing) => {
  //   const teamName = standing.Constructors[0]?.name ?? "Unknown Team";
  //   const driver = driverList.find(
  //     (d) => d.driverId === standing.Driver.driverId
  //   );

  //   if (driver) {
  //     if (!driversByTeam[teamName]) driversByTeam[teamName] = [];
  //     driversByTeam[teamName].push(driver);
  //   }
  // });


  // ======================================================
  // RENDER PAGE
  // ======================================================
  return (
    <main className="min-h-screen bg-black text-white w-full">
      {/* NAV */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-red-900/20">
        <div className="max-w-6xl mx-auto flex justify-between px-6 py-3">
          <h1 className="font-bold text-red-500 tracking-wide">
            F1 Companion 2025
          </h1>

          <nav className="flex gap-4 text-sm text-gray-300">
            {[
              ["Home", "hero"],
              ["Races", "races"],
              ["Drivers", "drivers"],
              ["Teams", "teams"],
              ["Driver Standings", "driver-standings"],
              ["Constructors", "constructor-standings"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="hover:text-red-400"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        id="hero"
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-20"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-red-500"
        >
          Formula 1 — 2025 Season
        </motion.h1>

        <p className="text-gray-300 mt-4 max-w-2xl">
          Unofficial F1 Companion. Data from Jolpica / Ergast.
        </p>

        {nextRace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-lg max-w-lg"
          >
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
        <h2 className="text-3xl font-bold text-center mb-6">
          2025 Race Calendar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {raceList.map((race) => {
            const dt = new Date(
              race.time ? `${race.date}T${race.time}` : `${race.date}T00:00:00Z`
            );

            return (
              <motion.div
                key={race.round}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl shadow hover:scale-[1.02] transition cursor-pointer"
                onClick={() => {
                  setSelectedRound(Number(race.round));
                  setShowModal(true);
                }}
              >
                <p className="text-xs text-gray-400">Round {race.round}</p>

                <h3 className="text-xl font-bold text-red-400">
                  {race.Circuit.Location.country} GP
                </h3>

                <p className="text-gray-300">{race.Circuit.circuitName}</p>

                <p className="text-gray-400 text-sm mt-2">
                  {dt.toDateString()} —{" "}
                  {dt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* DRIVERS */}
      <section id="drivers" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Drivers</h2>
        {/* Render each team */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Object.entries(teamsArray).map(([teamName, teamDrivers]) => (
            <div 
              key={teamName}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg"  
            >
              {/* Team name */}
              <h3 className="text-xl font-bold text-red-400 mb-4 text-center">
                {teamName}
              </h3>
              {/* Driver cards (2 per team) */}
              <div className="grid grid-cols-2 gap-6">
                {teamDrivers.map((d) => (
                  <motion.div
                    key={d.driverId}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true}}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-xl text-center hover:border-red-500/70 transition cursor-pointer"
                    onClick={() => {
                      setSelectedDriverId(d.driverId);
                      setShowDriverModal(true);
                    }}
                  >
                    {/* Driver Image
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mx-auto text-lg font-bold mb-3">
                      <img
                        src={driverPhoto(d.driverId)}
                        alt={`${d.givenName} ${d.familyName}`}
                        className="rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/driver-placeholder.png";
                        }}
                      />
                    </div> */}

                    {/* Driver Image */}
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-2 border-red-400 shadow">
                      <img
                        src={driverPhoto(d.driverId)}
                        alt={'${d.givenName} ${d.familyName}'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-red-400 text-sm">
                      {d.givenName} {d.familyName}
                    </h3>
                    
                    {/* Nationality */}
                    <p className="text-gray-400 text-xs mt-1">
                      {d.nationality}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAMS */}
      <section id="teams" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Teams</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {teamList.map((t) => (
            <motion.div
              key={t.constructorId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-red-500/80 transition text-center"
            >
              <h3 className="text-lg font-bold text-red-400">{t.name}</h3>
              {/* <p className="text-gray-300 text-sm mt-2">
                Nationality: {t.nationality}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                ID: {t.constructorId}
              </p> */}
            </motion.div>
          ))}
        </div>
      </section>

      {/* DRIVER STANDINGS */}
      <section id="driver-standings" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Driver Standings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {driverStandList.map((s) => (
            <motion.div 
              key={s.Driver.driverId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-red-500/80 transition"
            >
              <p className="text-lg font-bold text-red-400">
                #{s.position} - {s.Driver.givenName} {s.Driver.familyName}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {s.Constructors[0]?.name}
              </p>
              <div className="mt-4 flex justify-between text-sm">
                <span className="font-semibold text-gray-200">
                  {s.points} pts
                </span>
                <span className="text-gray-500">{s.wins} wins</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* <section id="driver-standings" className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">
          Driver Standings
        </h2>

        {driverStandList.map((s) => (
          <div
            key={s.Driver.driverId}
            className="p-4 mb-3 bg-neutral-900 border border-neutral-800 rounded-xl flex justify-between hover:border-red-500/80 transition"
          >
            <div>
              <p className="text-xl font-bold text-red-400">
                #{s.position} — {s.Driver.givenName} {s.Driver.familyName}
              </p>
              <p className="text-gray-400 text-sm">
                {s.Constructors[0]?.name}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">{s.points} pts</p>
              <p className="text-sm text-gray-500">{s.wins} wins</p>
            </div>
          </div>
        ))}
      </section> */}

      {/* CONSTRUCTOR STANDINGS */}
      <section id="constructor-standings" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Constructor Standings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {constructorStandList.map((t) => (
            <motion.div
              key={t.Constructor.constructorId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-red-500/80 transition"
            >
              <p className="text-xl font-bold text-red-400">
                #{t.position} - {t.Constructor.name}
              </p>
              <div className="mt-3 flex justify-between text-sm">
                <span className="font-semibold text-gray-200">{t.points} pts</span>
                <span className="text-gray-500">{t.wins} wins</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* <section
        id="constructor-standings"
        className="px-6 py-16 max-w-5xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          Constructor Standings
        </h2>

        {constructorStandList.map((t) => (
          <div
            key={t.Constructor.constructorId}
            className="p-4 mb-3 bg-neutral-900 border border-neutral-800 rounded-xl flex justify-between hover:border-red-500/80 transition"
          >
            <p className="text-xl font-bold text-red-400">
              #{t.position} — {t.Constructor.name}
            </p>

            <div className="text-right">
              <p className="text-lg font-bold">{t.points} pts</p>
              <p className="text-sm text-gray-500">{t.wins} wins</p>
            </div>
          </div>
        ))}
      </section> */}

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
              <p className="text-center text-gray-300 py-10">
                Race didn’t start yet.
              </p>
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
                      {modalResults[2]?.Driver.givenName}{" "}
                      {modalResults[2]?.Driver.familyName}
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
                      {modalResults[0]?.Driver.givenName}{" "}
                      {modalResults[0]?.Driver.familyName}
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
                      {modalResults[1]?.Driver.givenName}{" "}
                      {modalResults[1]?.Driver.familyName}
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
                            P{r.position} — {r.Driver.givenName}{" "}
                            {r.Driver.familyName}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {r.Constructor.name}
                          </p>
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

      {/* =========== DRIVER PROFILE MODAL =========== */}
      {showDriverModal && selectedDriver && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDriverModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-nuetral-800 rounded-2xl p-6 w-full max-w-md relative shadow-[0_0_30px_rgba(255,0,0,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDriverModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-xl"
            >
              ✕
            </button>

            {/* Driver Photo */}
            <div className="flex flex-col items-center text-center">
              <img
                src={driverPhoto(selectedDriver.driverId)}
                alt={"${selectedDriver.giveName} ${selectedDriver.familyName}"}
                className="w-28 h-28 rounded-full object-cover border-2 border-red-400 mb-4"
                onError={(e) => {
                  e.currentTarget.src = "/driver-placeholder.png";
                }}
              />

              <h2 className="text-2xl font-bold text-red-400">
                {selectedDriver.givenName} {selectedDriver.familyName}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {selectedDriver.nationality}
              </p>

              <p className="text-gray-300 text-sm mt-2">
                Team:{" "}
                <span className="font-semibold">{selectedDriverTeamName}</span>
              </p>

              {selectedDriverStanding && (
                <div className="mt-4 grid grid-cols-3 gap-3 w-full">
                  <div className="bg-nuetral-800 rounded-lg p-3">
                    <p className="text-xs tex-gray-400">Position</p>
                    <p className="text-lg font-bold text-red-300">
                      {selectedDriverStanding.position}
                    </p>
                  </div>
                  <div className="bg-neutral-800 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Points</p>
                    <p className="text-lg font-bold text-gray-100">
                      {selectedDriverStanding.points}
                    </p>
                  </div>
                  <div className="bg-neutral-800 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Wins</p>
                    <p className="text-lg font-bold text-gray-100">
                      {selectedDriverStanding.wins}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-500 py-6">
        © {new Date().getFullYear()} F1 Companion · Unofficial — Data from
        Jolpica / Ergast.
      </footer>
    </main>
  );
}
