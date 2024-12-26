import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../../Firebase"; // Update the path if necessary
import { v4 as uuidv4 } from "uuid";
import "./StickyNotes.css";

const StickyNotes = ({ boardId }) => {
  const [stickyNotes, setStickyNotes] = useState([]);

  // Fetch sticky notes from Firebase on component load
  useEffect(() => {
    const fetchStickyNotes = async () => {
      const boardRef = doc(db, "boards", boardId);
      try {
        const boardDoc = await getDoc(boardRef);
        if (boardDoc.exists()) {
          const data = boardDoc.data();
          setStickyNotes(data.stickyNotes || []); // Load sticky notes or empty array
        } else {
          console.error("No such board document!");
        }
      } catch (error) {
        console.error("Error fetching sticky notes:", error);
      }
    };

    fetchStickyNotes();
  }, [boardId]); // Re-run only when boardId changes

  // Add a new sticky note
  const addStickyNote = async () => {
    const newStickyNote = {
      id: uuidv4(),
      content: "New Note",
      x: 100,
      y: 100,
      width: 150,
      height: 150,
      color: "rgb(240, 240, 240)",
    };

    setStickyNotes((prev) => [...prev, newStickyNote]);

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
      <button onClick={addStickyNote} style={{ marginBottom: "10px" }}>
        Add Sticky Note
      </button>

      {/* Render Sticky Notes */}
      {stickyNotes.map((note) => (
        <div
          key={note.id}
          className="sticky-note"
          style={{
            position: "absolute",
            left: note.x,
            top: note.y,
            width: note.width,
            height: note.height,
            background: note.color,
            padding: "10px",
            cursor: "move",
            borderRadius: "5px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          draggable
          onDragEnd={(e) =>
            updateStickyNotePosition(note.id, e.clientX, e.clientY)
          }
        >
          {/* Content Editable for Note Text */}
          <div
            contentEditable
            suppressContentEditableWarning
            style={{
              width: "100%",
              height: "80%",
              overflow: "auto",
              outline: "none",
            }}
            onBlur={(e) => updateStickyNoteContent(note.id, e.target.innerText)}
          >
            {note.content}
          </div>

          {/* Delete Button */}
          <button
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              cursor: "pointer",
              background: "red",
              color: "white",
              borderRadius: "50%",
              border: "none",
              width: "20px",
              height: "20px",
            }}
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
