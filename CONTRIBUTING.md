# Guia de Contribuição - SafeNetworkLink

Obrigado por seu interesse em contribuir para o SafeNetworkLink! Este guia descreve como você pode ajudar a melhorar este projeto.

## Como Começar

### Pré-requisitos
- Node.js 18+ e npm 9+
- Git
- Conhecimento básico de React, TypeScript e Vite

### Setup do Ambiente

1. **Fork o repositório**
   ```bash
   # Clique em "Fork" no GitHub
   ```

2. **Clone seu fork**
   ```bash
   git clone https://github.com/SEU_USUARIO/SafeNetworkLink.git
   cd SafeNetworkLink
   ```

3. **Adicione o repositório original como upstream**
   ```bash
   git remote add upstream https://github.com/leonardo-otero390/SafeNetworkLink.git
   ```

4. **Instale as dependências**
   ```bash
   npm install
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## Workflow de Contribuição

### 1. Crie uma Branch
```bash
# Atualize a main local
git checkout main
git pull upstream main

# Crie uma branch para sua feature
git checkout -b feature/nome-da-feature
# Ou para bug fixes
git checkout -b bugfix/descricao-do-bug
```

### 2. Commits Semânticos
Siga o padrão de [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: adiciona novo componente de visualização"
git commit -m "fix: corrige bug na busca BFS"
git commit -m "docs: atualiza documentação da API"
git commit -m "refactor: reorganiza estrutura de arquivos"
git commit -m "test: adiciona testes para o NetworkService"
```

### 3. Push e Pull Request

```bash
# Push sua branch
git push origin feature/nome-da-feature

# Crie um Pull Request no GitHub
# - Descreva claramente o que foi mudado
# - Referencie issues relacionadas (#123)
# - Adicione screenshots se relevante
```

## Padrões de Código

### TypeScript
- Use tipos explícitos ao máximo possível
- Evite `any` - use `unknown` se necessário
- Prefira interfaces para tipos públicos

### React & Components
- Nomeie componentes em PascalCase
- Coloque cada componente em sua própria pasta
- Use hooks funcionais, não class components
- Mantenha componentes pequenos e focados

### Estrutura de Pastas
```
src/
├── components/      # Componentes React reutilizáveis
├── services/        # Lógica de negócio (BFS, serialização)
├── types/           # Definições TypeScript
└── assets/          # Imagens, ícones, etc
```

## Desenvolvimento

### Comandos Disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Faz build para produção
npm run preview   # Visualiza o build de produção localmente
npm run lint      # Executa ESLint
npm run type-check # Verifica tipos TypeScript
```

## Testing

Estamos trabalhando para melhorar a cobertura de testes. Contribuições com testes são muito bem-vindas!

## Reportar Issues

### Bugs
- Use o template de bug report no GitHub
- Descreva os passos para reproduzir
- Inclua comportamento esperado vs. observado
- Adicione screenshots/logs se possível

### Feature Requests
- Use o template de feature request
- Explique o caso de uso
- Descreva a solução ideal
- Sugira alternativas se aplicável

## Revisão de Código

Todos os PRs serão revisados antes de serem mesclados. Durante a revisão:
- Pequenas sugestões de estilo
- Discussões sobre abordagem arquitetural
- Testes para novos recursos
- Documentação necessária

Seja receptivo ao feedback - estamos todos aqui para melhorar!

## Código de Conduta

### Nossa Promessa
Nos comprometemos a fornecer um ambiente acolhedor para todos, independentemente de:
- Idade, tamanho do corpo, deficiência visível ou invisível
- Etnia, identidade e expressão de gênero
- Nível de experiência, educação, status socioeconômico
- Nacionalidade, aparência pessoal, raça, religião
- Identidade e orientação sexual

### Nossos Padrões
Comportamentos que contribuem para um ambiente positivo:
- Usar linguagem acolhedora e inclusiva
- Ser respeitoso com pontos de vista diferentes
- Aceitar críticas construtivas graciosamente
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros

Comportamentos inaceitáveis incluem:
- Uso de linguagem ou imagens sexualizadas
- Ataques pessoais ou insultos
- Assédio público ou privado
- Publicar informações privadas sem consentimento
- Outra conduta considerada inadequada profissionalmente

## Perguntas?

- Abra uma discussion no GitHub
- Crie uma issue com a tag `question`
- Entre em contato com os maintainers

---

Obrigado por fazer parte da comunidade SafeNetworkLink! 🙏
