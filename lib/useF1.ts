// lib/useF1.ts
"use client";

import useSWR from "swr";
import {
  ErgastSeasonResponse,
  ErgastDriverResponse,
  ErgastConstructorResponse,
  ErgastRace,
  ErgastDriver,
  ErgastConstructor,
  ErgastDriverStandingsResponse,
  ErgastConstructorStandingsResponse,
  ErgastRaceResultsResponse,
  ErgastResult,
  ErgastDriverStanding,
  ErgastConstructorStanding,
} from "@/types/f1";

const JOLPI_BASE = "https://api.jolpi.ca/ergast/f1";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// 🗓 2025 season races
export function useSeasonRaces(year = 2025) {
  const { data, error } = useSWR<ErgastSeasonResponse>(
    `${JOLPI_BASE}/${year}.json`,
    fetcher
  );

  const races: ErgastRace[] = data?.MRData.RaceTable.Races ?? [];

  return {
    races,
    isLoading: !data && !error,
    isError: Boolean(error),
  };
}

// 🏎 2025 drivers
export function useSeasonDrivers(year = 2025) {
  const { data, error } = useSWR<ErgastDriverResponse>(
    `${JOLPI_BASE}/${year}/drivers.json?limit=100`,
    fetcher
  );

  const drivers: ErgastDriver[] = data?.MRData.DriverTable.Drivers ?? [];

  return {
    drivers,
    isLoading: !data && !error,
    isError: Boolean(error),
  };
}

// 🏆 2025 constructors / teams
export function useSeasonConstructors(year = 2025) {
  const { data, error } = useSWR<ErgastConstructorResponse>(
    `${JOLPI_BASE}/${year}/constructors.json?limit=100`,
    fetcher
  );

  const constructors: ErgastConstructor[] =
    data?.MRData.ConstructorTable.Constructors ?? [];

  return {
    constructors,
    isLoading: !data && !error,
    isError: Boolean(error),
  };
}

export function useDriverStandings(year = 2025) {
  const { data, error } = useSWR<ErgastDriverStandingsResponse>(
    `${JOLPI_BASE}/${year}/driverStandings.json`,
    fetcher
  );

  const standings: ErgastDriverStanding[] =
    data?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];

  return {
    standings,
    isLoading: !data && !error,
    isError: Boolean(error),
  };
}

export function useConstructorStandings(year = 2025) {
  const { data, error } = useSWR<ErgastConstructorStandingsResponse>(
    `${JOLPI_BASE}/${year}/constructorStandings.json`,
    fetcher
  );

  const standings: ErgastConstructorStanding[] =
    data?.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? [];

  return {
    standings,
    isLoading: !data && !error,
    isError: Boolean(error),
  };
}

export function useRaceResults(year = 2025, round: number) {
  const { data, error } = useSWR<ErgastRaceResultsResponse>(
    `${JOLPI_BASE}/${year}/${round}/results.json`,
    fetcher
  );

  const results: ErgastResult[] =
    data?.MRData.RaceTable.Races[0]?.Results ?? [];

  return {
    results,
    isLoading: !data && !error,
    isError: Boolean(error),
  };
}

