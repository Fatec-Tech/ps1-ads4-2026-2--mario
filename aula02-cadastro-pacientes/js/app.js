const pacientes = [];

let totalPacientesJSON = 0;
let totalPacientesManuais = 0;

const formulario = document.getElementById('form-paciente');

const tabela = document.getElementById('tabela-pacientes');

const tabelaCompleta = document.getElementById('tabela');

const mensagemCarregando = document.getElementById('carregando');

const mensagemErro = document.getElementById('mensagem-erro');

const mensagemVazia = document.getElementById('mensagem-vazia');

const contadores = document.getElementById('contadores');

const totalJSON = document.getElementById('total-json');

const totalManual = document.getElementById('total-manual');

function adicionarPaciente(nome, email, nascimento, origem = 'manual') {

pacientes.push({
    nome,
    email,
    nascimento,
    origem
});

}

function renderizarTabela() {

tabela.innerHTML = '';

if (pacientes.length === 0) {

    tabelaCompleta.classList.add('d-none');

    mensagemVazia.classList.remove('d-none');

} else {

    tabelaCompleta.classList.remove('d-none');

    mensagemVazia.classList.add('d-none');

    pacientes.forEach((paciente) => {

        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${paciente.nome}</td>
            <td>${paciente.email}</td>
            <td>${formatarData(paciente.nascimento)}</td>
        `;

        tabela.appendChild(linha);

    });

}

atualizarContadores();

}

function atualizarContadores() {

totalJSON.textContent = totalPacientesJSON;

totalManual.textContent = totalPacientesManuais;

contadores.classList.remove('d-none');

}

function formatarData(dataISO) {

const [ano, mes, dia] = dataISO.split('-');

return `${dia}/${mes}/${ano}`;

}

function esperar(tempo) {

return new Promise((resolve) => {

    setTimeout(resolve, tempo);

});

}

async function carregarPacientesIniciais() {

try {

    mensagemCarregando.textContent = 'Carregando pacientes...';

    mensagemCarregando.classList.remove('d-none');

    mensagemErro.classList.add('d-none');

    mensagemVazia.classList.add('d-none');

    tabelaCompleta.classList.add('d-none');

    contadores.classList.add('d-none');


    // Simulação de latência de 1 segundo

    await esperar(1000);


    const resposta = await fetch('data/pacientes.json');

    console.log(resposta);


    // Verifica se houve erro na resposta HTTP

    if (!resposta.ok) {

        throw new Error(`Erro HTTP: ${resposta.status}`);

    }


    const dados = await resposta.json();


    // Verifica se o JSON retornou uma lista vazia

    if (dados.length === 0) {

        mensagemCarregando.classList.add('d-none');

        tabelaCompleta.classList.add('d-none');

        mensagemVazia.classList.remove('d-none');

        contadores.classList.remove('d-none');

        atualizarContadores();

        return;

    }


    // Adiciona os pacientes vindos do JSON

    dados.forEach((paciente) => {

        adicionarPaciente(
            paciente.nome,
            paciente.email,
            paciente.nascimento,
            'json'
        );

        totalPacientesJSON++;

    });


    renderizarTabela();


    mensagemCarregando.textContent =
        'Dados carregados com sucesso.';


} catch (erro) {

    console.error(
        'Não foi possível carregar os pacientes:',
        erro
    );


    tabelaCompleta.classList.add('d-none');

    contadores.classList.add('d-none');

    mensagemVazia.classList.add('d-none');


    mensagemCarregando.classList.add('d-none');


    mensagemErro.textContent =
        'Não foi possível carregar os pacientes. Verifique se o arquivo pacientes.json está disponível e tente novamente.';


    mensagemErro.classList.remove('d-none');

}

}

formulario.addEventListener('submit', (event) => {

event.preventDefault();


const nome =
    document.getElementById('nome').value;

const email =
    document.getElementById('email').value;

const nascimento =
    document.getElementById('nascimento').value;


adicionarPaciente(
    nome,
    email,
    nascimento,
    'manual'
);


totalPacientesManuais++;


renderizarTabela();


formulario.reset();

});

carregarPacientesIniciais();