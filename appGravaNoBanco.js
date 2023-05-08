const mysql = require('mysql2/promise');
const fetch = require('node-fetch');
const moment = require('moment');

let lastId;

// crie uma função para inserir os dados no banco de dados
const insertData = async () => {
  try {
    // faça uma requisição GET para a API
    const response = await fetch('https://blaze.com/api/roulette_games/recent');
    const data = await response.json();

    // verifique se roll é igual a 0 e se o último ID é diferente do ID atual
    if (data[0].roll === 0 && data[0].id !== lastId) {
      // extraia os dados da resposta da API
      const numeroApi = data[0].roll;
      const horaApi = moment(data[0].created_at).format('HH:mm');
      const dataApi = moment(data[0].created_at).format('YYYY/MM/DD');

      // crie uma conexão com o banco de dados MySQL
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'maquinaRodrigo',
        password: 'Vid@Lok@.',
        database: 'dbbrancos'
      });

      // insira os dados na tabela
      const [rows, fields] = await connection.execute(
        'INSERT INTO dadosbrancos (numero, cor, dia, hora) VALUES (?, ?, ?, ?)',
        [numeroApi, 'branco', dataApi, horaApi]
      );

      console.log('Dados inseridos com sucesso:', rows);

      // armazene o último ID inserido
      lastId = data[0].id;

      // encerre a conexão com o banco de dados
      await connection.end();
    }
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
  }
};

// execute a função "insertData" a cada 1 segundo
setInterval(insertData, 1000);

