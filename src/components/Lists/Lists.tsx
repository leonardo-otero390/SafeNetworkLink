import React from 'react';
import { List, ListItem, ListItemText, Typography, Paper, Divider, Box, Chip } from '@mui/material';
import type { Person, Relationship } from '../../types/network.types';

interface PeopleListProps {
  people: Person[];
}

export const PeopleList: React.FC<PeopleListProps> = ({ people }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          👤 Pessoas
        </Typography>
        <Chip
          label={people.length}
          size="small"
          sx={{
            bgcolor: '#8B5CF6',
            color: 'white',
            fontWeight: 600
          }}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List dense>
        {people.length === 0 ? (
          <ListItem>
            <ListItemText
              secondary="Nenhuma pessoa adicionada ainda"
              secondaryTypographyProps={{ color: 'text.secondary' }}
            />
          </ListItem>
        ) : (
          people.map(p => (
            <ListItem
              key={p.id}
              sx={{
                bgcolor: '#F9FAFB',
                borderRadius: 1,
                mb: 0.5,
                '&:hover': {
                  bgcolor: '#F3F4F6'
                }
              }}
            >
              <ListItemText
                primary={p.name}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
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
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          🔗 Conexões
        </Typography>
        <Chip
          label={relationships.length}
          size="small"
          sx={{
            bgcolor: '#EC4899',
            color: 'white',
            fontWeight: 600
          }}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List dense>
        {relationships.length === 0 ? (
          <ListItem>
            <ListItemText
              secondary="Nenhuma conexão adicionada ainda"
              secondaryTypographyProps={{ color: 'text.secondary' }}
            />
          </ListItem>
        ) : (
          relationships.map((r, index) => (
            <ListItem
              key={`${r.from}-${r.to}-${index}`}
              sx={{
                bgcolor: '#F9FAFB',
                borderRadius: 1,
                mb: 0.5,
                '&:hover': {
                  bgcolor: '#F3F4F6'
                }
              }}
            >
              <ListItemText
                primary={`${getPersonName(r.from)} ↔ ${getPersonName(r.to)}`}
                primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};
