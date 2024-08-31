import "./App.css";
import React, { useState } from 'react';
import MusicStaff from './MusicStaff';
import PianoKeyboard from './PianoKeyboard';

// Define possible key signatures
const keySignatures = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'
];

function getRandomKeySignature() {
  const randomIndex = Math.floor(Math.random() * keySignatures.length);
  return keySignatures[randomIndex];
}

// Define note constants
const trebleNotes = [
  'C/4', 'C#/4', 'D/4', 'D#/4', 'E/4', 'F/4', 'F#/4', 'G/4', 'G#/4', 'A/4', 'A#/4', 'B/4',
  'C/5', 'C#/5', 'D/5', 'D#/5', 'E/5', 'F/5', 'F#/5', 'G/5', 'G#/5', 'A/5', 'A#/5', 'B/5'
];
const bassNotes = [
  'C/2', 'C#/2', 'D/2', 'D#/2', 'E/2', 'F/2', 'F#/2', 'G/2', 'G#/2', 'A/2', 'A#/2', 'B/2',
  'C/3', 'C#/3', 'D/3', 'D#/3', 'E/3', 'F/3', 'F#/3', 'G/3', 'G#/3', 'A/3', 'A#/3', 'B/3'
];

function getRandomNote(clefType) {
  const notes = clefType === 'treble' ? trebleNotes : bassNotes;
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
}

function getRandomClef() {
  return Math.random() > 0.5 ? 'treble' : 'bass';
}

function App() {
  const [score, setScore] = useState(0);
  const [clefType, setClefType] = useState(getRandomClef());
  const [currentNote, setCurrentNote] = useState(getRandomNote(clefType));
  const [keySignature, setKeySignature] = useState(getRandomKeySignature());
  const [feedback, setFeedback] = useState({ note: '', isCorrect: null });

  const enharmonicEquivalents = {
    'C#': 'Db', 'Db': 'C#',
    'D#': 'Eb', 'Eb': 'D#',
    'F#': 'Gb', 'Gb': 'F#',
    'G#': 'Ab', 'Ab': 'G#',
    'A#': 'Bb', 'Bb': 'A#'
  };
  
  function handleNoteClick(note) {
    // Normalize both the clicked note and current note based on the key signature
    const noteLetter = normalizeNoteForKeySignature(note.split('/')[0], keySignature);
    const currentNoteLetter = normalizeNoteForKeySignature(currentNote.split('/')[0], keySignature);
  
    // Check if notes are enharmonic equivalents
    const areNotesEqual = (noteLetter === currentNoteLetter) ||
      (enharmonicEquivalents[noteLetter] && enharmonicEquivalents[noteLetter] === currentNoteLetter);
  
    console.log(`Clicked Note: ${note}, Normalized Clicked Note: ${noteLetter}, Current Note: ${currentNote}, Normalized Current Note: ${currentNoteLetter}`);
  
    if (areNotesEqual) {
      // Correct answer logic
      setScore(prevScore => prevScore + 1);
      setFeedback({ note, isCorrect: true });
      setTimeout(() => setFeedback({ note: '', isCorrect: null }), 300);
  
      // Generate the next random note and key signature
      const newClef = getRandomClef();
      setClefType(newClef);
      setCurrentNote(getRandomNote(newClef));
      setKeySignature(getRandomKeySignature());
    } else {
      // Incorrect answer logic
      setScore(prevScore => prevScore - 1);
      setFeedback({ note, isCorrect: false });
      setTimeout(() => setFeedback({ note: '', isCorrect: null }), 300);
    }
  }  

  return (
    <div className="App">
      <div className="content">
        <h1>Score: {score}</h1>

        {/* Music Staff */}
        <MusicStaff note={currentNote} clefType={clefType} keySignature={keySignature} />

        {/* Feedback */}
        <p>
          {feedback.isCorrect === true
            ? "Correct!"
            : feedback.isCorrect === false
            ? "Incorrect!"
            : ""}
        </p>
      </div>

      {/* Piano Keyboard */}
      <div className="piano-container">
        <PianoKeyboard onNoteClick={handleNoteClick} clefType={clefType} />
      </div>
    </div>
  );
}
const keySignatureAccidentals = {
  'C': [],
  'G': ['F#'],        // Only F# is sharp in G major
  'D': ['F#', 'C#'],
  'A': ['F#', 'C#', 'G#'],
  'E': ['F#', 'C#', 'G#', 'D#'],
  'B': ['F#', 'C#', 'G#', 'D#', 'A#'],
  'F#': ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'],
  'Db': ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
  'Ab': ['Bb', 'Eb', 'Ab', 'Db'],
  'Eb': ['Bb', 'Eb', 'Ab'],
  'Bb': ['Bb', 'Eb'],
  'F': ['Bb']
};

function normalizeNoteForKeySignature(note, keySignature, clefType) {
  const accidentalNotes = keySignatureAccidentals[keySignature] || [];

  // Extract note components (letter, accidental, octave)
  const noteParts = note.match(/^([A-G])([#b]?)(\/\d)?$/);
  if (!noteParts) return note; // Return original note if parsing fails

  let [_, letter, accidental, octave] = noteParts;

  // Check if the note already has an accidental
  if (accidental) {
    return `${letter}${accidental}${octave || ''}`;
  }

  // Apply sharp/flat only if the note is in the key signature's accidental notes
  if (accidentalNotes.includes(`${letter}#`)) {
    accidental = '#';
  } else if (accidentalNotes.includes(`${letter}b`)) {
    accidental = 'b';
  } else {
    accidental = ''; // Ensure other notes remain natural
  }

  // Return the normalized note with the correct accidental applied
  return `${letter}${accidental}${octave || ''}`;
}






export default App;
