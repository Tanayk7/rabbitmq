import client, { Connection, Channel } from 'amqplib';

const QUEUE_NAME = 'test-queue';

class Producer{ 
    connection: Connection | null;
    channel: Channel | null;
    queue_name: string | null;
    username: string;
    password: string;
    hostname: string;
    port: string | number;

    constructor(queue_name: string, username: string = 'username', password: string = 'password', hostname: string = 'localhost', port: number = 5672){ 
        this.connection = null;
        this.channel = null;
        this.username = username;
        this.password = password;
        this.hostname = hostname;
        this.port = port;
        this.queue_name = queue_name;
    }

    async connect(): Promise<number | null>{ 
        // connect to the rabbitmq server
        this.connection = await client.connect(`amqp://${this.username}:${this.password}@${this.hostname}:${this.port}`);

        // create a new channel 
        this.channel = await this.connection.createChannel();

        // create a new queue 
        await this.channel.assertQueue(this.queue_name!);

        console.log("Connected to rabbitmq server!");

        return -1;
    }

    async sendmessage(message: string): Promise<void> {
        this.channel!.sendToQueue(this.queue_name!, Buffer.from(message)); 
        console.log("Sent message to queue!");
    }   

    async sendmessages(messages: Array<string>): Promise<void>{ 
        for(let message of messages){
            this.channel?.sendToQueue(QUEUE_NAME, Buffer.from(message)); 
            console.log("Sent message to queue!");
        }
    }
}

// (async () => {
//     // connect to the rabbitmq server
//     const connection: Connection = await client.connect('amqp://username:password@localhost:5672');
//     console.log("Connected to rabbitmq server!");

//     // create a new channel 
//     const channel: Channel = await connection.createChannel();
//     console.log("Created new channel!")

//     // create a new queue 
//     await channel.assertQueue(QUEUE_NAME);
//     console.log("Created new queue!")

//     const messages = [ 
//         'this',s
//         'message',
//         'gets',
//         'nacked'
//     ];

//     for(let message of messages){
//         channel.sendToQueue(QUEUE_NAME, Buffer.from(message)); 
//         console.log("Sent message to queue!");
//     }

//     // setInterval(() => { 
//     //     // send a message to queue
//     //     channel.sendToQueue(QUEUE_NAME, Buffer.from('hello world')); 
//     //     console.log("Sent message to queue!")
//     // }, 1000)
// })();

export default Producer;