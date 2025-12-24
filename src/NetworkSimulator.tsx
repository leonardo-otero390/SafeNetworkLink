import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Stack, Grid, Button } from '@mui/material';
import { Shield } from '@mui/icons-material';
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

  const handleSimulateRisk = () => {
    // Placeholder para funcionalidade futura
    alert('Funcionalidade de simulação de risco IST em desenvolvimento');
  };

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          color: 'white',
          py: 2,
          px: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h5" component="h1" fontWeight={600}>
                💜 Não Mono
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              MVP v0.1 - Protocolo de Saúde
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h2" gutterBottom fontWeight={600} color="text.primary">
              Sua Constelação
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Adicione pessoas para mapear riscos e afetos.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Shield />}
            onClick={handleSimulateRisk}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Simular Risco IST
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Input Section */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    👥 Adicionar Afeto
                  </Typography>
                </Box>
                <AddPersonForm
                  newPersonName={newPersonName}
                  onNameChange={setNewPersonName}
                  onAddPerson={addPerson}
                />
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  🔗 Adicionar Relacionamento
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

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  👁️ Visualizar Rede
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
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                minHeight: 600
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={600}>
                🗺️ Mapeamento Atual
              </Typography>
              {visualizationData.nodes.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 500,
                    color: 'text.secondary'
                  }}
                >
                  <Typography>
                    Nenhuma conexão adicionada ainda. Comece ao lado.
                  </Typography>
                </Box>
              ) : (
                <NetworkVisualization
                  nodes={visualizationData.nodes}
                  links={visualizationData.links}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default NetworkSimulator;
