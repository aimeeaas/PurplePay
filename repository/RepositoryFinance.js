// RepositoryFinance.js
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('finance.db');

// Helpers de data
function toISODateFromDisplay(dateStr) {
  // espera dd/mm/yyyy
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  let [d, m, y] = parts;
  d = d?.toString().padStart(2, '0');
  m = m?.toString().padStart(2, '0');
  return `${y}-${m}-${d}`; // ISO
}
function formatDateForDisplay(isoDate) {
  // recebe yyyy-mm-dd e devolve dd/mm/yyyy
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

export const database = {

  // INIT
  init: async () => {
    try {
      await db.execAsync('PRAGMA journal_mode = WAL;');
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS finance (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          descricao TEXT NOT NULL,
          valor REAL,
          categoria TEXT,
          data TEXT
        );
      `);
      console.log('Tabela criada.');
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
    }
  },

  // LISTAR
  getFinance: async () => {
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM finance ORDER BY data DESC;'
      );
      return result;
    } catch (error) {
      console.error('Erro ao buscar:', error);
    }
  },

  // INSERIR
  addFinance: async (descricao, valor, categoria, data) => {
    try {
      const dataISO = toISODateFromDisplay(data);
      await db.runAsync(
        'INSERT INTO finance (descricao, valor, categoria, data) VALUES (?, ?, ?, ?);',
        [descricao, valor, categoria, dataISO]
      );
    } catch (error) {
      console.error('Erro ao adicionar:', error);
    }
  },

  // ATUALIZAR
  updateFinance: async (id, descricao, valor, categoria, data) => {
    try {
      const dataISO = toISODateFromDisplay(data);
      await db.runAsync(
        `UPDATE finance 
         SET descricao = ?, valor = ?, categoria = ?, data = ?
         WHERE id = ?;`,
        [descricao, valor, categoria, dataISO, id]
      );
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  },

  // EXCLUIR
  deleteFinance: async (id) => {
    try {
      await db.runAsync(
        'DELETE FROM finance WHERE id = ?;',
        [id]
      );
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  },

  // FILTRO POR MÊS
  getByMonth: async (anoMes) => {
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM finance WHERE data LIKE ?;',
        [`${anoMes}%`] // ex: 2026-05
      );
      return result;
    } catch (error) {
      console.error('Erro ao filtrar mês:', error);
    }
  },

  // FILTRO POR ANO
  getByYear: async (ano) => {
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM finance WHERE data LIKE ?;',
        [`${ano}%`] // ex: 2026
      );
      return result;
    } catch (error) {
      console.error('Erro ao filtrar ano:', error);
    }
  }
};