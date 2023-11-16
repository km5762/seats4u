import React, { useEffect, useRef } from 'react';

const BlockCanvas = ({ col, row }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const blockWidth = 20;
  const blockHeight = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    // Initial canvas setup
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the initial grid based on col and row
    drawGrid();
  }, [col, row]); // Run when col or row changes

  const drawGrid = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    // Clear the canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < row; r++) {
      for (let c = 0; c < col; c++) {
        const x = c * blockWidth;
        const y = r * blockHeight;

        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, blockWidth, blockHeight);
        ctx.strokeStyle = 'white'; // Set the border color to black
        ctx.strokeRect(x, y, blockWidth, blockHeight); // Draw the border around the same rectangle
      }
    }
  };

  return (
    <div>
        <canvas ref={canvasRef} width={blockWidth * col} height={blockHeight * row} style={{ border: '1px solid black' }} />
    </div>
  );
};

export default BlockCanvas;
