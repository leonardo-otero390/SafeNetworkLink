import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Stack, Grid } from '@mui/material';
import type { Person, Relationship, GraphNode, GraphLink } from './types/network.types';
import { NetworkService } from './services/network.service';
import { AddPersonForm } from './components/AddPersonForm/AddPersonForm';
import { AddRelationshipForm } from './components/AddRelationshipForm/AddRelationshipForm';
import { VisualizationControl } from './components/VisualizationControl/VisualizationControl';
import { PeopleList, RelationshipList } from './components/Lists/Lists';
import { NetworkVisualization } from './components/NetworkVisualization/NetworkVisualization';
import { DotCodeViewer } from './components/DotCodeViewer/DotCodeViewer';

const NetworkSimulator: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [fromPerson, setFromPerson] = useState('');
  const [toPerson, setToPerson] = useState('');
  const [indexPerson, setIndexPerson] = useState('');
  const [dotCode, setDotCode] = useState('');
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
    
    // Generate DOT code using service
    const dot = NetworkService.generateDotCode(people, distances, relationships);
    setDotCode(dot);

    // Prepare visualization data using service
    const vizData = NetworkService.prepareVisualizationData(people, relationships, distances);
    setVisualizationData(vizData);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          NÃO MONO - Network Relationship Visualizer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Anonymous STI signaling via network visualization (Distance 2 = Critical Alert)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Input Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Add Person
              </Typography>
              <AddPersonForm
                newPersonName={newPersonName}
                onNameChange={setNewPersonName}
                onAddPerson={addPerson}
              />
            </Paper>

            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Add Relationship
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
                Visualize Network
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
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <NetworkVisualization
              nodes={visualizationData.nodes}
              links={visualizationData.links}
            />
            
            <DotCodeViewer dotCode={dotCode} />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NetworkSimulator;
