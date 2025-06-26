import '@testing-library/jest-dom/vitest';

// Mock getContext agar tidak error di JSDOM
HTMLCanvasElement.prototype.getContext = () => {
  // return minimal mock context object
  return {
    clearRect: () => {},
    drawImage: () => {},
    fillRect: () => {},
    fillText: () => {},
    measureText: () => ({ width: 0 }),
    // tambahkan method lain jika diperlukan oleh GiftCard.jsx
  };
};

if (!window.URL.createObjectURL) {
  window.URL.createObjectURL = () => 'mock-url';
}

// Mock window.Image agar onload otomatis terpanggil di test
defineGlobalImageMock();

function defineGlobalImageMock() {
  if (!window.Image || window.Image.name !== 'MockImageForTest') {
    window.Image = class MockImageForTest {
      set src(_) {
        if (typeof this.onload === 'function') {
          this.onload();
        }
      }
    };
  }
}