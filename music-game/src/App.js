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

  function handleNoteClick(note) {
    const noteLetter = note.split('/')[0];
    const currentNoteLetter = currentNote.split('/')[0];

    console.log(`Clicked Note: ${note}, Current Note: ${currentNote}`); // Debug log

    if (noteLetter === currentNoteLetter) {
      // Correct answer
      setScore(prevScore => prevScore + 1);
      setFeedback({ note, isCorrect: true });
      setTimeout(() => setFeedback({ note: '', isCorrect: null }), 300);

      // Generate the next random note and key signature
      const newClef = getRandomClef();
      setClefType(newClef);
      setCurrentNote(getRandomNote(newClef));
      setKeySignature(getRandomKeySignature());
    } else {
      // Incorrect answer
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

export default App;
