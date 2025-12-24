import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Stack } from '@mui/material';
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
    <Stack direction="row" spacing={2} alignItems="center">
      <FormControl size="small" fullWidth>
        <InputLabel>Index Person</InputLabel>
        <Select
          value={indexPerson}
          onChange={(e) => onIndexPersonChange(e.target.value)}
          label="Index Person"
        >
          <MenuItem value="">
            <em>Select index person</em>
          </MenuItem>
          {people.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button
        variant="contained"
        color="success"
        onClick={onVisualize}
        disabled={!indexPerson}
      >
        Generate Network
      </Button>
    </Stack>
  );
};
