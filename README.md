# NÃO MONO - Safe Network Link

**Anonymous STI Signaling via Network Visualization**

A React/TypeScript application for visualizing non-monogamous relationship networks and identifying critical contact points for STI exposure risk assessment.

## 🎯 Purpose

This application provides a privacy-focused tool for individuals in non-monogamous relationships to:
- Map their relationship network
- Identify potential STI exposure paths up to 2 degrees of separation
- Receive critical alerts for Distance 2 (D2) contacts
- Generate network visualizations for portfolio and health awareness

## 🏗️ Architecture

### Frontend Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **D3.js** - Interactive network visualization
- **Graphviz DOT** - Standardized graph representation

### Database Justification (Dual Database Design)

The application is designed with a dual-database architecture for optimal performance and scalability:

#### 1. **PostgreSQL - User Management**
**Purpose**: Relational data storage for user accounts and authentication

**Why PostgreSQL?**
- **ACID Compliance**: Ensures data integrity for user credentials and personal information
- **Strong Schema**: User data requires strict validation and relationships (user profiles, settings, authentication tokens)
- **Security**: Mature authentication and encryption features for sensitive personal data
- **SQL Queries**: Complex queries for user management, permissions, and audit trails

**Schema Example**:
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  created_at TIMESTAMP,
  last_login TIMESTAMP
)
```

#### 2. **MongoDB - Network Data**
**Purpose**: Document storage for dynamic relationship networks

**Why MongoDB?**
- **Array Efficiency**: Native array support for storing connections/edges without JOIN operations
- **Schema Flexibility**: Relationship networks vary greatly in size and structure
- **Horizontal Scaling**: Can distribute large networks across shards as the user base grows
- **Performance**: Fast reads for graph traversal operations (BFS algorithms)
- **Document Model**: Naturally represents graph nodes and edges

**Schema Example**:
```javascript
{
  user_id: "uuid",
  network: {
    nodes: [
      { id: "person-1", name: "Alice", metadata: {...} }
    ],
    edges: [
      { from: "person-1", to: "person-2", timestamp: "..." }
    ]
  },
  updated_at: "timestamp"
}
```

**Network Efficiency Benefits**:
- Single document retrieval loads entire network (no JOINs)
- Array indexing enables O(1) lookups for edges
- Embedded documents reduce network round-trips
- Atomic updates for concurrent relationship changes

## 🚀 Features

### 1. Relationship Input
- Add people to the network
- Define bidirectional relationships
- Simple, intuitive interface

### 2. BFS Distance Calculation
- Breadth-First Search algorithm
- Maximum distance: 2 (D2 limit as specified)
- Efficient graph traversal

### 3. D3.js Visualization
- Interactive force-directed graph
- Color-coded nodes by distance:
  - 🔵 **Blue**: Index person (D0)
  - 🟡 **Yellow**: Distance 1 (direct contacts)
  - 🔴 **Red**: Distance 2 (CRITICAL ALERTS)
- Draggable nodes
- Real-time physics simulation

### 4. Graphviz DOT Code Generation
- Standards-compliant DOT format
- Clear distance labeling
- **CRITICAL ALERT marking** for D2 nodes
- Copy-to-clipboard functionality
- Compatible with Graphviz tools

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/leonardo-otero390/SafeNetworkLink.git
cd SafeNetworkLink

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 💻 Usage

1. **Add People**: Enter names to create network nodes
2. **Define Relationships**: Select two people to create a bidirectional connection
3. **Select Index Person**: Choose the starting point for distance calculation
4. **Generate Network**: View the D3 visualization and Graphviz DOT code
5. **Identify Alerts**: Red nodes (D2) indicate critical exposure paths

## 🔒 Privacy & Security

- **Anonymous by Design**: No personal data collected
- **Local Processing**: All calculations performed client-side
- **No Backend Required**: Runs entirely in the browser
- **No Data Persistence**: Network data stored only in session

## 📊 Portfolio Proof

This MVP demonstrates:
- ✅ React/TypeScript development
- ✅ Advanced algorithms (BFS graph traversal)
- ✅ D3.js data visualization
- ✅ Graphviz integration
- ✅ Database architecture design
- ✅ Health-tech domain expertise
- ✅ Privacy-first engineering

## 🛠️ Technical Implementation

### NetworkSimulator.tsx Core Features

```typescript
// BFS Algorithm - O(V + E) complexity
const calculateDistances = (startId: string): Map<string, number>

// D3.js Force Simulation
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links))
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter())

// Graphviz DOT Generation
const generateDotCode = (distances: Map<string, number>): string
```

### Distance 2 Critical Alerts

Nodes at exactly 2 degrees of separation are marked as **CRITICAL ALERTS** because:
- They represent indirect exposure paths
- May be unaware of connection to index case
- Require notification for STI testing
- Demonstrate network effect of transmission

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Leonardo Otero
- GitHub: [@leonardo-otero390](https://github.com/leonardo-otero390)

## 🙏 Acknowledgments

Built as an MVP for portfolio demonstration and social health awareness.

---

**Note**: This is a proof-of-concept application. For actual STI notification, please consult healthcare professionals and use official public health resources.
