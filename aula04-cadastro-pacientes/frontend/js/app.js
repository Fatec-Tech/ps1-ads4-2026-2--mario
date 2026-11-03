
const API_URL = 'https://api-clinica-mario.onrender.com/pacientes';

// Elementos da página
const formulario = document.getElementById('form-paciente');
//const tabela = document.querySelector('#tabela-pacientes tbody');
const tabela = document.getElementById('tabela-pacientes');
const mensagem = document.getElementById('mensagem');
const carregando = document.getElementById('carregando');

const campoId = document.getElementById('id');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoNascimento = document.getElementById('nascimento');

// Exibe mensagens na tela
function mostrarMensagem(texto, erro = false) {
    mensagem.textContent = texto;
    mensagem.style.color = erro ? 'red' : 'green';

    setTimeout(() => {
        mensagem.textContent = '';
    }, 3000);
}

// Formata a data para exibição
function formatarData(data) {
    if (!data) return '';

    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Lista os pacientes
async function listarPacientes() {
    try {
        carregando.textContent = 'Carregando pacientes...';

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar pacientes');
        }

        const pacientes = await resposta.json();

        tabela.innerHTML = '';

        if (pacientes.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="5">Nenhum paciente cadastrado.</td>
                </tr>
            `;
            return;
        }

        pacientes.forEach(paciente => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>${paciente.id}</td>
                <td>${paciente.nome}</td>
                <td>${paciente.email}</td>
                <td>${formatarData(paciente.nascimento)}</td>
                <td>
                    <button class="btn btn-warning btn-sm editar"
                        data-id="${paciente.id}">
                        Editar
                    </button>

                    <button class="btn btn-danger btn-sm excluir"
                        data-id="${paciente.id}">
                        Excluir
                    </button>
                </td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        mostrarMensagem('Erro ao carregar pacientes.', true);
        console.error(erro);
    } finally {
        carregando.textContent = '';
    }
}

// Cadastra ou atualiza um paciente
formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const id = campoId.value;

    const paciente = {
        nome: campoNome.value,
        email: campoEmail.value,
        nascimento: campoNascimento.value
    };

    try {
        const resposta = await fetch(
            id ? `${API_URL}/${id}` : API_URL,
            {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paciente)
            }
        );

        if (!resposta.ok) {
            const dados = await resposta.json();
            throw new Error(dados.erro || 'Erro ao salvar paciente');
        }

        mostrarMensagem(
            id ? 'Paciente atualizado!' : 'Paciente cadastrado!'
        );

        formulario.reset();
        campoId.value = '';

        await listarPacientes();

    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
});

// Identifica os cliques nos botões da tabela
tabela.addEventListener('click', async (evento) => {
    const botao = evento.target;

    if (botao.classList.contains('editar')) {
        const id = botao.dataset.id;

        try {
            const resposta = await fetch(`${API_URL}/${id}`);

            if (!resposta.ok) {
                throw new Error('Paciente não encontrado');
            }

            const paciente = await resposta.json();

            campoId.value = paciente.id;
            campoNome.value = paciente.nome;
            campoEmail.value = paciente.email;
            campoNascimento.value = paciente.nascimento;

            mostrarMensagem('Edite os dados e clique em salvar.');

        } catch (erro) {
            mostrarMensagem(erro.message, true);
        }
    }

    if (botao.classList.contains('excluir')) {
        const id = botao.dataset.id;

        if (!confirm('Deseja realmente excluir este paciente?')) {
            return;
        }

        try {
            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!resposta.ok) {
                throw new Error('Erro ao excluir paciente');
            }

            mostrarMensagem('Paciente excluído!');
            await listarPacientes();

        } catch (erro) {
            mostrarMensagem(erro.message, true);
        }
    }
});

// Carrega os pacientes ao abrir a página
listarPacientes();
