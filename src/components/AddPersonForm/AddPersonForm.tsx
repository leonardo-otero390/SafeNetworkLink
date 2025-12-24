import React from 'react';
import { TextField, Button, Stack, Typography, Box } from '@mui/material';

interface AddPersonFormProps {
  newPersonName: string;
  onNameChange: (name: string) => void;
  onAddPerson: () => void;
}

export const AddPersonForm: React.FC<AddPersonFormProps> = ({
  newPersonName,
  onNameChange,
  onAddPerson
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAddPerson();
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography
          variant="caption"
          fontWeight={600}
          textTransform="uppercase"
          color="text.secondary"
          letterSpacing={0.5}
        >
          Nome/Apelido
        </Typography>
        <TextField
          placeholder="Ex: Crush, Metamour..."
          value={newPersonName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          fullWidth
          sx={{ mt: 1 }}
        />
      </Box>
      
      <Button
        variant="contained"
        onClick={onAddPerson}
        disabled={!newPersonName.trim()}
        fullWidth
        sx={{
          bgcolor: '#8B5CF6',
          '&:hover': {
            bgcolor: '#7C3AED'
          },
          textTransform: 'none',
          fontWeight: 600,
          py: 1.2,
          borderRadius: 2
        }}
      >
        Adicionar à Rede
      </Button>
      
      <Box sx={{ bgcolor: '#F3F4F6', p: 2, borderRadius: 2 }}>
        <Typography variant="caption" fontWeight={600} color="primary" gutterBottom>
          Como funciona:
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
          • Adicione seus parceiros diretos conectando <strong>"A Mim"</strong>.
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
          • Adicione os parceiros dos seus parceiros selecionando o nome deles na lista.
        </Typography>
      </Box>
    </Stack>
  );
};
