function setupGlobalEventListenersAcaoCloudfler() {
  document.addEventListener('click', function(event) {    
    // Adiciona o listener para o botão de alterar status
    if (event.target && event.target.id === 'btn-realizar-cloudfler') {
      event.preventDefault();
      enviarAlteracaoCloudfler(event.target);
    }
  });
}

// Função para alterar o status do repositorio
async function enviarAlteracaoCloudfler(button) {
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
    const response = await apiService.acaoCloudfler(idrepositorio, modo);
    
    toastr.success('Acao para cloudfler realizado com sucesso!', 'Sucesso', {
      timeOut: 5000
    });
    
    // Atualiza a interface conforme necessário
    const RepositoriosButton = document.getElementById('btn-acao-cloudfler');
    if (RepositoriosButton) {
      RepositoriosButton.click(); // Recarrega a lista de repositorios
    }
    
  } catch (error) {
    console.error('Erro ao enviar acao para cloudfler:', error);
    toastr.error(error.message || 'Erro ao enviar acao para cloudfler', 'Erro', {
      timeOut: 5000
    });
  }
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersAcaoCloudfler);