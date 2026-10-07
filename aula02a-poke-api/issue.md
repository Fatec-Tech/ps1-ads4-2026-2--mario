# [aula02a] Desafio: Implementar Modal de Detalhes Completo da Pokédex

## 🎯 Objetivo
Estender a aplicação base da Pokédex implementando um modal responsivo do Bootstrap 5. Ao clicar em qualquer card, o usuário poderá visualizar informações detalhadas do Pokémon selecionado sem recarregar a página.

## 📋 Requisitos

### Interatividade
- [ ] Tornar os cards clicáveis e indicar isso visualmente (`cursor: pointer`).
- [ ] Abrir o modal ao clicar no card.
- [ ] Permitir abrir o card por teclado (Enter/Espaço).

### Dados exibidos
- [ ] Exibir HP, Ataque, Defesa e Velocidade com barras de progresso.
- [ ] Listar as habilidades, identificando habilidades ocultas.
- [ ] Disponibilizar o áudio oficial (`cries.latest`, com fallback para `cries.legacy`).
- [ ] Exibir sprites normal e Shiny: frente e costas.
- [ ] Informar quando uma imagem ou áudio não estiver disponível.

### Carregamento e erros
- [ ] Exibir spinner dentro do modal durante a requisição.
- [ ] Tratar erros de forma amigável.
- [ ] Reutilizar dados em cache quando possível.

## 🛠️ Implementação
- HTML5, CSS3, JavaScript ES6+, Fetch API e Bootstrap 5.3.
- Uso de `async/await`, manipulação dinâmica do DOM e API JavaScript do Bootstrap.

## ✅ Critérios de aceite
- [ ] O modal abre ao clicar em qualquer Pokémon listado ou encontrado pela busca.
- [ ] Os quatro status aparecem com valor numérico e barra.
- [ ] Habilidades, áudio e galeria de sprites são apresentados.
- [ ] Carregamento e falhas têm feedback visual.
- [ ] Modal pode ser fechado e reaberto para outros Pokémon sem erro no console.

## Referências
- [Modal Bootstrap 5.3](https://getbootstrap.com/docs/5.3/components/modal/)
- [PokéAPI](https://pokeapi.co/)
