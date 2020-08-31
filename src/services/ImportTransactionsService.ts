import csvParse from "csv-parse";
import fs from "fs";
import path from "path";
import Transaction from '../models/Transaction';
import CreateTransactionService from "./CreateTransactionService";
import BB from "bluebird"

interface TransactionDTO{
  title:string; 
  type:string; 
  value:number; 
  category:number;
}

class ImportTransactionsService {
  
  async execute(filepath:string): Promise<Transaction[]> {
    const createTransactionService = new CreateTransactionService();
    const lines = await this.loadCSV(filepath);
    const transaction:TransactionDTO[] = []
    const allPromisses:Promise<Transaction[]> = lines.reduce((promise, line) => promise.then(()=> {
      const [title, type, valuestr, category] = line;
     
      const value = Number(valuestr);
      transaction.push({title, type, value, category})
      return createTransactionService.execute({title,type,value,category})}), BB.Promise.resolve());
      
      await fs.promises.unlink(filepath);

      return allPromisses;

  }




  private async loadCSV(filepath:string):Promise<any[]>{
    const filePath = filepath;
    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line:2,
      ltrim:true,
      rtrim:true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines:string[] = [];

    parseCSV.on("data", line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on("end", resolve);
    });

    return lines;

  }
}

export default ImportTransactionsService;



