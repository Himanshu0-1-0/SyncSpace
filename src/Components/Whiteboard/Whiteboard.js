import React, { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../Firebase"; // Update this path if needed
import "./Whiteboard.css"; // Import CSS file for cursor styling

const Whiteboard = ({ boardId, userId }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pen"); // 'pen' or 'eraser'
  const [color, setColor] = useState("#000000");
  const [penSize, setPenSize] = useState(5); // Pen size state
  const [eraserSize, setEraserSize] = useState(20); // Eraser size state
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]); // Store strokes locally

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;
  }, []);

  // Load strokes from Firestore in real-time
  useEffect(() => {
    const boardRef = doc(db, "boards", boardId);

    const unsubscribe = onSnapshot(boardRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const loadedStrokes = data.strokes || [];
        setStrokes(loadedStrokes);

        // Only redraw new strokes to avoid overwriting local in-progress strokes
        loadedStrokes.forEach((stroke) => {
          drawStrokeOnCanvas(stroke);
        });
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, [boardId]);

  // Draw a single stroke on the canvas
  const drawStrokeOnCanvas = (stroke) => {
    const ctx = ctxRef.current;

    ctx.beginPath();
    ctx.lineWidth = stroke.lineWidth;
    ctx.strokeStyle = stroke.tool === "eraser" ? "#FFFFFF" : stroke.color;

    stroke.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.stroke();
  };

  // Start Drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);

    const newStroke = {
      tool,
      color: tool === "eraser" ? "#FFFFFF" : color,
      lineWidth: tool === "eraser" ? eraserSize : penSize,
      points: [{ x: offsetX, y: offsetY }],
      userId, // Add userId to distinguish strokes
    };

    setStrokes((prev) => [...prev, newStroke]);
  };

  // Draw on Mouse Move
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const updatedStrokes = [...strokes];
    const currentStroke = updatedStrokes[updatedStrokes.length - 1];
    currentStroke.points.push({ x: offsetX, y: offsetY });

    setStrokes(updatedStrokes);

    ctx.beginPath();
    ctx.lineWidth = currentStroke.lineWidth;
    ctx.strokeStyle = currentStroke.color;
    ctx.moveTo(
      currentStroke.points[currentStroke.points.length - 2].x,
      currentStroke.points[currentStroke.points.length - 2].y
    );
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  // Stop Drawing
  const stopDrawing = async () => {
    setIsDrawing(false);

    // Save the last stroke to Firebase
    const boardRef = doc(db, "boards", boardId);
    try {
      const lastStroke = strokes[strokes.length - 1]; // Get the most recent stroke
      await updateDoc(boardRef, {
        strokes: arrayUnion(lastStroke), // Add the last stroke to Firestore
      });
    } catch (error) {
      console.error("Error saving stroke to Firebase:", error);
    }
  };

  // Change cursor dynamically based on tool
  const updateCursor = () => {
    const canvas = canvasRef.current;
    if (tool === "pen") {
      canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="${penSize}" width="${penSize}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${encodeURIComponent(
        color
      )}" /></svg>') ${penSize / 2} ${penSize / 2}, auto`;
    } else if (tool === "eraser") {
      canvas.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="${eraserSize}" width="${eraserSize}" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" fill="white" stroke="black" stroke-width="5" /></svg>') ${eraserSize / 2} ${eraserSize / 2}, auto`;
    }
  };

  useEffect(() => {
    updateCursor();
  }, [tool, penSize, eraserSize, color]);

  return (
    <div>
      {/* Toolbar */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setTool("pen")}>Pen</button>
        <button onClick={() => setTool("eraser")}>Eraser</button>

        {/* Color Picker for Pen */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={tool === "eraser"}
        />

        {/* Pen Size Slider */}
        {tool === "pen" && (
          <input
            type="range"
            min="1"
            max="20"
            value={penSize}
            onChange={(e) => setPenSize(parseInt(e.target.value))}
          />
        )}

        {/* Eraser Size Slider */}
        {tool === "eraser" && (
          <input
            type="range"
            min="10"
            max="50"
            value={eraserSize}
            onChange={(e) => setEraserSize(parseInt(e.target.value))}
          />
        )}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        style={{ border: "1px solid #000", background: "#FFF" }}
      />
    </div>
  );
};

export default Whiteboard;
