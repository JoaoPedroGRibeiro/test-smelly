const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpos', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  // Refatoração 1: Eager Test separado em dois testes coesos e únicos
  test('deve criar um usuário com os dados informados', () => {
    // Arrange & Act
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(dadosUsuarioPadrao.nome);
  });

  test('deve buscar um usuário existente pelo seu ID', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado.id).toBe(usuarioCriado.id);
    expect(usuarioBuscado.status).toBe('ativo');
  });

  // Refatoração 2: Remoção de lógica condicional separando os cenários
  test('deve desativar um usuário comum com sucesso', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);
    
    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve permitir a desativação de um usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);
    
    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo');
  });

  // Refatoração 3: Remoção do teste frágil (focando no comportamento do relatório, não na string exata)
  test('deve gerar um relatório contendo os dados fundamentais dos usuários', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();
    
    // Assert
    expect(relatorio).toContain(usuario1.id);
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('Bob');
    expect(relatorio).toContain('--- Relatório de Usuários ---');
  });
  
  // Refatoração 4: Uso correto da expectativa de erro do Jest (evitando falsos positivos do try/catch)
  test('deve lançar um erro ao tentar criar um usuário menor de idade', () => {
    // Arrange, Act & Assert juntos
    expect(() => {
      userService.createUser('Menor', 'menor@email.com', 17);
    }).toThrow('O usuário deve ser maior de idade.');
  });

  // Refatoração 5: Implementação do teste que estava ignorado (skipped)
  test('deve retornar mensagem apropriada quando o relatório é gerado sem usuários cadastrados', () => {
    // Arrange (banco já limpo no beforeEach)
    
    // Act
    const relatorio = userService.generateUserReport();
    
    // Assert
    expect(relatorio).toContain('Nenhum usuário cadastrado');
  });
});