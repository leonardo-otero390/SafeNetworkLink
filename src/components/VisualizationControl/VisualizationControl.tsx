import React from 'react';
import { FormControl, Select, MenuItem, Button, Stack, Typography, Box } from '@mui/material';
import type { Person } from '../../types/network.types';

interface VisualizationControlProps {
  people: Person[];
  indexPerson: string;
  onIndexPersonChange: (id: string) => void;
  onVisualize: () => void;
}

export const VisualizationControl: React.FC<VisualizationControlProps> = ({
  people,
  indexPerson,
  onIndexPersonChange,
  onVisualize
}) => {
  return (
    <Stack spacing={2}>
      <Box>
        <Typography
          variant="caption"
          fontWeight={600}
          textTransform="uppercase"
          color="text.secondary"
          letterSpacing={0.5}
          gutterBottom
        >
          Pessoa Índice (Ponto de Partida)
        </Typography>
        <FormControl size="small" fullWidth sx={{ mt: 1 }}>
          <Select
            value={indexPerson}
            onChange={(e) => onIndexPersonChange(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">
              <em>Selecionar pessoa</em>
            </MenuItem>
            {people.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Button
        variant="contained"
        onClick={onVisualize}
        disabled={!indexPerson}
        fullWidth
        sx={{
          bgcolor: '#10B981',
          '&:hover': {
            bgcolor: '#059669'
          },
          textTransform: 'none',
          fontWeight: 600,
          py: 1.2,
          borderRadius: 2
        }}
      >
        Gerar Visualização
      </Button>
    </Stack>
  );
};
