import { createContext } from "react";
import { ICountryData } from "../interfaces/countryData";

export const CountryDataContext = createContext({
  countryData: new Map<string, ICountryData>(),
  setCountryData: (data: Map<string, ICountryData>) => {},
  visitedCount: 0,
  setVisitedCount: (count: number) => {},
});
