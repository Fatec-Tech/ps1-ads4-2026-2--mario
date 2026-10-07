const API_URL = 'https://pokeapi.co/api/v2/pokemon';

const pokemonGrid = document.getElementById('pokemonGrid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const pokemonModalElement = document.getElementById('pokemonModal');
const pokemonModalTitle = document.getElementById('pokemonModalTitle');
const pokemonModalBody = document.getElementById('pokemonModalBody');
const pokemonModal = bootstrap.Modal.getOrCreateInstance(pokemonModalElement);

// Mantém os dados já carregados para evitar requisições desnecessárias.
const pokemonCache = new Map();

// Busca os detalhes individuais de um Pokémon.
async function fetchPokemonData(urlOrName) {
	const value = String(urlOrName).trim();
	const url = /^https?:\/\//i.test(value)
		? value
		: `${API_URL}/${encodeURIComponent(value.toLowerCase())}`;

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			response.status === 404
				? 'Pokémon não encontrado.'
				: 'Não foi possível consultar a PokéAPI.'
		);
	}

	const pokemon = await response.json();
	pokemonCache.set(pokemon.id, pokemon);
	return pokemon;
}

// Carrega a lista inicial de Pokémon em paralelo.
async function loadInitialPokemon(limit = 20) {
	showLoading(true);
	pokemonGrid.innerHTML = '';

	try {
		const response = await fetch(`${API_URL}?limit=${limit}`);
		if (!response.ok) throw new Error('Não foi possível carregar a lista.');

		const data = await response.json();
		const pokemonList = await Promise.all(
			data.results.map((item) => fetchPokemonData(item.url))
		);

		pokemonList.forEach(renderPokemonCard);
	} catch (error) {
		showError('Erro ao carregar a lista de Pokémon. Verifique sua conexão e tente novamente.');
		console.error(error);
	} finally {
		showLoading(false);
	}
}

// Cria um card acessível e clicável.
function renderPokemonCard(pokemon) {
	const imageUrl =
		pokemon.sprites.other?.['official-artwork']?.front_default ||
		pokemon.sprites.front_default ||
		'';

	const typesBadges = pokemon.types
		.map((t) => `<span class="badge bg-secondary badge-type">${escapeHTML(t.type.name)}</span>`)
		.join('');

	const heightInMeters = (pokemon.height / 10).toFixed(1);
	const weightInKg = (pokemon.weight / 10).toFixed(1);

	const cardHTML = `
		<div class="col">
			<div
				class="card h-100 shadow-sm pokemon-card border-0"
				role="button"
				tabindex="0"
				aria-label="Ver detalhes de ${escapeHTML(pokemon.name)}"
				data-pokemon-id="${pokemon.id}"
			>
				<div class="text-center p-3 bg-white rounded-top">
					<img src="${imageUrl}" class="card-img-top img-fluid"
						style="max-height: 160px; object-fit: contain;"
						alt="${escapeHTML(pokemon.name)}">
				</div>
				<div class="card-body">
					<div class="d-flex justify-content-between align-items-center mb-2">
						<h5 class="card-title text-capitalize fw-bold m-0">${escapeHTML(pokemon.name)}</h5>
						<small class="text-muted">#${String(pokemon.id).padStart(3, '0')}</small>
					</div>
					<div class="mb-3">${typesBadges}</div>
					<div class="row text-center border-top pt-2">
						<div class="col-6 border-end">
							<small class="text-muted d-block">Altura</small>
							<strong>${heightInMeters} m</strong>
						</div>
						<div class="col-6">
							<small class="text-muted d-block">Peso</small>
							<strong>${weightInKg} kg</strong>
						</div>
					</div>
				</div>
			</div>
		</div>`;

	pokemonGrid.insertAdjacentHTML('beforeend', cardHTML);
}

// Delegação de eventos: também funciona para cards criados após uma busca.
pokemonGrid.addEventListener('click', (event) => {
	const card = event.target.closest('[data-pokemon-id]');
	if (card) openPokemonModal(Number(card.dataset.pokemonId));
});

pokemonGrid.addEventListener('keydown', (event) => {
	const card = event.target.closest('[data-pokemon-id]');
	if (card && (event.key === 'Enter' || event.key === ' ')) {
		event.preventDefault();
		openPokemonModal(Number(card.dataset.pokemonId));
	}
});

function showModalLoading(name = 'Detalhes do Pokémon') {
	pokemonModalTitle.textContent = name;
	pokemonModalBody.innerHTML = `
		<div class="text-center py-5">
			<div class="spinner-border text-danger" role="status">
				<span class="visually-hidden">Carregando...</span>
			</div>
			<p class="mt-3 mb-0">Buscando informações do Pokémon...</p>
		</div>`;
}

// Busca e apresenta os detalhes no modal.
async function openPokemonModal(id) {
	const cachedPokemon = pokemonCache.get(id);
	showModalLoading(cachedPokemon?.name || 'Carregando Pokémon');
	pokemonModal.show();

	try {
		const pokemon = cachedPokemon || await fetchPokemonData(id);
		renderPokemonModal(pokemon);
	} catch (error) {
		pokemonModalTitle.textContent = 'Não foi possível carregar';
		pokemonModalBody.innerHTML = `
			<div class="alert alert-warning mb-0" role="alert">
				${escapeHTML(error.message || 'Ocorreu um erro ao carregar os detalhes.')}
				Tente fechar o modal e abrir novamente.
			</div>`;
		console.error(error);
	}
}

function renderPokemonModal(pokemon) {
	pokemonModalTitle.textContent =
		`#${String(pokemon.id).padStart(3, '0')} — ${pokemon.name}`;

	const statNames = {
		hp: { label: 'HP', color: 'bg-success' },
		attack: { label: 'Ataque', color: 'bg-danger' },
		defense: { label: 'Defesa', color: 'bg-primary' },
		speed: { label: 'Velocidade', color: 'bg-warning' }
	};

	const statsHTML = pokemon.stats
		.filter((stat) => Object.hasOwn(statNames, stat.stat.name))
		.map((stat) => {
			const config = statNames[stat.stat.name];
			const value = stat.base_stat;
			// Escala visual limitada a 100%; o valor real continua aparecendo.
			const percentage = Math.min(value, 100);
			return `
				<div class="mb-3">
					<div class="d-flex justify-content-between align-items-center mb-1">
						<small class="fw-bold">${config.label}</small>
						<small class="text-muted">${value}</small>
					</div>
					<div class="progress" style="height: 10px;" aria-label="${config.label}: ${value}">
						<div class="progress-bar ${config.color}" role="progressbar"
							style="width: ${percentage}%"
							aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100">
						</div>
					</div>
				</div>`;
		})
		.join('');

	const abilitiesHTML = pokemon.abilities.length
		? pokemon.abilities.map(({ ability, is_hidden }) => `
			<span class="badge ${is_hidden ? 'bg-dark' : 'bg-secondary'} me-1 mb-1">
				${escapeHTML(ability.name.replaceAll('-', ' '))}${is_hidden ? ' (oculta)' : ''}
			</span>`).join('')
		: '<span class="text-muted">Nenhuma habilidade disponível.</span>';

	const sprites = [
		{ label: 'Frente — Normal', url: pokemon.sprites.front_default },
		{ label: 'Costas — Normal', url: pokemon.sprites.back_default },
		{ label: 'Frente — Shiny', url: pokemon.sprites.front_shiny },
		{ label: 'Costas — Shiny', url: pokemon.sprites.back_shiny }
	];

	const spritesHTML = sprites.map(({ label, url }) => `
		<div class="col-6 col-sm-3 text-center">
			<div class="border rounded p-2 h-100">
				${url
					? `<img class="sprite-image" src="${url}" alt="${label} de ${escapeHTML(pokemon.name)}">`
					: '<div class="sprite-image d-flex align-items-center justify-content-center text-muted small">Indisponível</div>'}
				<small class="d-block text-muted">${label}</small>
			</div>
		</div>`).join('');

	const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy;
	const audioHTML = cryUrl
		? `<audio class="w-100" controls preload="none">
				<source src="${cryUrl}" type="audio/ogg">
				Seu navegador não suporta áudio HTML5.
			</audio>`
		: '<p class="text-muted mb-0">Áudio não disponível para este Pokémon.</p>';

	pokemonModalBody.innerHTML = `
		<div class="text-center mb-4">
			<img
				src="${pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || ''}"
				alt="${escapeHTML(pokemon.name)}"
				class="img-fluid"
				style="max-height: 180px; object-fit: contain;"
			>
			<div class="text-capitalize text-muted">${pokemon.types.map((t) => escapeHTML(t.type.name)).join(' · ')}</div>
			<div class="small text-muted mt-1">Altura: ${(pokemon.height / 10).toFixed(1)} m · Peso: ${(pokemon.weight / 10).toFixed(1)} kg</div>
		</div>

		<section class="mb-4" aria-labelledby="statsHeading">
			<h6 class="fw-bold border-bottom pb-2" id="statsHeading">Status base</h6>
			${statsHTML}
		</section>

		<section class="mb-4" aria-labelledby="abilitiesHeading">
			<h6 class="fw-bold border-bottom pb-2" id="abilitiesHeading">Habilidades</h6>
			<div>${abilitiesHTML}</div>
		</section>

		<section class="mb-4" aria-labelledby="cryHeading">
			<h6 class="fw-bold border-bottom pb-2" id="cryHeading">Som do Pokémon</h6>
			${audioHTML}
		</section>

		<section aria-labelledby="spritesHeading">
			<h6 class="fw-bold border-bottom pb-2" id="spritesHeading">Galeria de sprites</h6>
			<div class="row g-2">${spritesHTML}</div>
		</section>`;
}

// Busca específica por nome ou ID.
async function handleSearch() {
	const query = searchInput.value.trim();
	if (!query) {
		loadInitialPokemon();
		return;
	}

	showLoading(true);
	pokemonGrid.innerHTML = '';

	try {
		const pokemon = await fetchPokemonData(query);
		renderPokemonCard(pokemon);
	} catch (error) {
		showError(`Nenhum Pokémon encontrado com o termo "${query}".`);
	} finally {
		showLoading(false);
	}
}

function showLoading(state) {
	loading.classList.toggle('d-none', !state);
}

function showError(message) {
	pokemonGrid.innerHTML = `
		<div class="col-12">
			<div class="alert alert-warning text-center" role="alert">
				${escapeHTML(message)}
			</div>
		</div>`;
}

// Evita inserir texto vindo da API diretamente como HTML.
function escapeHTML(value) {
	return String(value).replace(/[&<>"']/g, (char) => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	})[char]);
}

// Eventos da busca.
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') handleSearch();
});

// Inicialização.
loadInitialPokemon();
