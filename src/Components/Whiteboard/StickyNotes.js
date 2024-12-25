import React, { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../Firebase"; // Update the path if necessary
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import "./StickyNotes.css"; // Import CSS for resizable functionality

const StickyNotes = ({ boardId, stickyNotes, setStickyNotes }) => {
  // Add a new sticky note
  const addStickyNote = async () => {
    const newStickyNote = {
      id: uuidv4(), // Unique ID for the note
      content: "New Note",
      x: 100, // Default position
      y: 100, // Default position
      width: 150, // Default width
      height: 150, // Default height
      color: "rgb(240, 240, 240)", // Fixed light gray color
    };

    // Update local state
    setStickyNotes((prev) => [...prev, newStickyNote]);

    // Save to Firestore
    const boardRef = doc(db, "boards", boardId);
    try {
      await updateDoc(boardRef, {
        stickyNotes: arrayUnion(newStickyNote),
      });
    } catch (error) {
      console.error("Error adding sticky note to Firebase:", error);
    }
  };

  // Update sticky note position
  const updateStickyNotePosition = async (id, x, y) => {
    const updatedNotes = stickyNotes.map((note) =>
      note.id === id ? { ...note, x, y } : note
    );
    setStickyNotes(updatedNotes);

    // Save to Firestore
    const boardRef = doc(db, "boards", boardId);
    try {
      await updateDoc(boardRef, { stickyNotes: updatedNotes });
    } catch (error) {
      console.error("Error updating sticky note position:", error);
    }
  };

  // Update sticky note content
  const updateStickyNoteContent = async (id, content) => {
    const updatedNotes = stickyNotes.map((note) =>
      note.id === id ? { ...note, content } : note
    );
    setStickyNotes(updatedNotes);

    // Save to Firestore
    const boardRef = doc(db, "boards", boardId);
    try {
      await updateDoc(boardRef, { stickyNotes: updatedNotes });
    } catch (error) {
      console.error("Error updating sticky note content:", error);
    }
  };

  // Update sticky note size
  const updateStickyNoteSize = async (id, width, height) => {
    const updatedNotes = stickyNotes.map((note) =>
      note.id === id ? { ...note, width, height } : note
    );
    setStickyNotes(updatedNotes);

    // Save to Firestore
    const boardRef = doc(db, "boards", boardId);
    try {
      await updateDoc(boardRef, { stickyNotes: updatedNotes });
    } catch (error) {
      console.error("Error updating sticky note size:", error);
    }
  };

  // Delete a sticky note
  const deleteStickyNote = async (id) => {
    const noteToDelete = stickyNotes.find((note) => note.id === id);
    const updatedNotes = stickyNotes.filter((note) => note.id !== id);
    setStickyNotes(updatedNotes);

    // Remove from Firestore
    const boardRef = doc(db, "boards", boardId);
    try {
      await updateDoc(boardRef, {
        stickyNotes: arrayRemove(noteToDelete),
      });
    } catch (error) {
      console.error("Error deleting sticky note from Firebase:", error);
    }
  };

  return (
    <div>
      {/* Button to Add a New Sticky Note */}
      <button onClick={addStickyNote} className="add-sticky-note-btn">
        Add Sticky Note
      </button>

      {/* Render Sticky Notes */}
      {stickyNotes.map((note) => (
        <div
          key={note.id}
          className="sticky-note"
          style={{
            left: note.x,
            top: note.y,
            width: note.width,
            height: note.height,
            backgroundColor: note.color,
          }}
          draggable
          // Update position on drag end
          onDragEnd={(e) =>
            updateStickyNotePosition(note.id, e.clientX, e.clientY)
          }
        >
          {/* Content Editable for Note Text */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="sticky-note-content"
            onBlur={(e) => updateStickyNoteContent(note.id, e.target.innerText)}
          >
            {note.content}
          </div>

          {/* Resize Handle */}
          <div
            className="resize-handle"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startY = e.clientY;

              const resize = (event) => {
                const newWidth = Math.max(100, note.width + event.clientX - startX);
                const newHeight = Math.max(100, note.height + event.clientY - startY);

                updateStickyNoteSize(note.id, newWidth, newHeight);
              };

              const stopResize = () => {
                window.removeEventListener("mousemove", resize);
                window.removeEventListener("mouseup", stopResize);
              };

              window.addEventListener("mousemove", resize);
              window.addEventListener("mouseup", stopResize);
            }}
          ></div>

          {/* Delete Button */}
          <button
            className="delete-btn"
            onClick={() => deleteStickyNote(note.id)}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default StickyNotes;
