// types/f1.ts

// Location & Circuit types (Ergast/Jolpica shape)
export interface ErgastLocation {
  lat?: string;
  long?: string;
  locality: string;
  country: string;
}

export interface ErgastCircuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: ErgastLocation;
}

// Race (per round)
export interface ErgastRace {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: ErgastCircuit;
  date: string; // "2025-03-16"
  time?: string; // "04:00:00Z" sometimes omitted
}

// Season (races for a year)
export interface ErgastSeasonResponse {
  MRData: {
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: {
      season: string;
      Races: ErgastRace[];
    };
  };
}

// Driver
export interface ErgastDriver {
  driverId: string;
  code?: string;
  permanentNumber?: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface ErgastDriverResponse {
  MRData: {
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    DriverTable: {
      season?: string;
      Drivers: ErgastDriver[];
    };
  };
}

// Constructor / Team
export interface ErgastConstructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface ErgastConstructorResponse {
  MRData: {
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    ConstructorTable: {
      season?: string;
      Constructors: ErgastConstructor[];
    };
  };
}

export interface ErgastDriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: ErgastDriver;
  Constructors: ErgastConstructor[];
}

export interface ErgastDriverStandingsResponse {
  MRData: {
    StandingsTable: {
      season: string;
      driverStandings?: ErgastDriverStanding[];
      StandingsLists: {
        season: string;
        round: string;
        DriverStandings: ErgastDriverStanding[];
      }[];
    };
  };
}

export interface ErgastConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: ErgastConstructor;
}

export interface ErgastConstructorStandingsResponse {
  MRData: {
    StandingsTable: {
      season: string;
      StandingsLists: {
        season: string;
        round: string;
        ConstructorStandings: ErgastConstructorStanding[];
      }[];
    };
  };
}

export interface ErgastResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: ErgastDriver;
  Constructor: ErgastConstructor;
  Time?: { time: string };
  status: string;
}

export interface ErgastRaceResultsResponse {
  MRData: {
    RaceTable: {
      season: string;
      round: string;
      Races: {
        raceName: string;
        round: string;
        Circuit: ErgastCircuit;
        date: string;
        Results: ErgastResult[];
      }[];
    };
  };
}
