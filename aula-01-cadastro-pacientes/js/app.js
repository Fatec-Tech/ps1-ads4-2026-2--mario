// Array que guarda os pacientes cadastrados (em memória, só nesta sessão)
const pacientes = [];

const pacientesSalvos = localStorage.getItem('pacientes');

if (pacientesSalvos) {
    pacientes.push(...JSON.parse(pacientesSalvos));
}

// Referências aos elementos do DOM que vamos usar várias vezes
const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const totalP = document.getElementById('total');
const filtro = document.getElementById('filtro');
const ordenarNome = document.getElementById('ordenarNome')

// Função responsável por adicionar um paciente ao array
function adicionarPaciente(nome, email, nascimento, telefone) {

  const emailExiste = pacientes.some((paciente) => {
    return paciente.email === email;
});

if (emailExiste) {
    alert("email já existe");
    return;
}

  console.log(telefone);
  const novoPaciente = { nome, email, nascimento, telefone };
  pacientes.push(novoPaciente);
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
}



// Função responsável por desenhar a tabela inteira a partir do array
function renderizarTabela(lista) {
  tabela.innerHTML = ''; // limpa a tabela antes de redesenhar

  lista.forEach((paciente) => {
    const linha = document.createElement('tr');


    linha.innerHTML = `
      <td>${paciente.nome}</td>
      <td>${paciente.email}</td>
      <td>${formatarData(paciente.nascimento)}</td>
      <td>${paciente.telefone}</td>
      <td>${calcularIdade(paciente.nascimento)}</td>
      <td><button>Remover</button></td>
    `;

    const botao = linha.querySelector('button');

    botao.addEventListener('click', () => {

      const indiceReal = pacientes.indexOf(paciente);

      pacientes.splice(indiceReal,1);

      localStorage.setItem('pacientes', JSON.stringify(pacientes));

      renderizarTabela(pacientes);

    });

    



    tabela.appendChild(linha);
  });

  totalP.textContent = `Total de pacientes: ${pacientes.length}`;
}

ordenarNome.addEventListener('click', ()=>{

pacientes.sort((a, b) => {
    return a.nome.localeCompare(b.nome);
});

 renderizarTabela(pacientes);
});

// Função utilitária só para formatar a data no padrão dd/mm/aaaa
function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function calcularIdade(nascimento){
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const novoAno = nascimento.split('-');
    const anoNascimento = novoAno[0];

    let idade = anoAtual - anoNascimento;

    const mesNascimento = novoAno[1];
    const diaNascimento = novoAno[2];

    const mesAtual = hoje.getMonth() + 1;
    const diaAtual = hoje.getDate();
    
    if(mesAtual < mesNascimento || mesAtual === mesNascimento && diaAtual < diaNascimento){
      idade--;
    }

    return idade;
}

filtro.addEventListener('input', ()=>{

  const texto = filtro.value;

  const pacientesFiltrados = pacientes.filter((paciente) => {

    return paciente.nome.toLowerCase().includes(texto.toLowerCase());

  });
  
  renderizarTabela(pacientesFiltrados);

 });



// Evento disparado quando o formulário é enviado
formulario.addEventListener('submit', (event) => {
  event.preventDefault(); // evita o recarregamento da página

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const nascimento = document.getElementById('nascimento').value;
  const telefone = document.getElementById('telefone').value;

  adicionarPaciente(nome, email, nascimento, telefone);
  renderizarTabela(pacientes);

  formulario.reset(); // limpa os campos do formulário
});

renderizarTabela(pacientes);