import React from 'react';

function NoteDisplay({ note }) {
  return (
    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
      <p>🎵 {note}</p>
    </div>
  );
}

export default NoteDisplay;
