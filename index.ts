import Producer from "./producer";
import Consumer from "./consumer";

(async () => { 
    const producer = new Producer(
        'cte-messages',
        'username',
        'password',
        'localhost',
        5672
    );
    await producer.connect();

    const messages = ['this', 'message', 'must', 'be', 'nacked', 'and', 'this', 'doesnt'];
    await producer.sendmessages(messages);
    
    const consumer = new Consumer(
        'cte-messages',
        'username',
        'password',
        'localhost',
        5672
    );
    await consumer.connect();
})();