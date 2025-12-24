import React from 'react';
import { List, ListItem, ListItemText, Typography, Paper, Divider } from '@mui/material';
import type { Person, Relationship } from '../../types/network.types';

interface PeopleListProps {
  people: Person[];
}

export const PeopleList: React.FC<PeopleListProps> = ({ people }) => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        People ({people.length})
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List dense>
        {people.length === 0 ? (
          <ListItem>
            <ListItemText secondary="No people added yet" />
          </ListItem>
        ) : (
          people.map(p => (
            <ListItem key={p.id}>
              <ListItemText primary={p.name} />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

interface RelationshipListProps {
  relationships: Relationship[];
  people: Person[];
}

export const RelationshipList: React.FC<RelationshipListProps> = ({ relationships, people }) => {
  const getPersonName = (id: string) => people.find(p => p.id === id)?.name || 'Unknown';

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Relationships ({relationships.length})
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List dense>
        {relationships.length === 0 ? (
          <ListItem>
            <ListItemText secondary="No relationships added yet" />
          </ListItem>
        ) : (
          relationships.map((r) => (
            <ListItem key={`${r.from}-${r.to}`}>
              <ListItemText primary={`${getPersonName(r.from)} ↔ ${getPersonName(r.to)}`} />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};
