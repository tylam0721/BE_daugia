const db = require('../../utils/db');

module.exports = {

  roomRequestImages(){
    return db('image')
            .select('images.id',
                    'images.name',
                    'images.IdProduct');
  },

  findAll() {
    return db('image');
  },

  add(image) {
    return db('image').insert(image);
  },

  del(id) {
    return db('image')
      .where('id', id)
      .del();
  },

  deleteImg(name, id){
    return db('image')
      .where('IdProdcut', id).andWhere('name', name)
      .del();
  },

  update(image, id){
    return db('image').where('id',id).update(image);
  },

  findImagebyRoom(id){
    return this.roomRequestImages();
  }
};
