'use strict';
module.exports = (sequelize, DataTypes) => {
  var Tag = sequelize.define('Tag', {
    text: DataTypes.STRING
  });

  Tag.associate = function(models) {
    Tag.belongsToMany(models.Keyword, {foreignKey:"TagId", through:"Keyword_has_Tag"});
  };
  return Tag;
};
