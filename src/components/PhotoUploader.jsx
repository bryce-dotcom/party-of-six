import React, { useRef } from 'react';

const PhotoUploader = ({ onPhotoAdded }) => {
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);

  const resizeAndStore = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (h / w) * maxSize; w = maxSize; }
          else { w = (w / h) * maxSize; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        onPhotoAdded({
          id: `photo-${Date.now()}`,
          dataUrl,
          caption: '',
          timestamp: Date.now(),
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) resizeAndStore(file);
    e.target.value = '';
  };

  return (
    <div style={styles.container}>
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <button style={styles.btn} onClick={() => galleryRef.current?.click()}>
        {'\uD83D\uDCF7'} Upload
      </button>
      <button style={styles.btn} onClick={() => cameraRef.current?.click()}>
        {'\uD83D\uDCF8'} Take Photo
      </button>
    </div>
  );
};

const styles = {
  container: { display: 'flex', gap: '8px' },
  btn: {
    padding: '8px 14px',
    background: 'rgba(201,169,98,0.12)',
    border: '1px solid rgba(201,169,98,0.3)',
    borderRadius: '8px',
    color: '#C9A962',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};

export default PhotoUploader;
