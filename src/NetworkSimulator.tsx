import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Stack, Grid } from '@mui/material';
import type { Person, Relationship, GraphNode, GraphLink } from './types/network.types';
import { NetworkService } from './services/network.service';
import { AddPersonForm } from './components/AddPersonForm/AddPersonForm';
import { AddRelationshipForm } from './components/AddRelationshipForm/AddRelationshipForm';
import { VisualizationControl } from './components/VisualizationControl/VisualizationControl';
import { PeopleList, RelationshipList } from './components/Lists/Lists';
import { NetworkVisualization } from './components/NetworkVisualization/NetworkVisualization';

const NetworkSimulator: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [fromPerson, setFromPerson] = useState('');
  const [toPerson, setToPerson] = useState('');
  const [indexPerson, setIndexPerson] = useState('');
  const [visualizationData, setVisualizationData] = useState<{
    nodes: GraphNode[];
    links: GraphLink[];
  }>({ nodes: [], links: [] });

  const addPerson = () => {
    if (newPersonName.trim()) {
      const newPerson: Person = {
        id: crypto.randomUUID(),
        name: newPersonName.trim()
      };
      setPeople([...people, newPerson]);
      setNewPersonName('');
    }
  };

  const addRelationship = () => {
    if (fromPerson && toPerson && fromPerson !== toPerson) {
      const newRelationship: Relationship = { from: fromPerson, to: toPerson };
      setRelationships([...relationships, newRelationship]);
      setFromPerson('');
      setToPerson('');
    }
  };

  const visualizeNetwork = () => {
    if (!indexPerson) return;

    // Use NetworkService to calculate distances
    const distances = NetworkService.calculateDistances(indexPerson, relationships);
    
    // Prepare visualization data using service
    const vizData = NetworkService.prepareVisualizationData(people, relationships, distances);
    setVisualizationData(vizData);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          NÃO MONO - Visualizador de Rede Social
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visualização de relações de rede (Distância 2 = Alerta Crítico)
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Input Section */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Adicionar Pessoa
              </Typography>
              <AddPersonForm
                newPersonName={newPersonName}
                onNameChange={setNewPersonName}
                onAddPerson={addPerson}
              />
            </Paper>

            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Adicionar Relacionamento
              </Typography>
              <AddRelationshipForm
                people={people}
                fromPerson={fromPerson}
                toPerson={toPerson}
                onFromPersonChange={setFromPerson}
                onToPersonChange={setToPerson}
                onAddRelationship={addRelationship}
              />
            </Paper>

            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Visualizar Rede
              </Typography>
              <VisualizationControl
                people={people}
                indexPerson={indexPerson}
                onIndexPersonChange={setIndexPerson}
                onVisualize={visualizeNetwork}
              />
            </Paper>

            <PeopleList people={people} />
            
            <RelationshipList relationships={relationships} people={people} />
          </Stack>
        </Grid>

        {/* Visualization Section */}
        <Grid size={{ xs: 12, md: 7 }}>
          <NetworkVisualization
            nodes={visualizationData.nodes}
            links={visualizationData.links}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default NetworkSimulator;
