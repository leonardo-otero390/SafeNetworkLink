import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface DotCodeViewerProps {
  dotCode: string;
}

export const DotCodeViewer: React.FC<DotCodeViewerProps> = ({ dotCode }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(dotCode);
  };

  if (!dotCode) return null;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Graphviz DOT Code
      </Typography>
      <Box
        component="pre"
        sx={{
          bgcolor: '#f4f4f4',
          p: 2,
          borderRadius: 1,
          overflow: 'auto',
          maxHeight: '400px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}
      >
        {dotCode}
      </Box>
      <Button
        variant="contained"
        startIcon={<ContentCopyIcon />}
        onClick={handleCopy}
        sx={{ mt: 1 }}
      >
        Copy DOT Code
      </Button>
    </Paper>
  );
};
