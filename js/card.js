import { effects, cardEffects } from './effects.js';

export class Card {
  constructor(id, name, desc, effect){
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.effect = effect;
  }
  toHTML(){
    return `<div class="card"><h3>${this.name}</h3><p>${this.desc}</p></div>`;
  }
  execute(playerState, opponentState){
    if(typeof this.effect === 'function') this.effect(playerState, opponentState);
    if(Array.isArray(this.effect)) this.effect.forEach(e => { if(typeof e === 'function') e(playerState, opponentState); });
  }
}

export const DuliaDeck = [
    new Card('fur', 'Проти шерсті', 'Забирає 1 пет з себе', effects.removeModifier(1, {key:'pet', name:'Пет', desc:'Кількість разів що тебе петнули! Той, хто більше запетав ворога, виграв!'})),
    new Card('catpaw', 'Лапи кота', 'Отримує 5 ухилення', effects.buffSelf(5, {key:'evasion', name:'Ухилення', desc:'Зменшує шанс тебе петнути на 1% за пункт'})),
    new Card('suddenpetpet', 'Повітряний петпет', 'Магічна. Двічі петає ворога, ігноруючи усі модифікатори. Отримує 1 Лінь', effects.suddenPetPet),
    new Card('clone', 'Клони-ілюзії', 'Магічна. Петпетпетпетпет і отримує Лінь тричі', cardEffects.clone),
    new Card('mirage', 'Міраж', 'Магічна. Отримує 8 ухилення. Отримує 1 Лінь', cardEffects.mirage),
    new Card('motivation', 'Мотивація', 'Забирає 1 Лінь з себе', effects.removeModifier(1, {key:'laziness', name:'Лінь', desc:'Не дає грати Магічні карти. Падає на 1 за хід'})),
    new Card('shake', 'Обтруситися', 'Струшує з себе три пети і 5 ухилення, якщо є', cardEffects.shake),
    new Card('landing', 'Приземленість', 'Магічна. Отримує 1 Лінь та 1 Заземленість', cardEffects.landing),
]

export const OkelyarDeck = [
    new Card('watch', 'Нагляд', 'Отримує 1 Заряд та 1 Фокус', cardEffects.watch),
    new Card('comfort', 'Комфорт', 'Дає ворогу петнути тебе і отримує 3 Заряду', cardEffects.comfort),
    new Card('heavypet', 'Могутній пет', 'Один пет, що рахується на Заряд+1 петів. Втрачає всі Заряди', cardEffects.heavyPet),
    new Card('exchange', 'Обмін', 'Отримує 3 Фокуси. Обидва гравці петпетпетають одне одного.', cardEffects.exchange),
    new Card('vigor', 'Завзяття', 'Отримує 2 Завзяття', effects.buffSelf(2, {key:'vigor', name:'Завзяття', desc:'На початку ходу дає 1 Заряд за кожен пункт Завзяття та падає на 1'})),
    new Card('screech', 'Крик', 'Отримує стільки ухилення, скільки петів на собі. Інший гравець отримує 3 Фокуси', cardEffects.screech),
    new Card('unhinged', 'Нестримний', 'Отримує 6 Ухилення за Заряд. Втрачає всі Заряди', cardEffects.unhinged),
    new Card('bravado', 'Хвастощі', 'Знімає з ворога усю Лінь, надає 1 Фокус і петпетає за кожен Заряд на собі. Втрачає всі Заряди', cardEffects.bravado),
]
