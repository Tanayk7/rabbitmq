import client, {Connection, Channel, ConsumeMessage} from 'amqplib'

const QUEUE_NAME = 'test-queue';

class Consumer{ 
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

        // fetch max 50 messages at once from the message broker 
        this.channel.prefetch(100);

        // create a new queue 
        await this.channel.assertQueue(this.queue_name!);

        // add the message handler 
        this.channel.consume(this.queue_name!, this.onMessage);

        console.log("Connected to rabbitmq server!");

        return -1;
    }

    // gets one single message from the message broker 
    async dequeueMessage(): Promise<any> { 
        return await this.channel!.get(this.queue_name!);
    }
    
    onMessage = (msg: ConsumeMessage | null): void => { 
        if(msg) {
            setTimeout(() => { 
                // Display the received message
                const message = msg.content.toString();
                console.log(message);

                // add message rejection logic here 
                if(message === 'nacked'){
                    console.log("nacked message!");
                    this.channel!.nack(msg);
                }
                else{
                    // Acknowledge the message
                    console.log("acked message!");
                    this.channel!.ack(msg)
                }
            }, 1000);
        }
    }
}



// (async () => { 
//     // create a connection 
//     const connection: Connection = await client.connect('amqp://username:password@localhost:5672')

//     // Create a channel
//     const channel: Channel = await connection.createChannel();

//     // fetch max 50 messages at once from the message broker 
//     channel.prefetch(50);

//     // Makes the queue available to the client
//     await channel.assertQueue(QUEUE_NAME)

//     const message = await channel.get(QUEUE_NAME) as any;

//     console.log(message.content.toString());

//     // Start the consumer
//     // await channel.consume(QUEUE_NAME, (msg: ConsumeMessage | null): void => { 
//     //     if(msg) {
//     //          // Display the received message
//     //         const message = msg.content.toString();

//     //         // if(message === 'nacked'){
//     //         //     console.log(msg.content.toString())
//     //         //     channel.nack(msg);
//     //         // }

//     //         // Acknowledge the message
//     //         console.log("Rejected message!");

//     //         channel.nack(msg)
//     //     }
//     // })
// })();

export default Consumer;