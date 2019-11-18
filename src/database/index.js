import Sequelize from 'sequelize';
import User from '../app/models/User';
import Student from '../app/models/Student';
import databaseConfig from '../config/database'

const models = [User, Student];

class Database{
    constructor(){
        this.init();
    }
    init(){
        this.conncetion = new Sequelize(databaseConfig);
        models.map(model => model.init(this.conncetion));

    }
}
export default new Database();
