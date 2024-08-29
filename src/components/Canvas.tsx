import React, { useRef, useEffect, useState } from 'react';
import beachImage from '../assets/beachImage.jpg';
import dropperIcon from '../assets/color_dropper.svg';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const magnifierCanvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverColor, setHoverColor] = useState<string>('');
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isMouseMoving, setIsMouseMoving] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('');

  const magnifierRadius = 50;  // Radius of the magnifying glass
  const magnificationLevel = 2;  // Magnification level

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    const image = new Image();
    image.src = beachImage;
    image.onload = () => {
      if (context && canvas) {
        canvas.width = image.width || 4000;  // Set logical canvas size to 4000x4000 pixels
        canvas.height = image.height || 4000;

        // Draw the image on the canvas, scaled to 4000x4000
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDropping) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (context && canvas) {
      const { offsetX, offsetY } = e.nativeEvent;

      // Update the mouse position
      const newMousePos = { x: offsetX, y: offsetY };
      setMousePos(newMousePos);
      setIsMouseMoving(true);

      // Get color under cursor
      const pixel = context.getImageData(offsetX, offsetY, 1, 1).data;
      const hexColor = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
      setHoverColor(hexColor);

      // Draw the magnifying effect
      drawMagnifier(newMousePos, hexColor);
    }
  };

  const handleMouseClick = () => {
    if (isDropping && hoverColor) {
      setSelectedColor(hoverColor); // Set the selected color on click
      setIsDropping(false); // Turn off dropping mode after selection
      setMousePos(null); // Reset mouse position
      setIsMouseMoving(false); // Stop the magnifier from appearing
    }
  };

  const handleMouseLeave = () => {
    setIsMouseMoving(false);  // Stop displaying the magnifier when the mouse leaves the canvas
  };

  const drawMagnifier = (mousePos: { x: number; y: number }, hexColor: string) => {
    const canvas = canvasRef.current;
    const magnifierCanvas = magnifierCanvasRef.current;
    const context = canvas?.getContext('2d');
    const magnifierContext = magnifierCanvas?.getContext('2d');

    if (context && magnifierContext && canvas && magnifierCanvas) {
      // Clear the magnifier canvas
      magnifierContext.clearRect(0, 0, magnifierCanvas.width, magnifierCanvas.height);

      // Set magnifier canvas dimensions
      magnifierCanvas.width = magnifierRadius * 2;
      magnifierCanvas.height = magnifierRadius * 2;

      // Draw magnified area onto the magnifier canvas
      magnifierContext.drawImage(
        canvas, 
        mousePos.x - magnifierRadius / magnificationLevel, 
        mousePos.y - magnifierRadius / magnificationLevel, 
        magnifierRadius * 2 / magnificationLevel, 
        magnifierRadius * 2 / magnificationLevel, 
        0, 
        0, 
        magnifierRadius * 2, 
        magnifierRadius * 2
      );

      // Add circular clipping mask to create a circular magnifying effect
      magnifierContext.beginPath();
      magnifierContext.arc(magnifierRadius, magnifierRadius, magnifierRadius, 0, Math.PI * 2);
      magnifierContext.clip();

      // Draw hex color text in the center of the magnifier
      magnifierContext.fillStyle = hexColor === '#FFFFFF' ? '#000' : '#FFF'; // Contrast text color
      magnifierContext.font = 'bold 14px Arial';
      magnifierContext.textAlign = 'center';
      magnifierContext.textBaseline = 'middle';
      magnifierContext.fillText(hexColor, magnifierRadius, magnifierRadius);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Container for dropper icon and selected color */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', top: 0, left: '10px', zIndex: 2 }}>
        {/* Dropper icon to enable the color picker */}
        <img 
          src={dropperIcon} 
          alt="Color Dropper"
          style={{
            cursor: 'pointer',
            width: '40px',
            height: '40px',
            marginRight: '10px', // Space between icon and color
          }}
          onClick={() => setIsDropping(!isDropping)}
        />

        {/* Display the selected color hex code */}
        <h1 style={{ color: selectedColor || '#000', fontSize: '18px', marginLeft: '200px' }}>
          {selectedColor || 'Select a color'}
        </h1>
      </div>

      {/* Main canvas for the image */}
      <canvas 
        ref={canvasRef} 
        onMouseMove={handleMouseMove} 
        onClick={handleMouseClick}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDropping ? `url(${dropperIcon}), auto` : 'default' }}
      />

      {isDropping && mousePos && isMouseMoving && (  // Conditionally render the magnifier canvas only if mousePos is set and mouse is moving
        <canvas
          ref={magnifierCanvasRef}
          role="img"
          style={{
            position: 'absolute',
            top: mousePos.y - magnifierRadius,
            left: mousePos.x - magnifierRadius,
            borderRadius: '50%',
            border: `2px solid ${hoverColor}`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default Canvas;
