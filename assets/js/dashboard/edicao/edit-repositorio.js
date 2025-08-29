async function setupEditRepositorio(button) {
  // Obtém o ID do anúncio do atributo do botão
  const idrepositorio = button.getAttribute('id-repositorio');
  
  try {
    // Busca os dados do anúncio
    const response = await apiService.listaRepositorios(idrepositorio);
    const repositorio = response.dados;
    const idRandom = Math.random();
        
    // Cria o modal com os dados preenchidos e IDs dinâmicos
    const modal = modalDashboard({
      title: 'Editar Repositorio',
      content: `
        <form id="form-repositorio-${idRandom}">
          <div class="form-group">
            <label for="repositorio-link_repositorio-${idRandom}">Link Repositorio</label>
            <input type="text" id="repositorio-link_repositorio-${idRandom}" value="${repositorio.link_repositorio || ''}" required>
          </div>
          <div class="form-group">
            <label for="repositorio-diretorio-${idRandom}">Diretorio</label>
            <input type="text" id="repositorio-diretorio-${idRandom}" value="${repositorio.diretorio || ''}" required>
          </div>
          <div class="form-group">
            <label for="repositorio-link_page-${idRandom}">Link da Pagina</label>
            <input type="text" id="repositorio-link_page-${idRandom}" value="${repositorio.link_page || ''}" required>
          </div>
          <div class="form-group switch-group">
            <label for="repositorio-status-${idRandom}">Status</label>
            <label class="switch">
              <input type="checkbox" id="repositorio-status-${idRandom}" ${repositorio.status == 1 ? 'checked' : ''}>
              <span class="slider round" id="repositorio-status2-${idRandom}"></span>
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
            const link_repositorio = document.getElementById(`repositorio-link_repositorio-${idRandom}`).value;
            const diretorio = document.getElementById(`repositorio-diretorio-${idRandom}`).value;
            const link_page = document.getElementById(`repositorio-link_page-${idRandom}`).value;
            const status = document.getElementById(`repositorio-status-${idRandom}`).checked ? 1 : 0;

            if (!link_repositorio || !diretorio || !link_page) {
              toastr.warning('Preencha todos os campos obrigatórios', 'Atenção!', {
                timeOut: 5000
              });
              return;
            }

            try {
              const response = await apiService.editRepositorio(
                idrepositorio,
                status, 
                link_repositorio, 
                diretorio,
                link_page
              );
              
              toastr.success('Repositorio atualizado com sucesso!', 'Sucesso', {
                timeOut: 5000
              });
              
              modal.close();
              const RepositoriosButton = document.getElementById('btn-repositorio');
              if (RepositoriosButton) {
                RepositoriosButton.click();
              }
            } catch (error) {
              console.error('Erro ao atualizar repositorio:', error);
              toastr.error(error.message || 'Erro ao atualizar repositorio', 'Erro', {
                timeOut: 5000
              });
            }
          }
        }
      ]
    });

    modal.open();
    
  } catch (error) {
    console.error('Erro ao carregar dados do repositorio:', error);
    toastr.error('Erro ao carregar dados do repositorio', 'Erro', {
      timeOut: 5000
    });
  }
}

// Configura o event delegation
function setupGlobalEventListenersProdCardapio() {
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'btn-editar-repositorio') {
      setupEditRepositorio(event.target);
    }
    
    // Adiciona o listener para o botão de alterar status
    if (event.target && event.target.id === 'btn-alterar-status-repositorio') {
      event.preventDefault();
      alterarStatusrepositorio(event.target);
    }
  });
}

// Função para alterar o status do repositorio
async function alterarStatusrepositorio(button) {
  const idrepositorio = button.getAttribute('id-repositorio');
  const status = button.getAttribute('acao'); // 1 para ativar, 0 para desativar
  
  try {
    const response = await apiService.editRepositorio(idrepositorio, status);
    
    toastr.success('Status do repositorio atualizado com sucesso!', 'Sucesso', {
      timeOut: 5000
    });
    
    // Atualiza a interface conforme necessário
    const RepositoriosButton = document.getElementById('btn-repositorio');
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
document.addEventListener('DOMContentLoaded', setupGlobalEventListenersProdCardapio);