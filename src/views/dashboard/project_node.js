import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Handle } from '@xyflow/react';

const CircularNode = ({ data }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const imageSrc = isLight ? data.image2 : data.image;

  return (
    <div
      style={{
        width: 100,
        height: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        background: 'transparent',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={imageSrc}
          alt="icon"
          style={{ width: 80, height: 80, objectFit: 'contain', filter: isLight ? 'none' : 'invert(1)' }}
        />
      </div>

      {/* Label */}
      <div style={{ marginTop: 6, textAlign: 'center', color: 'black', fontWeight: '500', fontSize: 20 }}>
        {data.label}
      </div>

      {/* Power Value */}
      <div style={{ color: 'black', fontSize: 20 }}>
        {data.power || '0.00 KW'}
      </div>

      {/* Optional Green Status Dot */}
      {data.status && (
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: 'limegreen',
            position: 'absolute',
            right: -12,
            top: 40,
          }}
        />
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={data.incomingHandlePosition}
        id="incoming"
        style={{ borderRadius: '50%', background: 'transparent', border: 'none' }}
      />
      <Handle
        type="source"
        position={data.outgoingHandlePosition}
        id="outgoing"
        style={{ borderRadius: '50%', background: 'transparent', border: 'none' }}
      />
    </div>
  );
};

export default CircularNode;
