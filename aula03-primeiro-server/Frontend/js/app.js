const pacientes = [];

// exercicio 2 issue #3
let pacientesJSON = 0;
let pacientesManuais = 0;
// 

const formulario = document.getElementById('form-paciente');
const tabela = document.getElementById('tabela-pacientes');
const mensagemCarregando = document.getElementById('carregando');
// exercicio 2 issue #3
const contadorJSON = document.getElementById('contador-json');
const contadorManual = document.getElementById('contador-manual');
// 
// exercicio 3 - issue #3
const mensagemListaVazia = document.getElementById('lista-vazia')


function adicionarPaciente(nome, email, nascimento) {
	pacientes.push({ nome, email, nascimento });
}

//atualiza texto dos contadores contadores - exercicio 2 issue #3
function atualizarContadores(){
	contadorJSON.textContent = `Pacientes do arquivo JSON: ${pacientesJSON}`

	contadorManual.textContent = `Cadastrados manualmente: ${pacientesManuais}`
}
//

function renderizarTabela() {
	tabela.innerHTML = '';

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

function formatarData(dataISO) {
	const [ano, mes, dia] = dataISO.split('-');
	return `${dia}/${mes}/${ano}`;
}

const URL_API = 'http://localhost:3000/pacientes';


// Nova função: busca os pacientes iniciais a partir do arquivo JSON
async function carregarPacientesIniciais() {
	try {

		// simula a latencia por 1 segundo - exercicio 1 issue #3
		await new Promise(resolve => setTimeout(resolve, 1000));
		// 

		const resposta = await fetch(URL_API);
		console.log(resposta);

		// Nem toda resposta é sucesso — precisamos checar antes de usar
		if (!resposta.ok) {
			throw new Error(`Erro HTTP: ${resposta.status}`);
		}

		const dados = await resposta.json(); // converte a resposta em objeto JS

		//quantidade de pacientes vindos de JSON - exercicio 2 issue #3
		pacientesJSON = dados.length;
		//
		
		// exercicio 3 - issue #3
		if (dados.length === 0){
			mensagemListaVazia.textContent = 'Nenhum paciente cadastrado ainda.';

		tabela.style.display = 'none';
		} else{
			mensagemListaVazia.textContent = '';
			tabela.style.display = '';

			dados.forEach((paciente)=>{
				adicionarPaciente(
					paciente.nome,
					paciente.email,
					paciente.nascimento
				);
			});

			renderizarTabela();
		}

		atualizarContadores();

	} catch (erro) {
		console.error(
			'Nao foi possivel carregar os pacientes.',
			erro
		);

		mensagemCarregando.textContent = 'Erro ao carregar pacientes. Veja o console para mais detalhes.'

		return;
	}

	mensagemCarregando.textContent = 'Dados carregados com sucesso.';

}
//

		// // Adiciona cada paciente vindo do arquivo ao nosso array local
		// dados.forEach((paciente) => {
		// 	adicionarPaciente(paciente.nome, paciente.email, paciente.nascimento);
		// });

		// renderizarTabela();

		// // exercicio 2 issue #3
		// atualizarContadores();
		// //

// 	} catch (erro) {
// 		console.error('Não foi possível carregar os pacientes:', erro);
// 		mensagemCarregando.textContent =
// 			'Erro ao carregar pacientes. Veja o console para mais detalhes.';
// 		return; // sai da função sem esconder a mensagem de erro
// 	}

// 	mensagemCarregando.textContent =
// 		'Dados carregados com sucesso.';
// 	// mensagemCarregando.style.display = 'none'; // esconde "Carregando..." em caso de sucesso
// }

formulario.addEventListener('submit', (event) => {
	event.preventDefault();

	const nome = document.getElementById('nome').value;
	const email = document.getElementById('email').value;
	const nascimento = document.getElementById('nascimento').value;

	adicionarPaciente(nome, email, nascimento);
	// exercicio 2 issue #3
	pacientesManuais++;	
	//
	renderizarTabela();

	// exercicio 2 issue #3
	atualizarContadores();
	//

	formulario.reset();
});

// Assim que o script carrega, já dispara a busca dos dados iniciais
carregarPacientesIniciais();
