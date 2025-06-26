import React, { useRef, useState, useEffect } from 'react';

export default function GiftCard() {
  // State
  const [image, setImage] = useState(null);
  const [dear, setDear] = useState('');
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState('');
  // Ref
  const canvasRef = useRef(null);

  // Draw image and text on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Check if image is loaded, if not, fill canvas with light brown color
    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#f5e6d3';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Dear Input
    ctx.font = 'italic 18px Pacifico, cursive';
    ctx.fillStyle = '#6d4c2b';
    ctx.textAlign = 'left';
    ctx.fillText(dear, 180, 140);

    // Message Input (word wrap)
    ctx.font = '14px Pacifico, cursive';
    // set max width for text and start position
    const maxWidth = 220;
    const startX = 120;
    const startY = 170;
    // line height based on image line height
    const lineHeight = 32;

    function wrapText(text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      let lines = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      lines.forEach((l, i) => {
        ctx.fillText(l.trim(), x, y + i * lineHeight);
      });
    }

    wrapText(message, startX, startY, maxWidth, lineHeight);
    // From
    ctx.font = 'italic 17px Pacifico, cursive';
    ctx.fillText(from, 170, 240);
  }, [image, dear, message, from]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  };

  // Download canvas as image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'gift-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const maxLines = 2;
  const handleMessageChange = (e) => {
    let value = e.target.value;
    let lines = value.split('\n');
    if (lines.length > maxLines) {
      value = lines.slice(0, maxLines).join('\n');
    }
    setMessage(value);
  };

  const isFormValid = dear.trim() && message.trim() && from.trim() && image;

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .giftcard-outer {
            padding: 0 !important;
            min-height: 100vh !important;
            height: auto !important;
            overflow-y: auto !important;
            position: static !important;
          }
          .giftcard-inner {
            max-width: 100vw !important;
            padding: 4vw 2vw !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .giftcard-canvas {
            max-width: 100vw !important;
            height: auto !important;
          }
          .giftcard-inputs {
            max-width: 100vw !important;
            margin: 12px 0 !important;
            gap: 8px !important;
          }
          .giftcard-btn {
            max-width: 100vw !important;
            font-size: 15px !important;
            padding: 10px !important;
          }
        }
      `}</style>
      <div className="giftcard-outer" style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5e6fa 0%, #e0f7fa 100%)', margin: 0, padding: 0, overflowY: 'auto' }}>
        <div className="giftcard-inner" style={{ width: '100%', maxWidth: 480, background: '#fff8f0', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
          <h2 style={{ color: '#222', marginBottom: 24 }}>Gift Card Generator</h2>
          <canvas
            data-testid="giftcard-canvas"
            ref={canvasRef}
            width={400}
            height={400}
            className="giftcard-canvas"
            style={{ width: '100%', maxWidth: 400, height: 'auto', border: '1px solid #ccc', borderRadius: 8, marginBottom: 16, display: 'block' }}
          />
          <label htmlFor="image-upload" style={{ display: 'block', width: '100%', marginBottom: 16 }}>
            <div style={{
              border: '2px dashed #b39ddb',
              borderRadius: 8,
              padding: '16px 0',
              textAlign: 'center',
              background: '#f3e5f5',
              color: '#6d4c2b',
              cursor: 'pointer',
              fontWeight: 500,
              width: '100%',
              maxWidth: 400,
              margin: '0 auto',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6d4c2b" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M20 16.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-2.5" />
              </svg>
              Browse File
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              aria-label="Browse File"
            />
          </label>
          <div className="giftcard-inputs" style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400, margin: '16px auto', alignItems: 'stretch' }}>
            <input
              type="text"
              placeholder="Dear"
              value={dear}
              onChange={e => setDear(e.target.value)}
              style={{ width: '100%', borderRadius: 6, border: '1px solid #b39ddb', padding: 8, boxSizing: 'border-box', background: '#ede7f6', color: '#222' }}
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={handleMessageChange}
              rows={2}
              style={{ width: '100%', borderRadius: 6, border: '1px solid #b39ddb', padding: 8, resize: 'none', boxSizing: 'border-box', background: '#ede7f6', color: '#222' }}
            />
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={e => setFrom(e.target.value)}
              style={{ width: '100%', borderRadius: 6, border: '1px solid #b39ddb', padding: 8, boxSizing: 'border-box', background: '#ede7f6', color: '#222' }}
            />
          </div>
          <button className="giftcard-btn" onClick={handleDownload} style={{ marginTop: 12, width: '100%', maxWidth: 400, background: isFormValid ? '#b39ddb' : '#d1c4e9', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 600, fontSize: 16, cursor: isFormValid ? 'pointer' : 'not-allowed', display: 'block', marginLeft: 'auto', marginRight: 'auto', opacity: isFormValid ? 1 : 0.6 }} disabled={!isFormValid}>Download Gift Card</button>
        </div>
      </div>
    </>
  );
}