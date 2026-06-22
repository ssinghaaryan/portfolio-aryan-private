import React, { createContext, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [musicData, setMusicData] = useState(null);
  const [notesData, setNotesData] = useState(null);
  const [financeData, setFinanceData] = useState(null);
  const [ideasData, setIdeasData] = useState(null);
  const [photosData, setPhotosData] = useState(null);
  const [moviesData, setMoviesData] = useState(null);
  const [vaultData, setVaultData] = useState(null);

  const clearAll = () => {
    setMusicData(null);
    setNotesData(null);
    setFinanceData(null);
    setIdeasData(null);
    setPhotosData(null);
    setMoviesData(null);
    setVaultData(null);
  };

  return (
    <DataContext.Provider value={{
      musicData, setMusicData,
      notesData, setNotesData,
      financeData, setFinanceData,
      ideasData, setIdeasData,
      photosData, setPhotosData,
      moviesData, setMoviesData,
      vaultData, setVaultData,
      clearAll
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}