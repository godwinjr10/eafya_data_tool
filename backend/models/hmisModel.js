// import { DataTypes } from 'sequelize';
// import { sequelize } from '../config/database.js';

// const HmisDataElementsModel = sequelize.define(
//   'hmis_data_elements',
//   {
//     id: {
//       type: DataTypes.UUID,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     section_id: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     section_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     hmis_code: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     hmis_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     map_type: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       defaultValue: 'none',
//     },
//   },
//   {
//     timestamps: true,
//     schema: 'reporting',
//     tableName: 'hmis_data_elements',
//   }
// );

// HmisDataElementsModel.sync({ alter: true });

// export default HmisDataElementsModel;
