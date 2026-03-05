export class Modifier {
  constructor(key, name, amount=0, desc=''){
    this.key = key;
    this.name = name;
    this.amount = amount;
    this.desc = desc;
  }
  label(){
    return `${this.name}: ${this.amount}`;
  }
  add(n){
    this.amount += n;
  }
  set(n){
    this.amount = n;
  }
}
