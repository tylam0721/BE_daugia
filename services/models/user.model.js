const db = require("../../utils/db");
const { update } = require("./image.model");
const tableName = "user";

module.exports = {
  findAll() {
    return db(tableName).whereNot('scope', 25).where("Isdeleted", 0);
  },

  findByBidder() {
    return db(tableName)
      .join("role", "user.Scope", "=", "role.id")
      .where("user.Isdeleted", 0)
      .andWhere("user.IsRequesSeller", 1).select('user.id', 
      'user.Email', 
      'user.Adress',
      'user.Birthday',
      'user.Firstname',
      'user.DateCreated',
      'user.DateUpdated',
      'user.RateGood',
      'user.RateBad',
      'user.Scope',
      'user.Lastname',
      'role.NameRole'
      );
  },

  findBySeller() {
    return db(tableName)
      .join("role", "user.Scope", "=", "role.id")
      .where("user.Isdeleted", 0)
      .andWhere("user.Scope", 15).select('user.id', 
      'user.Email', 
      'user.Adress',
      'user.Birthday',
      'user.Firstname',
      'user.DateCreated',
      'user.DateUpdated',
      'user.RateGood',
      'user.RateBad',
      'user.Scope',
      'user.Lastname',
      'role.NameRole'
      );
  },

  async findById(id) {
    const rows = await db(tableName).where("id", id);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },

  async postRateGood(point, id){
    const rows = await db(tableName).where("id", id).update("RateGood", point);
    if (rows.length === 0) {
      return null;
    }
    return rows[0]
  },

  async postRateBad(point, id){
    const rows = await db(tableName).where("id", id).update("RateBad", point);
    if (rows.length === 0) {
      return null;
    }
    return rows[0]
  },

  async findByMail(mail) {
    const rows = await db(tableName).where("Email", "like", `${mail}`);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },
  
  add(actor) {
    return db(tableName).insert(actor);
  },

  upto(id, data) {
    return db(tableName).where("id", id).update(data);
  },

  downto(id, data) {
    return db(tableName).where("id", id).update(data);
  },
  
  requestUptoSeller(id) {
    return db(tableName).where("id", id).update("IsRequesSeller", 1);
  },

  reserReques(id) {
    return db(tableName).where("id", id).update("IsRequesSeller", 0);
  },

  del(id) {
    return db(tableName).where("id", id).update("Isdeleted", 1);
  },

  patch(id, user_noId) {
    return db(tableName).where("Id", id).update(user_noId);
  },

  async isValidRefeshToken(id, refreshToken) {
    const rows = await db(tableName)
      .where("Id", id)
      .andWhere("RefreshToken", refreshToken);
    if (rows.length === 0) {
      return false;
    }
    return true;
  },

  async updatePassword(id, newHashPassword) {
    return await db(tableName)
      .where("Id", id)
      .update("Password", newHashPassword);
  },

  async update(user) {
    return await db(tableName)
      .where("Id", user.Id)
      .update("Email", user.Email)
      .update("Adress", user.Address)
      .update("Birthday", user.Birthday)
      .update("FirstName", user.Firstname)
      .update("LastName", user.Lastname);
  },
  findWinnerBidder(productId) {
    return db(tableName)
      .join("auction", "user.id", "=", "auction.IdUser")
      .where("auction.IdProduct", productId)
      .select('user.id', 
      'user.Email', 
      'user.Adress',
      'user.Birthday',
      'user.Firstname',
      'user.DateCreated',
      'user.DateUpdated',
      'user.RateGood',
      'user.RateBad',
      'user.Scope',
      'user.Lastname',
      'auction.price'
      )
      .orDerBy('auction.price')
      .limit(1);
  },
};
