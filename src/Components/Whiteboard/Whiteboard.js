import React, { useEffect, useRef, useState } from "react";
import { doc, updateDoc, arrayUnion, setDoc, getDoc,onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase";


const Whiteboard = ({ boardId, userId }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); // 'pen' or 'eraser'
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);

  const [strokes, setStrokes] = useState([]); // Local strokes
  const [liveStrokes, setLiveStrokes] = useState([]); // Synced strokes from Firestore

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    // Sync strokes from Firestore
    const boardRef = doc(db, "boards", boardId);
    const unsubscribe = onSnapshot(boardRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.strokes) {
        setLiveStrokes(data.strokes);
        redrawCanvas(data.strokes);
      }
    });

    return () => unsubscribe();
  }, [boardId]);

  // Redraw Canvas with Firestore Strokes
  const redrawCanvas = (strokes) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
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
    });
  };

  // Start Drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);

    const newStroke = {
      userId,
      tool,
      color,
      lineWidth,
      points: [{ x: offsetX, y: offsetY }],
    };

    setStrokes((prev) => [...prev, newStroke]);
  };

  // Draw on Mouse Move
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    // const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const updatedStrokes = [...strokes];
    const currentStroke = updatedStrokes[updatedStrokes.length - 1];
    currentStroke.points.push({ x: offsetX, y: offsetY });

    setStrokes(updatedStrokes);

    ctx.beginPath();
    ctx.lineWidth = currentStroke.lineWidth;
    ctx.strokeStyle = currentStroke.tool === "eraser" ? "#FFFFFF" : currentStroke.color;
    ctx.moveTo(
      currentStroke.points[currentStroke.points.length - 2].x,
      currentStroke.points[currentStroke.points.length - 2].y
    );
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  // Stop Drawing and Save Stroke
  const stopDrawing = async () => {
    setIsDrawing(false);
  
    const boardRef = doc(db, "boards", boardId); // Reference to the board document
    const lastStroke = strokes[strokes.length - 1];
  
    if (lastStroke) {
      try {
        // Check if the document exists
        const docSnapshot = await getDoc(boardRef);
  
        if (docSnapshot.exists()) {
          // If the document exists, update it
          await updateDoc(boardRef, {
            strokes: arrayUnion(lastStroke),
          });
        } else {
          // If the document doesn't exist, create it with initial data
          await setDoc(boardRef, {
            strokes: [lastStroke],
          });
        }
      } catch (error) {
        console.error("Error saving stroke to Firestore:", error);
      }
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setTool("pen")}>Pen</button>
        <button onClick={() => setTool("eraser")}>Eraser</button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={tool === "eraser"}
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        />
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
