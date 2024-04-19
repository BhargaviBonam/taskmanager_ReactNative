import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import colors from '../misc/colors';
import RoundIconBtn from './RoundIconBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotes } from '../contexts/NoteProvider';
import NoteInputModal from './NoteInputModal';

const formatDate=(ms)=>{
    const date=new Date(ms);
    const day=date.getDate();
    const month=date.getMonth()+1;
    const year=date.getFullYear();
    const hrs=date.getHours();
    const min=date.getMinutes();
    const sec=date.getSeconds();

    return `${day}/${month}/${year} - ${hrs}:${min}:${sec}`;
}

const NoteDetail = (props) => {
  const [note, setNote] = useState(props.route.params.note);
  const headerHeight = useHeaderHeight();
  const { setNotes } = useNotes();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  //deleting the note from the AsyncStorage

  const deleteNote=async()=>{
    const result=await AsyncStorage.getItem('notes')
    let notes=[]
    if(result != null) note=JSON.parse(result)

    const newNotes=notes.filter(n=>n.id !== note.id)

    setNotes(newNotes)
    await AsyncStorage.setItem('notes',JSON.stringify(newNotes))
    props.navigation.goBack();
  }


  //alering the user to delete the message

  const displayDeleteAlert = () => {
    Alert.alert(
      'Are You Sure!',
      'This action will delete your note permanently!',
      [
        {
          text: 'Delete',
          onPress: deleteNote,
        },
        {
          text: 'No Thanks',
          onPress: () => console.log('no thanks'),
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  //handling the update operation of the data.
   const handleUpdate = async (title, desc, time) => {
    const result = await AsyncStorage.getItem('notes');
    let notes = [];
    if (result !== null) notes = JSON.parse(result);

    const newNotes = notes.filter(n => {
      if (n.id === note.id) {
        n.title = title;
        n.desc = desc;
        n.isUpdated = true;
        n.time = time;

        setNote(n);
      }
      return n;
    });

    setNotes(newNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
  };

  
  //closing operation of the data.

  const handleOnClose=()=>{
    setShowModal(false);
  }

 const openEditModal = () => {
    setIsEdit(true);
    setShowModal(true);
  };
  return (
   <>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: headerHeight }]}
      >
        <Text style={styles.time}>
          {note.isUpdated
            ? `Updated At ${formatDate(note.time)}`
            : `Created At ${formatDate(note.time)}`}
        </Text>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.desc}>{note.desc}</Text>
      </ScrollView>
      <View style={styles.btnContainer}>
        <RoundIconBtn
          antIconName='delete'
          style={{ backgroundColor: colors.ERROR, marginBottom: 15 }}
          onPress={displayDeleteAlert}
        />
        <RoundIconBtn antIconName='edit' onPress={openEditModal} />
      </View>
      <NoteInputModal
        isEdit={isEdit}
        note={note}
        onClose={handleOnClose}
        onSubmit={handleUpdate}
        visible={showModal}
      />
    </>
  )
}

export default NoteDetail