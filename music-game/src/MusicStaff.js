import React, { useEffect, useRef } from 'react';
import Vex from 'vexflow';

const { Renderer, Stave, StaveNote, Formatter } = Vex.Flow;

function MusicStaff({ note, clefType, keySignature }) {
  const staffRef = useRef(null);

  useEffect(() => {
    // Log current props to verify they're updating correctly
    console.log(`Rendering note: ${note}, clefType: ${clefType}, keySignature: ${keySignature}`);

    // Clear the previous rendering
    if (staffRef.current) {
      staffRef.current.innerHTML = '';

      // Create the VexFlow renderer and context
      const renderer = new Renderer(staffRef.current, Renderer.Backends.SVG);
      renderer.resize(300, 150);
      const context = renderer.getContext();
      context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');

      // Create a stave (staff) and add the clef and key signature
      const stave = new Stave(10, 40, 280);
      stave.addClef(clefType).addKeySignature(keySignature).setContext(context).draw();

      // Create a note
      const staveNote = new StaveNote({
        clef: clefType,
        keys: [note],
        duration: 'q',
      });

      // Format and draw the note
      Formatter.FormatAndDraw(context, stave, [staveNote]);
    }
  }, [note, clefType, keySignature]);

  return (
    <div>
      <div ref={staffRef}></div>
    </div>
  );
}

export default MusicStaff;
