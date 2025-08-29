
function setupAddRepositoriosModal() {
  const modal = modalDashboard({
    title: 'Adicionar repositorio',
    content: `
      <form id="form-repositorio">
        <div class="form-group">
          <label for="repositorio-link-repositorio">Link Repositorio</label>
          <input type="text" id="repositorio-link-repositorio" required>
        </div>
        <div class="form-group">
          <label for="repositorio-diretorio">Diretorio</label>
          <input type="text" id="repositorio-diretorio" required>
        </div>
        <div class="form-group">
          <label for="repositorio-link-page">Link da Pagina</label>
          <input type="text" id="repositorio-link-page" required>
        </div>
        <div class="form-group switch-group">
          <label for="repositorio-status">Status</label>
          <label class="switch">
            <input type="checkbox" id="repositorio-status">
            <span class="slider round"></span>
          </label>
        </div>
      </form>
    `,
    buttons: [
      {
        text: 'Cancelar',
        class: 'cancel-btn',
        handler: () => modal.close()
      },
      {
        text: 'Salvar',
        class: 'save-btn',
        handler: async () => {
          const linkRepositorio = document.getElementById('repositorio-link-repositorio').value;
          const diretorio = document.getElementById('repositorio-diretorio').value;
          const linkPage = document.getElementById('repositorio-link-page').value;
          const status = document.getElementById('repositorio-status').checked ? 1 : 0;

          if (!linkRepositorio || !diretorio || !linkPage) {

            toastr.warning('Preencha todos os campos obrigatórios', 'Atenção!', {
                timeOut: 5000
            });
            return;
          }

          try {
            const response = await apiService.addRepositorios(linkRepositorio, diretorio, linkPage, status);
            toastr.success('repositorio adicionado com sucesso!', 'Sucesso', {
                timeOut: 5000
            });
            modal.close();
            const RepositoriosButton = document.getElementById('btn-repositorio');
            if (RepositoriosButton) {
              RepositoriosButton.click();
            }
          } catch (error) {
            console.error('Erro ao adicionar repositorio:', error);
            toastr.error(error.message || 'Erro ao adicionar repositorio', 'Erro', {
                timeOut: 5000
            });
          }
        }
      }
    ]
  });

  modal.open();
}
// Configura o event delegation
function setupGlobalEventListenersRepositorios() {
  // Event delegation para o botão de adicionar produto
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btn-adicionar-repositorio') {
      setupAddRepositoriosModal();
    }
  });
}

// Inicializa os listeners globais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersRepositorios);