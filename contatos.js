var Contato = require('../models/contato');
var express = require('express');

//Routing middleware
var router = express.Router();

//define múltiplas ações para a rota /contatos 
router.route('/')
  // pedido GET para a rota /contatos
  .get(function (req, res) {
    //obter todos os contatos (com ou sem filtragem de nome e/ou email)
    var query = {};
    if (req.query.nome)
      query.nome = req.query.nome;
    if (req.query.email)
      query.email = req.query.email;

    Contato.find(query)
      .populate('emergencia') //apresenta tb infos sobre os contato de emergência (em vez de apenas o ID)
      .exec(function (err, contatos) {
        //método FIND retorna um array (vazio ou não)
        if (JSON.stringify(contatos) == "[]") //OU   if(contatos.length==0)
          return res.status(404).json({ ERROR: 'Não existem contatos' });
        if (err) {
          return res.status(500).send(err);
        }
        res.json(contatos);
      });
  })
  // pedido POST para a rota /contatos
  .post(function (req, res) { //cria novo contato - string JSON no corpo do pedido
    //verifica o conteúdo do corpo do pedido
    if (JSON.stringify(req.body) == "{}")
      return res.status(400).json({ ERROR: 'Erro no pedido: sem dados' });
    if (!req.body.nome)
      return res.status(400).json({ ERROR: 'Erro no pedido: sem nome' });
    if (!req.body.email)
      return res.status(400).json({ ERROR: 'Erro no pedido: sem email' });

    //verifica se o email inserir já existe na base de dados
    Contato.findOne({ mail: req.body.email }, function (err, contato) {
      console.log(contato)
      if (!err && !contato) {
        var novocontato = new Contato(req.body);
        novocontato.save(function (err) {
          if (err) {
            return res.status(500).send(err);
          }
          res.status(201).send({ message: 'Contato adicionado' });
        })
      }
      //se exister um contato com esse email...
      else if (!err)
        res.status(403).json({ message: "Email inválido (já existente)!" });
      else
        res.status(500).json({ message: err });
    })
  })


//define múltiplas ações para a rota /contatos/:id
router.route('/:id')
  // pedido GET para a rota /contatos/:id
  .get(function (req, res) { //obter todas as infos sobre um contato
    // procura pelo contato cujo ID é passado como parâmetro no URL
    Contato.findOne({ _id: req.params.id })
      .populate('emergencia') //apresenta tb infos sobre o contato de emergência (em vez de apenas o ID)
      .exec(function (err, contato) {
        if (err) {
          return res.status(500).send(err);
        }
        if (!contato) {
          return res.status(404).json({ ERROR: 'Contato não existente' });
        }
        res.json(contato);
      });
  })
  // pedido PUT para a rota /contatos/:id
  .put(function (req, res) { //Atualização de um contato
    // procura pelo contato cujo ID é passado como parâmetro no URL
    Contato.findById({ _id: req.params.id }, function (err, contato) {
      if (err) {
        return res.status(500).send(err);
      }
      if (!contato) {
        return res.status(404).json({ ERROR: 'Contato não existente' });
      }

      //verifica o conteúdo do corpo do pedido
      if (JSON.stringify(req.body) == "{}")
        return res.status(400).json({ ERROR: 'Erro no pedido: sem dados' });
      if (!req.body.nome)
        return res.status(400).json({ ERROR: 'Erro no pedido: sem nome' });
      if (!req.body.email)
        return res.status(400).json({ ERROR: 'Erro no pedido: sem email' });

      //atualiza as novas propriedades
      for (prop in req.body) {
        contato[prop] = req.body[prop];
      }

      // guarda o novo contato
      contato.save(function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        res.json({ message: 'Contato atualizado!' });
      });
    });
  })
  // pedido DELETE para a rota /contatos/:id
  .delete(function (req, res) { //Apagar um contato
    Contato.findOne({ _id: req.params.id }, function (err, contato) {
      if (err) {
        return res.status(500).json(err.message);
      }
      if (!contato) {
        return res.status(404).json({ ERROR: 'Contato não encontrado' });
      }

      //apaga o contato da base de dados
      contato.remove(function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(204).end(); // 204 - resposta dados
        //OU res.json({ message: 'Contato apagado com sucesso!' });
      });
    });
  });



//pedido PUT para rota /contatos/:id/nome
router.put('/:id/nome', (function (req, res) {
  // Atualização parcial de um contato através do nome (passado no corpo do pedido)
  // procura pelo contato cujo ID é passado no URL
  Contato.findById({ _id: req.params.id }, function (err, contato) {
    if (err) {
      return res.status(500).send(err);
    }
    if (!contato) {
      return res.status(404).json({ ERROR: 'Contato não existente' });
    }

    //verifica o conteúdo do corpo do pedido
    if (JSON.stringify(req.body) == "{}")
      return res.status(400).json({ ERROR: 'Erro no pedido: sem dados' });
    if (!req.body.nome)
      return res.status(400).json({ ERROR: 'Erro no pedido: sem nome' });

    //atualiza as novas propriedades
    for (prop in req.body) {
      contato[prop] = req.body[prop];
    }

    // guarda o novo contato
    contato.save(function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ message: 'Contato atualizado!' });
    });
  });
}));

//exporta o router aqui definido
module.exports = router;