const knex = require("knex");
const db = require("../../utils/db");
const tableName = "product";


module.exports = {
  findAll() {
    return db(tableName).where("Isdeleted", 0);
  },
  findbyCategory(id) {
    return db(tableName).where("Isdeleted", 0).andWhere("IdCategory", id);
  },
  findById(id){
    return db(tableName).where("Isdeleted", 0).andWhere("id", id);
  },
  updatePrice(id, price, idbuyer){
    return db(tableName).where("id", id).update({
      NowPrice: price,
      IdUserBuyer: idbuyer
    });
  },

  add(product) {
    return db(tableName).insert(product);
  },
  update(product, id) {
    return db(tableName).where("id", id).update(product);
  },
  delete(id) {
    return db(tableName).where("id", id).update("Isdeleted", 1);
  },
  deleteWithUserAndProductId(entity){
    return db(tableName).where("IdUser", entity.IdUser).andWhere("IdProduct",entity.IdProduct).update("Isdeleted", 1);
  },
  getAuctioned() {
    return db(tableName).where("Isdeleted", 0).whereExists(function() {
      this.select('*').from('auction').whereRaw('auction.IdProduct = product.id');
    })
  },
  getAuctionAvailable() {
    return db(tableName).where('DateEnd', '>=', new Date())
  }
};