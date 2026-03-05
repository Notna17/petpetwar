export const effects = {
  generalPet: (player, opponent) => {
    let evadeChance = opponent.returnModifier('evasion')?.amount || 0;
    if ((player.returnModifier('focus')?.amount || 0) > 0) {
        evadeChance = 0;
        player.addModifier(-1, {key:'focus', name:'Фокус', desc:'Пети не можуть промахнутися. Падає на 1 за кожен пет'});
    }
    if(Math.random()*100 < evadeChance) return;
    opponent.addModifier(1, {key:'pet', name:'Пет', desc:'Кількість разів що тебе петнули! Той, хто більше запетав ворога, виграв!'});
  },
  inflictModifier: (n, modifier) => {
    return (player, opponent) => {
    opponent.addModifier(n, modifier);
  }},
  buffSelf: (n, modifier) => {
    return (player, opponent) => {
    player.addModifier(n, modifier);
  }},
  removeModifier: (n, mod) => {
    let reduced = n;
    return (player, opponent) => {
    if ((player.returnModifier('landing')?.amount || 0) > 0) { reduced += player.returnModifier('landing').amount; }
    if ((player.returnModifier(mod.key)?.amount || 0) > reduced) player.addModifier(-reduced, mod);
    else player.initModifier(mod);
  }}}
export const cardEffects = {
  suddenPetPet: (player, opponent) => {
    if ((player.returnModifier('laziness')?.amount || 0) > 0) return;
    opponent.addModifier(2, {key:'pet', name:'Пет', desc:'Кількість разів що тебе петнули! Той, хто більше запетав ворога, виграв!'});
    player.addModifier(1, {key:'laziness', name:'Лінь', desc:'Не дає грати Магічні карти. Падає на 1 за хід'});
  },
  clone: (player, opponent) => {
    if ((player.returnModifier('laziness')?.amount || 0) > 0) return;
    for(let i=0;i<5;i++) { effects.generalPet(player, opponent); }
    player.addModifier(3, {key:'laziness', name:'Лінь', desc:'Не дає грати Магічні карти. Падає на 1 за хід'});
  },
  mirage: (player, opponent) => {
    if ((player.returnModifier('laziness')?.amount || 0) > 0) return;
    player.addModifier(8, {key:'evasion', name:'Ухилення', desc:'Зменшує шанс тебе петнути на 1% за пункт'});
    player.addModifier(1, {key:'laziness', name:'Лінь', desc:'Не дає грати Магічні карти. Падає на 1 за хід'});
  },
  shake: (player, opponent) => {
    effects.removeModifier(3, {key:'pet', name:'Пет', desc:'Кількість разів що тебе петнули! Той, хто більше запетав ворога, виграв!'})(player, opponent);
    effects.removeModifier(5, {key:'evasion', name:'Ухилення', desc:'Зменшує шанс тебе петнути на 1% за пункт'})(player, opponent);
  },
  landing: (player, opponent) => {
    if ((player.returnModifier('laziness')?.amount || 0) > 0) return;
    player.addModifier(1, {key:'laziness', name:'Лінь', desc:'Не дає грати Магічні карти. Падає на 1 за хід'});
    player.addModifier(1, {key:'grounded', name:'Заземленість', desc:'Коли знімаєш з себе модифікатор, знімаєш більше за кожен пункт Заземленості'});
  },
  watch: (player, opponent) => {
    player.addModifier(1, {key:'charge', name:'Заряд', desc:'Витрачається для гри картами'});
    player.addModifier(1, {key:'focus', name:'Фокус', desc:'Пети не можуть промахнутися. Падає на 1 за кожен пет'});
  },
  comfort: (player, opponent) => {
    effects.generalPet(opponent, player);
    player.addModifier(3, {key:'charge', name:'Заряд', desc:'Витрачається для гри картами'});
  },
  heavyPet: (player, opponent) => {
    const charge = player.returnModifier('charge')?.amount || 0;
    const totalPet = charge + 1;
    effects.removeModifier(charge, {key:'charge', name:'Заряд', desc:'Витрачається для гри картами'})(player, opponent);
    let evadeChance = opponent.returnModifier('evasion')?.amount || 0;
    if ((player.returnModifier('focus')?.amount || 0) > 0) {
        evadeChance = 0;
        player.addModifier(-1, {key:'focus', name:'Фокус', desc:'Пети не можуть промахнутися. Падає на 1 за кожен пет'});
    }
    if(Math.random()*100 < evadeChance) return;
    opponent.addModifier(totalPet, {key:'pet', name:'Пет', desc:'Кількість разів що тебе петнули! Той, хто більше запетав ворога, виграв!'});
  },
  exchange: (player, opponent) => {
    player.addModifier(3, {key:'focus', name:'Фокус', desc:'Пети не можуть промахнутися. Падає на 1 за кожен пет'});
    for (let i=0;i<3;i++){
      effects.generalPet(player, opponent);
      effects.generalPet(opponent, player);
    }
  },
  screech: (player, opponent) => {
    const petCount = player.returnModifier('pet')?.amount || 0;
    player.addModifier(petCount, {key:'evasion', name:'Ухилення', desc:'Зменшує шанс тебе петнути на 1% за пункт'});
    opponent.addModifier(3, {key:'focus', name:'Фокус', desc:'Пети не можуть промахнутися. Падає на 1 за кожен пет'});
  },
  unhinged: (player, opponent) => {
    const charge = player.returnModifier('charge')?.amount || 0;
    const evadeBuff = charge * 6;
    player.addModifier(evadeBuff, {key:'evasion', name:'Ухилення', desc:'Зменшує шанс тебе петнути на 1% за пункт'});
    effects.removeModifier(charge, {key:'charge', name:'Заряд', desc:'Витрачається для гри картами'})(player, opponent);
  },
  bravado: (player, opponent) => {
    const charge = player.returnModifier('charge')?.amount || 0;
    opponent.addModifier(-opponent.returnModifier('laziness')?.amount || 0, {key:'laziness', name:'Лінь', desc:'Не дає грати Магічні карти. Падає на 1 за хід'});
    opponent.addModifier(1, {key:'focus', name:'Фокус', desc:'Пети не можуть промахнуться. Падає на 1 за кожен пет'});
    for(let i=0;i<charge*2;i++) {effects.generalPet(player, opponent)}
    effects.removeModifier(charge, {key:'charge', name:'Заряд', desc:'Витрачається для гри картами'})(player, opponent);
  }
};
