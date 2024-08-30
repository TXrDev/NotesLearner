import React, { useEffect, useRef } from 'react';
import * as Nexus from 'nexusui';
import * as Tone from 'tone';

function PianoKeyboard({ onNoteClick, clefType }) {
  const pianoRef = useRef(null);

  useEffect(() => {
    if (!clefType) return; // Ensure clefType is defined before proceeding

    // Initialize Tone.js synthesizer
    const synth = new Tone.Synth().toDestination();

    // Define note ranges based on clef type
    const noteRanges = clefType === 'treble' 
      ? { low: 48, high: 60 } // C4 to C5
      : { low: 36, high: 48 }; // C3 to C4

    // Initialize the piano keyboard using NexusUI
    const piano = new Nexus.Piano(pianoRef.current, {
      'size': [pianoRef.current.clientWidth, 150],
      'mode': 'button',
      'lowNote': noteRanges.low,
      'highNote': noteRanges.high,
    });

    // Handle note click event
    const handleNoteClick = (v) => {
      if (v.state) {
        const note = Tone.Frequency(v.note, "midi").toNote();
        onNoteClick(note.replace(/(\d)/, '/$1'));
        synth.triggerAttackRelease(note, '8n'); // Play the note
      }
    };

    // Attach event listener
    piano.on('change', handleNoteClick);

    // Clean up the piano instance when the component unmounts
    return () => {
      if (piano) {
        piano.destroy();
      }
    };
  }, [onNoteClick, clefType]);

  return <div className="piano-container" ref={pianoRef}></div>;
}

export default PianoKeyboard;
