import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

//creating note provider

const NoteContext=createContext();
const NoteProvider = ({children}) => {
    //creating an array to render the data
    const [notes,setNotes]=useState([])


    //getting the data from AsyncStorage.
    const findNotes=async()=>{
        const result =await AsyncStorage.getItem('notes')
        if(result != null) setNotes(JSON.parse(result));
    }

    useEffect(()=>{
        findNotes();
    },[])
  return (
     <NoteContext.Provider value={{ notes, setNotes, findNotes }}>
      {children}
    </NoteContext.Provider>
  )
}

export const useNotes=()=>useContext(NoteContext);

export default NoteProvider