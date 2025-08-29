// AcaoRepositorio.js
document.addEventListener('DOMContentLoaded', () => {
    
    document.addEventListener('click', async (e) => {
        if (e.target.closest('#btn-acoes-cloudfler')) {
            e.preventDefault();
            await loadAcaoCloudfler();
        }
    });


    const loadAcaoCloudfler = async () => {
        // Continua com o carregamento do layout (com ou sem confirmação)
        const cabecalhoTableBody = document.getElementById('cabecalho-da-tabela');
        const tableBody = document.getElementById('corpo-da-tabela');
        const tituloBody = document.getElementById('titulo-pagina');
        const btnAddBody = document.getElementById('botao-adicao');
        const btnAcaoRepositorioBody = document.getElementById('div-acoes-cloudfler');

        if (!tableBody) return;

        // Limpa o conteúdo atual

        cabecalhoTableBody.innerHTML = '';
        tableBody.innerHTML = '';
        tituloBody.innerHTML = '';
        btnAddBody.innerHTML = '';

        btnAcaoRepositorioBody.innerHTML = '<a href="#" id="btn-acoes-cloudfler" class="menu-item active"><span>Limpar Cache</span></a>';

        cabecalhoTableBody.innerHTML = '<tr><th>Operacão</th><th>Pagina</th><th>Status</th><th style="width: 240px;">Ações</th></tr>';

        tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Carregando dados...</td></tr>';

        tituloBody.innerHTML = '<h2 id="titulo-pagina">Açoes Cloudfler</h2>';

        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        btnAcaoRepositorioBody.querySelector('.menu-item').classList.add('active');

        try {
            // Faz a requisição para a API
            const response = await apiService.listaRepositorios();
            
            // Limpa a tabela novamente antes de adicionar os dados
            tableBody.innerHTML = '';

            if (!response.dados || response.dados.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum dado encontrado</td></tr>';
                return;
            }

            // Processa cada layout e adiciona à tabela
            response.dados.forEach(layout => {
                const row = document.createElement('tr');
                
                const status = layout.status === 1 ? 
                    '<span class="status-badge active">Ativo</span>' : 
                    '<span class="status-badge inactive">Inativo</span>';

                const btnStatus = layout.status === 1 ? 
                    'class="action-btn deactivate" acao="0" >Desativar' : 
                    'class="action-btn activate" acao="1">Ativar';

                row.innerHTML = `
                    <td><select class="custom-select" id="acao">
                        <option value="" selected disabled>Selecione uma ação</option>
                        <option value="1">Limpar Tudo</option>
                        <option value="2">Limpar Link</option>
                    </select></td>
                    <td>${layout.link_page}</td>
                    <td>${status}</td>
                    <td style="width: 280px;">
                        <button id="btn-realizar-cloudfler" id-repositorio="${layout.id}" class="action-btn edit">Realizar Operacao</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Erro ao carregar layouts:', error);
            tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-danger">Erro ao carregar layouts: ${error.message}</td></tr>`;
            
            // Mostra notificação de erro
            toastr.error(error.message || 'Erro ao carregar layouts', 'Erro', {
                timeOut: 5000
            });
        }
    };
});