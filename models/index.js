import mongoose from 'mongoose';
import clientModel from './clientModel.js';

const db = {};

db.url = 'urlbanco';
db.mongoose = mongoose;
db.banco = clientModel(mongoose);

export { db };
