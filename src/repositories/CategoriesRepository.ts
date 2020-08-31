import { EntityRepository, Repository, getCustomRepository } from "typeorm";

import Category from "../models/Category";

@EntityRepository(Category)
class TransactionsRepository extends Repository<Category> {
  public async getCategory(title:string): Promise<Category> {
    let categoryEntity = await this.findOne({
        where:{
            title,
        }
    });
    
    if (!categoryEntity){
        categoryEntity = this.create({
            title,
        });
        await this.save(categoryEntity)
    }

  return categoryEntity; 
  }
}

export default TransactionsRepository;
