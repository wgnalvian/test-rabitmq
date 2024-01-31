const app = require('express')()
const amqplib = require('amqplib')

let channel

async function connect() {
    try {
        const amqplibServer = 'amqp://localhost';
        const connection = await amqplib.connect(amqplibServer);
        channel = await connection.createChannel();
        await channel.assertQueue('AUTH'); 
    } catch (error) {
        console.log(error);
    }
}

connect().then(() => {
    app.get('/api/login',(req,res) => {
        res.send('Login')
        channel.sendToQueue('AUTH',Buffer.from(JSON.stringify({
            token : 'INI TOKEN'
        })))
    })

    app.get('/api/user', (req, res) => {
        res.send("Get User")
    })
    
    app.listen(5000, () => {
        console.log('Server user running');
    })
});
