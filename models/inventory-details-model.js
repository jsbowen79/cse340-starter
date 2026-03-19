const pool = require("../database/")

//Get details for inventory item with matching inv_id.
async function getProductDetail(id) {
    try {
        const data = await pool.query(
            'SELECT * FROM public.inventory WHERE inv_id =$1',
            [id] 
        )
        return data.rows[0] || null; 
    } catch (error) {
        console.error("Inventory Id Error " + error)
    }
    
}

module.exports = { getProductDetail }