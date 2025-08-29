// Repositorio.js
document.addEventListener('DOMContentLoaded', () => {

    // Função para carregar Repositorio
    const loadRepositorio = async () => {

        const cabecalhoTableBody = document.getElementById('cabecalho-da-tabela');
        const tableBody = document.getElementById('corpo-da-tabela');
        const tituloBody = document.getElementById('titulo-pagina');
        const btnAddBody = document.getElementById('botao-adicao');
        const btnListaRepositorioBody = document.getElementById('div-repositorio');

        if (!tableBody) return;

        // Limpa o conteúdo atual
        cabecalhoTableBody.innerHTML = '';
        tableBody.innerHTML = '';
        tituloBody.innerHTML = '';
        btnAddBody.innerHTML = '';

        btnListaRepositorioBody.innerHTML = '<a href="#" id="btn-repositorio" class="menu-item"><span>Lista de Repositorios</span></a>';
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        btnListaRepositorioBody.querySelector('.menu-item').classList.add('active');

        cabecalhoTableBody.innerHTML = '<tr><th>Link</th><th>diretorio</th><th>Pagina</th><th>Status</th><th style="width: 240px;">Ações</th></tr>';

        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando Repositorio...</td></tr>';

        tituloBody.innerHTML = '<h2 id="titulo-pagina">Lista de Repositorios</h2>';

        btnAddBody.innerHTML = '<button id="btn-adicionar-repositorio" class="add-new-btn">Adicionar Repositorio</button>';

        try {
            // Faz a requisição para a API
            const response = await apiService.listaRepositorios();
            
            // Limpa a tabela novamente antes de adicionar os dados
            tableBody.innerHTML = '';

            if (!response.dados || response.dados.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum repositorio encontrado</td></tr>';
                return;
            }

            // Processa cada repositorio e adiciona à tabela
            response.dados.forEach(repositorio => {
                const row = document.createElement('tr');
                
                
                let status, btnStatus;
                
                if (repositorio.status === 1) {
                    // Status 1 e data válida: Ativo
                    status = '<span class="status-badge active">Ativo</span>';
                    btnStatus = `id-repositorio="${repositorio.id}" class="action-btn deactivate" acao="0">Desativar`;
                } else {
                    // Status 0: Inativo normal
                    status = '<span class="status-badge inactive">Inativo</span>';
                    btnStatus = `id-repositorio="${repositorio.id}" class="action-btn activate" acao="1">Ativar`;
                }
                
                row.innerHTML = `
                    <td>${repositorio.link_repositorio}</td>
                    <td>${repositorio.diretorio}</td>
                    <td>${repositorio.link_page}</td>
                    <td>${status}</td>
                    <td style="width: 280px;">
                        <button id="btn-editar-repositorio" id-repositorio="${repositorio.id}" class="action-btn edit">Editar</button>
                        <button id="btn-alterar-status-repositorio" ${btnStatus}</button>
                        <button id="btn-deletar-repositorio" id-repositorio="${repositorio.id}" class="action-btn delete">Excluir</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Erro ao carregar Repositorio:', error);
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Erro ao carregar repositorios: ${error.message}</td></tr>`;
            
            // Mostra notificação de erro
            toastr.error(error.message || 'Erro ao carregar repositorios', 'Erro', {
                timeOut: 5000
            });
        }
    };

    // Adiciona o event listener para o botão
    document.addEventListener('click', async (e) => {
        if (e.target.closest('#btn-repositorio')) {
            e.preventDefault();
            await loadRepositorio();
        }
    });

    // Chama a função para carregar os Repositorio quando a página é carregada
    loadRepositorio();
});