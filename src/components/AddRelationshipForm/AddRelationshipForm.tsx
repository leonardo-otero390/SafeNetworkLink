import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Stack, Typography, Box } from '@mui/material';
import type { Person } from '../../types/network.types';

interface AddRelationshipFormProps {
  people: Person[];
  fromPerson: string;
  toPerson: string;
  onFromPersonChange: (id: string) => void;
  onToPersonChange: (id: string) => void;
  onAddRelationship: () => void;
}

export const AddRelationshipForm: React.FC<AddRelationshipFormProps> = ({
  people,
  fromPerson,
  toPerson,
  onFromPersonChange,
  onToPersonChange,
  onAddRelationship
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
          De
        </Typography>
        <FormControl size="small" fullWidth sx={{ mt: 1 }}>
          <Select
            value={fromPerson}
            onChange={(e) => onFromPersonChange(e.target.value)}
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
      
      <Box>
        <Typography
          variant="caption"
          fontWeight={600}
          textTransform="uppercase"
          color="text.secondary"
          letterSpacing={0.5}
          gutterBottom
        >
          Para
        </Typography>
        <FormControl size="small" fullWidth sx={{ mt: 1 }}>
          <Select
            value={toPerson}
            onChange={(e) => onToPersonChange(e.target.value)}
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
        onClick={onAddRelationship}
        disabled={!fromPerson || !toPerson || fromPerson === toPerson}
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
        Conectar
      </Button>
    </Stack>
  );
};
