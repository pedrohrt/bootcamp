import Sequelize from 'sequelize';
import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import databaseConfig from '../config/database'

const models = [User, Student, Plan];

class Database{
    constructor(){
        this.init();
    }
    init(){
        this.conncetion = new Sequelize(databaseConfig);

        models
          .map(model => model.init(this.conncetion))
          .map(model => model.associate && model.associate(this.conncetion.models));

    }
}
export default new Database();
