function setupGlobalEventListenersAcaoRepositorio() {
  document.addEventListener('click', function(event) {    
    // Adiciona o listener para o botão de alterar status
    if (event.target && event.target.id === 'btn-realizar-repositorio') {
      event.preventDefault();
      enviarAlteracaoRepositorio(event.target);
    }
  });
}

// Função para alterar o status do repositorio
async function enviarAlteracaoRepositorio(button) {
  const idrepositorio = button.getAttribute('id-repositorio');
  
  // Encontra a linha (tr) pai do botão
  const row = button.closest('tr');
  
  // Encontra o select dentro da mesma linha
  const select = row.querySelector('#acao');
  
  // Obtém o valor selecionado
  const modo = select ? select.value : null;
  
  // Verifica se foi selecionada uma opção válida
  if (!modo) {
    toastr.warning('Selecione uma ação antes de continuar', 'Aviso', {
      timeOut: 5000
    });
    return;
  }
  
  try {
    const response = await apiService.acaoRepositorio(idrepositorio, modo);
    
    toastr.success('Status do repositorio atualizado com sucesso!', 'Sucesso', {
      timeOut: 5000
    });
    
    // Atualiza a interface conforme necessário
    const RepositoriosButton = document.getElementById('btn-acao-repositorio');
    if (RepositoriosButton) {
      RepositoriosButton.click(); // Recarrega a lista de repositorios
    }
    
  } catch (error) {
    console.error('Erro ao alterar status do repositorio:', error);
    toastr.error(error.message || 'Erro ao alterar status do repositorio', 'Erro', {
      timeOut: 5000
    });
  }
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersAcaoRepositorio);