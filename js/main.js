import {PlayerState} from './player.js';
import {effects} from './effects.js';
import { DuliaDeck, OkelyarDeck } from './card.js';

const players = [ new PlayerState('Дуля'), new PlayerState('Океляр') ];

let currentTurn = 0;
let selected = {playerIndex:null, cardIndex:null};
let turnActivated = false;
let turnCount = 0;
let gameOver = false;

function DeckCreation(){
    DuliaDeck.forEach(card => {players[0].addCardToDeck(card)});
    OkelyarDeck.forEach(card => {players[1].addCardToDeck(card)});
    players.forEach(p => p.shuffleDeck());
}

function renderAll(){
  document.getElementById('turnPlayer').textContent = players[currentTurn].name;
  document.getElementById('turnCount').textContent = turnCount ? `Ходи: ${turnCount}` : '';

  for(let p=0;p<2;p++){
    const modsEl = document.getElementById(`mods-player${p+1}`);
    modsEl.innerHTML='';
    players[p].getModifiers().forEach(mod=>{
      const span = document.createElement('span');
      span.className = 'modifier';
      span.title = mod.desc;
      span.textContent = mod.label()
      modsEl.appendChild(span);
    });

    const cardsEl = document.getElementById(`cards-player${p+1}`);
    cardsEl.innerHTML='';
    // show player's hand only when game started; only current player sees their hand
    const hand = players[p].hand;
    hand.forEach((card, idx)=>{
      const btn = document.createElement('button');
      btn.textContent = card.name;
      btn.title = card.desc;
      btn.dataset.player = p;
      btn.dataset.index = idx;
      btn.addEventListener('click', ()=> selectCard(p, idx));
      if(!turnActivated) btn.classList.add('hidden');
      else if(p !== currentTurn) btn.classList.add('hidden');
      cardsEl.appendChild(btn);
    });
  }
  updateSelectedDisplay();
  updateToggleButton();
}

function selectCard(playerIndex, cardIndex){
  if(!turnActivated) return;
  if(playerIndex !== currentTurn) return; // only current player can select
  selected.playerIndex = playerIndex;
  selected.cardIndex = cardIndex;
  updateSelectedDisplay();
}

function updateSelectedDisplay(){
  const container = document.getElementById('selectedCard');
  if(selected.playerIndex===null){
    container.innerHTML = '<em>Жодної карти не обрано.</em>';
    return;
  }
  const card = players[selected.playerIndex].hand[selected.cardIndex];
  container.innerHTML = card.toHTML() + `<div style="margin-top:8px;font-size:90%"><strong>Власник:</strong> ${players[selected.playerIndex].name}</div>`;
}

function updateToggleButton(){
  const btn = document.getElementById('toggleTurnBtn');
  btn.textContent = turnActivated ? 'Закінчити хід' : 'Почати хід';
}

document.getElementById('playBtn').addEventListener('click', ()=>{
  if(!turnActivated || selected.playerIndex===null) return;
  const player = players[selected.playerIndex];
  const opponent = players[(selected.playerIndex+1)%2];
  if(!player) return;
  const card = player.playCardFromHand(selected.cardIndex);
  if(!card) return;
  // execute card effect (effect is function)
  if(typeof card.effect === 'function') card.effect(player, opponent, card);
  // discard into deck
  player.discardToDeck(card);
  selected = {playerIndex:null, cardIndex:null};
  renderAll();
});

document.getElementById('petBtn').addEventListener('click', ()=>{
  if(!turnActivated || selected.playerIndex===null) return;
  const player = players[selected.playerIndex];
  const opponent = players[(selected.playerIndex+1)%2];
  if(!player) return;
  const card = player.playCardFromHand(selected.cardIndex);
  if(!card) return;
  effects.generalPet(player, opponent, card);
  player.discardToDeck(card);
  selected = {playerIndex:null, cardIndex:null};
  renderAll();
});

document.getElementById('toggleTurnBtn').addEventListener('click', ()=>{
  if(!turnActivated){
    turnActivated = true;
    // fill current player's hand
    players[currentTurn].drawUpToHand(4);
    if (players[currentTurn].returnModifier('laziness')?.amount > 0) players[currentTurn].addModifier(-1, {key:'laziness', name:'Лінь', desc:'Не дає грати Магічні карти. Падає на 1 за хід'});
    const vigorAmt = players[currentTurn].returnModifier('vigor')?.amount || 0;
    if (vigorAmt > 0) {
      players[currentTurn].addModifier(vigorAmt, {key:'charge', name:'Заряд', desc:'Витрачається для гри картами'});
      players[currentTurn].addModifier(-1, {key:'vigor', name:'Завзяття', desc:'На початку ходу дає 1 Заряд за кожен пункт Завзяття та падає на 1'});
    }
    renderAll();
    return;
  }
  turnCount++;
  // end game at 10 turns
  if(turnCount >= 10){
    // compute how many petpets each player inflicted
    const inflictedBy0 = players[1].returnModifier('pet')?.amount || 0; // pets on player1 inflicted by player0
    const inflictedBy1 = players[0].returnModifier('pet')?.amount || 0; // pets on player0 inflicted by player1
    let resultMessage = `Гра завершена після ${turnCount} ходів.\n`;
    resultMessage += `${players[0].name} наніс(ла) ворогу: ${inflictedBy0} петів\n`;
    resultMessage += `${players[1].name} наніс(ла) ворогу: ${inflictedBy1} петів\n`;
    if(inflictedBy0 > inflictedBy1) resultMessage += `Переможець: ${players[0].name}`;
    else if(inflictedBy1 > inflictedBy0) resultMessage += `Переможець: ${players[1].name}`;
    else resultMessage += `Нічия`;
    alert(resultMessage);
    gameOver = true;
    selected = {playerIndex:null, cardIndex:null};
    turnActivated = false;
    // disable action buttons
    document.getElementById('playBtn').disabled = true;
    document.getElementById('petBtn').disabled = true;
    const tb = document.getElementById('toggleTurnBtn');
    tb.textContent = 'Гра завершена';
    tb.disabled = true;
    renderAll();
    return;
  }
  currentTurn = (currentTurn+1) % players.length;
  selected = {playerIndex:null, cardIndex:null};
  turnActivated = false;
  renderAll();
});

DeckCreation();
renderAll();
