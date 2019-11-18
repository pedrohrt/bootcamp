import express from 'express'; // importar o express
import routes from './routes'; // exporta as rotas do arquivo routes.js
import './database'

class App {
  constructor() {
    // Metodo construtor, chamado automaticameente
    this.server = express(); // instanciar o express na variavel server
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json()); // conifgura a aplicação para receber informacaoes no formato JSON
  }

  routes() {
    this.server.use(routes); // usando as rotas de routes.js
  }
}

export default new App().server; // exportando apenas a variavel server
