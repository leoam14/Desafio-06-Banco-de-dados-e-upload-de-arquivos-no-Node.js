// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository'
import { getCustomRepository } from 'typeorm';
import CategoriesRepository from '../repositories/CategoriesRepository'
import AppError from '../errors/AppError';

interface requestDTO{
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({title,type,value,category}:requestDTO): Promise<Transaction> {
    
    
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const {income,outcome,total} = await transactionsRepository.getFinalBalance();

    if (type === "outcome" && value > total){
      throw new AppError("Total Balance is not enought", 400);
    }

    const category_Entity = await categoriesRepository.getCategory(category);
    const category_id = category_Entity.id;


    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id
    });

    transaction.category = category_Entity;

    await transactionsRepository.save(transaction);

    return transaction;

  }
}

export default CreateTransactionService;
