const {pool} = require('./mysqlcon');

const getCollectsByUserId = async (userId) => {
    const condition = {};
    condition.sql = 'WHERE userId = ?';
    condition.binding = [userId];

    const collectQuery = 'SELECT * FROM collect ' + condition.sql + ' ORDER BY productId ';
    const collectBindings = condition.binding;
    const [collects] = await pool.query(collectQuery, collectBindings);

    const collectCountQuery = 'SELECT COUNT(*) as count FROM collect ' + condition.sql;
    const collectCountBindings = condition.binding;

    const [collectCounts] = await pool.query(collectCountQuery, collectCountBindings);

    return {
        'collects': collects,
        'collectCount': collectCounts[0].count
    };
};

const getCollectsByProductId = async (productId) => {
    const condition = {};
    condition.sql = 'WHERE productId = ?';
    condition.binding = [productId];

    const collectQuery = 'SELECT * FROM collect ' + condition.sql + ' ORDER BY userId ';
    const collectBindings = condition.binding;
    const [collects] = await pool.query(collectQuery, collectBindings);

    const collectCountQuery = 'SELECT COUNT(*) as count FROM collect ' + condition.sql;
    const collectCountBindings = condition.binding;

    const [collectCounts] = await pool.query(collectCountQuery, collectCountBindings);

    return {
        'collects': collects,
        'collectCount': collectCounts[0].count
    };
};

const getCollectStatus = async (userId, productId) => {
    const condition = {};
    condition.sql = 'WHERE userId = ? AND productId = ?';
    condition.binding = [userId, productId];

    const collectCountQuery = 'SELECT COUNT(*) as count FROM collect ' + condition.sql;
    const collectCountBindings = condition.binding;

    const [collectCounts] = await pool.query(collectCountQuery, collectCountBindings);

    return {
        'collectStatus': collectCounts[0].count
    };
};

const updateCollectStatus = async (userId, productId, action) => {
    const condition = {};
    condition.sql = 'WHERE userId = ? AND productId = ?';
    condition.binding = [userId, productId];

    const collectCountQuery = 'SELECT COUNT(*) as count FROM collect ' + condition.sql;
    const collectCountBindings = condition.binding;

    const [collectCounts] = await pool.query(collectCountQuery, collectCountBindings);
    const isCollectd = collectCounts[0].count;

    if (action === 'add') {
       
        if (isCollectd) {
            // do nothing
        } else {
            const conn = await pool.getConnection();
            await conn.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await conn.beginTransaction();
            try {
                await conn.query('INSERT INTO collect(userId, productId) VALUES (?, ?)', [userId, productId]);
                await conn.commit();
            } catch (error) {
                conn.rollback();
                console.log(error)
            } finally {
                await conn.release();
            }
        }

    } else if (action === 'delete') {

        if (isCollectd) {
            const conn = await pool.getConnection();
            await conn.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
            await conn.beginTransaction();
            try {
                await conn.query('DELETE FROM collect WHERE userId = ? AND productId = ?', [userId, productId]);
                await conn.commit();
            } catch (error) {
                conn.rollback();
                console.log(error)
            } finally {
                await conn.release();
            }
        } else {
            // do nothing
        }

    }

    return "OK";
};

const getHotCollects = async (N) => {
  const productIdsQuery = 'select distinct(collect.productId) from collect';
  const [productIds] = await pool.query(productIdsQuery);
  const hotLeaderboard = {};
  for (let i = 0; i < productIds.length; ++i) {
    const condition = {};
    condition.sql = 'WHERE productId = ?';
    condition.binding = [productIds[i].productId];
    const collectCountQuery = 'SELECT COUNT(*) as count FROM collect ' + condition.sql;
    const collectCountBindings = condition.binding;
    const [collectCounts] = await pool.query(collectCountQuery, collectCountBindings);
    hotLeaderboard[productIds[i].productId] = collectCounts[0].count;
  }
  // https://stackoverflow.com/a/37607084
  let entries = Object.entries(hotLeaderboard);
  let sorted = entries.sort((a, b) => b[1] - a[1]);
  const result = [];
  for (let i = 0; i < N && i < sorted.length; ++i) {
    result.push({
        product_id: sorted[i][0],
        count: sorted[i][1]
    });
  }
  return {
    'result': result
  };
};

module.exports = {
    getCollectsByUserId,
    getCollectsByProductId,
    getCollectStatus,
    updateCollectStatus,
    getHotCollects,
};