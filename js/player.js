import {Modifier} from './modifiers.js';

export class PlayerState {
  constructor(name){
    this.name = name;
    this.modifiers = new Map();
    this.deck = []; // main deck (cards available to draw)
    this.hand = []; // up to 4 cards
  }
  initModifier(mod){
    this.modifiers.set(mod.key, new Modifier(mod.key, mod.name, mod.amount, mod.desc))
  }
  returnModifier(key){
    return this.modifiers.get(key);
  }
  addModifier(n, mod){
    const pm = this.modifiers.get(mod.key);
    if(pm) {pm.add(n); return}
    this.modifiers.set(mod.key, new Modifier(mod.key, mod.name, n, mod.desc));
  }
  getModifiers(){
    return Array.from(this.modifiers.values());
  }

  // Deck/hand management
  addCardToDeck(card){
    this.deck.push(card);
  }
  shuffleDeck(){
    for(let i=this.deck.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }
  drawRandomToHand(){
    if(this.deck.length===0) return null;
    const idx = Math.floor(Math.random()*this.deck.length);
    const [card] = this.deck.splice(idx,1);
    this.hand.push(card);
    return card;
  }
  drawUpToHand(maxHand=4){
    while(this.hand.length < maxHand && this.deck.length>0){
      this.drawRandomToHand();
    }
  }
  playCardFromHand(index){
    if(index<0 || index>=this.hand.length) return null;
    const [card] = this.hand.splice(index,1);
    return card;
  }
  discardToDeck(card){
    if(!card) return;
    this.deck.push(card);
  }
}
