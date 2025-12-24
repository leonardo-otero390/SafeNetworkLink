import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, Stack } from '@mui/material';
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
    <Stack direction="row" spacing={2} alignItems="center">
      <FormControl size="small" fullWidth>
        <InputLabel>From</InputLabel>
        <Select
          value={fromPerson}
          onChange={(e) => onFromPersonChange(e.target.value)}
          label="From"
        >
          <MenuItem value="">
            <em>Select person</em>
          </MenuItem>
          {people.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl size="small" fullWidth>
        <InputLabel>To</InputLabel>
        <Select
          value={toPerson}
          onChange={(e) => onToPersonChange(e.target.value)}
          label="To"
        >
          <MenuItem value="">
            <em>Select person</em>
          </MenuItem>
          {people.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button
        variant="contained"
        onClick={onAddRelationship}
        disabled={!fromPerson || !toPerson || fromPerson === toPerson}
      >
        Add Relationship
      </Button>
    </Stack>
  );
};
