const app = require('express')()
const amqplib = require('amqplib')

let channel;

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

connect().then(async() => {
    app.get('/api/product',(req,res) => {
        res.send('Get product')
    })
    
    app.listen(5001,(req,res) => {
        console.log('Server products running');
    })

    await channel.consume('AUTH', data => {
        console.log(JSON.parse(data.content));
        channel.ack(data);
    })

})


