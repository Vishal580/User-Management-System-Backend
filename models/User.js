const db = require('../config/database');

class User {
  // fetch users with optional search and pagination
  static async findAll({ page = 1, limit = 10, search = '' } = {}) {
    // normalize numeric inputs
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    // enforce integer values (avoid floats)
    limit = Math.floor(limit);
    const offset = (page - 1) * limit;

    // sanitize search
    search = typeof search === 'string' ? search.trim() : '';

    // build where clause and params (only for search)
    let where = '';
    const params = [];
    if (search.length > 0) {
      where = 'WHERE name LIKE ? OR email LIKE ?';
      const like = `%${search}%`;
      params.push(like, like);
    }

    // get total count
    const countSql = `SELECT COUNT(*) AS total FROM users ${where}`;
    const [countRows] = await db.execute(countSql, params);
    const total = (countRows && countRows[0] && Number(countRows[0].total)) || 0;
    const pages = total > 0 ? Math.ceil(total / limit) : 1;

    // fetch page rows
    // NOTE: interpolate validated numeric limit/offset directly to avoid prepared-stmt LIMIT issues
    const sql = `SELECT * FROM users ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    const [rows] = await db.execute(sql, params);
    return {
      users: rows,
      total,
      pages,
      currentPage: page
    };
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(userData) {
    const { name, email, phone, status = 'active' } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (name, email, phone, status) VALUES (?, ?, ?, ?)',
      [name, email, phone, status]
    );
    return result.insertId;
  }

  static async update(id, userData) {
    const { name, email, phone, status } = userData;
    const [result] = await db.execute(
      'UPDATE users SET name = ?, email = ?, phone = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, phone, status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async checkEmailExists(email, excludeId = null) {
    let query = 'SELECT id FROM users WHERE email = ?';
    let params = [email];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const [rows] = await db.execute(query, params);
    return rows.length > 0;
  }
}

module.exports = User;