const pool = require("../database/")

//Get Schedule details for vehicle
async function getVehicleSchedule(inv_id ){
    try {
        const data = await pool.query(
            `SELECT * FROM public.drive WHERE inv_id = $1`,
            [inv_id]
        )
        return data.rows || null; 
    } catch (error) {
        console.error("Vehicle Schedule Error" + error)
    }
}

//Get Schedule for Host
async function getHostSchedule(host_id, drive_date) {
    try {
        const response = await pool.query(
            `SELECT drive_time FROM public.drive where host_id = $1 AND drive_date = $2`,
            [host_id, drive_date]
        ) 
        if (response.rows > 0) {
            const scheduledTimes = response.rows.map(row =>
                row.drive_time.toString().slice(0, 5)
            )
            return scheduledTimes;
        } else {
            return []
        }    
    } catch (error) {
        console.error("Host Schedule Error" + error)
    }
}

//Update Drive Table with New Appointment
async function updateAppointment(inv_id, host_id, customer_id, customer_name, drive_date, drive_time) {
   
    try {
        const result = await pool.query(
            `INSERT INTO public.drive (inv_id, host_id, customer_id, customer_name, drive_date, drive_time) VALUES ($1, $2, $3, $4, $5::date, $6::time) RETURNING *`,
            [inv_id, host_id, customer_id, customer_name, drive_date, drive_time]
        )
        
        return { success: true};
        
    } catch (error) {
        
        if (error && error.constraint === "unique_drive_slot") {
           
            return { success: false, message: 1 }; 
            
        }
        if (error && error.constraint === "unique_host_appointment") {
            return { success: false, message: 2 };
        }
        return {success: false, message: 3}
    }
}


//Get a list of Hosts available for test Drives
async function getHosts() {
    try {
        const data = await pool.query( 
            `SELECT account_firstname, account_lastname, account_id FROM  public.account WHERE account_type = 'Employee' OR account_type = 'Admin' `
        )

        const availableHosts = data.rows.map(row => ({
            name: `${row.account_firstname} ${row.account_lastname}`,
            account_id: row.account_id
        }));
            
        return availableHosts
    } catch (error) {
        console.error("Available Hosts error")
    }
}


module.exports = { getVehicleSchedule, getHostSchedule, updateAppointment, getHosts }
