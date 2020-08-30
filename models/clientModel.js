import mongoose from 'mongoose';

const clienteSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    min: 0,
  },
});

const clientModel = mongoose.model('clientes', clienteSchema);

export { clientModel };
