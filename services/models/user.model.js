const db = require("../../utils/db");
const { update } = require("./image.model");
const tableName = "user";

module.exports = {
  findAll() {
    return db(tableName).where("Isdeleted", 0);
  },

  findByBidder() {
    return db(tableName)
      .join("role", "user.Scope", "=", "role.id")
      .where("user.Isdeleted", 0)
      .andWhere("user.Scope", 5);
  },

  findBySeller() {
    return db(tableName)
      .join("role", "user.Scope", "=", "role.id")
      .where("user.Isdeleted", 0)
      .andWhere("user.Scope", 15);
  },

  async findById(id) {
    const rows = await db(tableName).where("id", id);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },

  async findByMail(mail) {
    const rows = await db(tableName).where("Email", "like", `${mail}`);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  },

  async findByUserName(username) {
    const rows = await db(tableName).where("Username", username);
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

  del(id) {
    return db(tableName).where("Id", id).del();
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
};
