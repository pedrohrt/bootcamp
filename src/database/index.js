import Sequelize from 'sequelize';
// import mongoose from 'mongoose';
import User from '../app/models/User';
import Student from '../app/models/Student';
import Enrollment from '../app/models/Enrollment';
import Plan from '../app/models/Plan';
import Checkin from '../app/models/Checkin';
import HelpOrder from '../app/models/HelpOrder';

import databaseConfig from '../config/database';

const models = [User, Student, Plan, Enrollment, Checkin, HelpOrder];

class Database {
  constructor() {
    this.init();
    // this.mongo();
  }

  init() {
    this.conncetion = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.conncetion))
      .map(model => model.associate && model.associate(this.conncetion.models));
  }
}
export default new Database();
