import React from 'react';
import { TextField, Button, Stack } from '@mui/material';

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
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        label="Person name"
        value={newPersonName}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        size="small"
        fullWidth
      />
      <Button
        variant="contained"
        onClick={onAddPerson}
        disabled={!newPersonName.trim()}
      >
        Add Person
      </Button>
    </Stack>
  );
};
