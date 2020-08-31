import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import { getCustomRepository } from 'typeorm';
import ImportTransactionsService from '../services/ImportTransactionsService';

// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';


import multer from "multer"
import uploadconfig from "../config/upload"
import Transaction from '../models/Transaction';

const upload = multer(uploadconfig);


const transactionsRouter = Router();


transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.getExtract();
  // console.log(transactions.map(transc => transc.category))
  return response.json (transactions)
});

transactionsRouter.post('/', async (request, response) => {
  const createTransactionService = new CreateTransactionService();
  const {title,type,value,category} = request.body;
  const transaction = await createTransactionService.execute({title,type,value,category})
  return response.json (transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const id = request.params;
  transactionRepository.delete(id);
  return response.json ({ok:true})
});

transactionsRouter.post('/import', 
upload.single('file'),
async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const importTransactionService = new ImportTransactionsService();

  const transactionPromisses = await importTransactionService.execute(request.file.path);

  return response.json(await transactionRepository.getBalanceSimple());

  //Need to improve the code to get return from the Promises.
  // const transactions: Transaction[] = [];

  // await transactionPromisses.then( result => console.log(result));

  // return response.json(transactions)

  });

export default transactionsRouter;

