import { EntityRepository, Repository, getCustomRepository } from "typeorm";

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
 
  public async getBalance(): Promise<Transaction[]> {
    const transactions = await this.find({relations:["category"]});
    
    return transactions; 
  }

  public async getBalanceSimple(): Promise<Transaction[]> {
    const transactions = await this.find();
    
    return transactions; 
  }

  public async getFinalBalance(): Promise<Balance> {
    const transactions = await this.find({relations:["category"]});
    const positiveValues = transactions.map(obj => obj.type==="income"?Number(obj.value):0);
    const negativeValues = transactions.map(obj => obj.type==="outcome"?Number(obj.value):0);
    const income = (positiveValues.length > 0) ? positiveValues.reduce(this.getIncome): 0;
    const outcome = (negativeValues.length > 0) ? negativeValues.reduce(this.getOutcome):0;
    const total = income-outcome;
    return {income,outcome,total}; 
  }

  public async getExtract(){
    const transactions = await this.getBalance();
    const balance =  await this.getFinalBalance(); 
    const extract = { transactions, balance}
    return extract;
  }

  private getIncome(total:number, num:number){
    if (num > 0){
      return total + num;
    }
    return total;
  }

  private getOutcome(total:number, num:number){
    if (num > 0){
      return total + num;
    }
    return total;
  }


}

export default TransactionsRepository;
