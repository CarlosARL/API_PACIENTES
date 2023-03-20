const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3002;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://carloslosada:V7vqtmobeSkYe6zJ@cluster0.y7sw3lq.mongodb.net/Monitoramento_Pacientes', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const pacienteSchema = new mongoose.Schema({
  nome: String,
  data_nascimento: Date,
  sexo: String,
  endereco: {
    rua: String,
    numero: Number,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String,
  },
  contato: {
    email: String,
    telefone: String,
    celular: String,
  },
  diagnostico: String,
  cuidados: [String],
  medicamentos: [{
    nome: String,
    dose: String,
    frequencia: String,
    horarios: [String],
  }],
  historico_medico: [{
    data: Date,
    descricao: String,
  }],
  monitoramento: {
    sinais_vitais: {
      data: Date,
      temperatura: Number,
      frequencia_cardiaca: Number,
      pressao_arterial: String,
      oximetria: Number,
    },
    atividades: [{
      data: Date,
      descricao: String,
      observacao: String,
    }],
  },
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

app.get('/pacientes', async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.send(pacientes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar pacientes');
  }
});

app.post('/pacientes', async (req, res) => {
  const paciente = new Paciente(req.body);
  try {
    await paciente.save();
    res.send(paciente);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar paciente');
  }
});

app.get('/pacientes/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) {
      return res.status(404).send('Paciente não encontrado');
    }
    res.send(paciente);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar paciente');
  }
});

app.put('/pacientes/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!paciente) {
      return res.status(404).send('Paciente não encontrado');
    }
    res.send(paciente);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar paciente');
  }
});

app.delete('/pacientes/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndDelete(req.params.id);
    if (!paciente) {
      return res.status(404).send('Paciente não encontrado');
    }
    res.send(paciente);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao excluir paciente');
  }
});

app.listen(port,() => {
console.log(`Servidor iniciado na porta ${port}`);
});
