import { Consumer, Kafka, EachMessagePayload } from "kafkajs";
import { config } from "./config";
import { hostname } from 'os';
import { redisClient } from "./redisClient";
import { queryManager } from "../DB/queryManager";

class KafkaConsumer{
    private static consumer : Consumer;
    private static connected : boolean = false;
    private static redisClient = redisClient; // Redis client

    public static async connect() : Promise<void> {
        if(!KafkaConsumer.consumer){
            const kafka = new Kafka({
                clientId: `${hostname()}-consumer-instance`,
                brokers: [config.kafka.url1, config.kafka.url2],
            });
            KafkaConsumer.consumer = kafka.consumer({ groupId: 'group1' });
        }
        if(!KafkaConsumer.connected){
            try {
                await KafkaConsumer.consumer.connect();
                KafkaConsumer.connected = true;
                console.log('Kafka consumer connected.');

                KafkaConsumer.startConsuming();
            } catch (error) {
                console.error('Failed to connect Kafka consumer:', error);
                setTimeout(() => KafkaConsumer.connect(), 5000); 
            }
        }
    }
    private static async startConsuming(): Promise<void> {
        await KafkaConsumer.consumer.subscribe({ topic: 'user', fromBeginning: true });
        await KafkaConsumer.consumer.subscribe({ topic: 'space', fromBeginning: true });
        await KafkaConsumer.consumer.subscribe({ topic: 'element', fromBeginning: true });

        await KafkaConsumer.consumer.run({
            eachMessage : async (payload: EachMessagePayload) => {
                const { topic, partition, message } = payload;
                const messageContent = message.value?.toString();

                const lastProcessedOffset = await KafkaConsumer.getLastProcessedOffset(topic, partition);
                if (lastProcessedOffset && parseInt(message.offset) <= lastProcessedOffset) {
                    return; // already proceessed msg
                }
                switch (topic) {
                    case 'user':
                        queryManager.userMessage(messageContent, partition);
                        break;
                    case 'space':
                        queryManager.spaceMessage(messageContent, partition);
                        break;
                    case 'element':
                        queryManager.elementMessage(messageContent, partition);
                        break;
                    default:
                        console.warn(`Unhandled topic: ${topic}`);
                }
                await KafkaConsumer.saveLastProcessedOffset(topic, partition, parseInt(message.offset));
            }
        });

    }

    private static async getLastProcessedOffset(topic: string, partition: number): Promise<number | null> {
        const offset = await KafkaConsumer.redisClient.get(`${topic}-${partition}-offset`);
        return offset ? parseInt(offset) : null;
    }

    // store last processed offset for each partitions
    private static async saveLastProcessedOffset(topic: string, partition: number, offset: number): Promise<void> {
        await KafkaConsumer.redisClient.set(`${topic}-${partition}-offset`, offset.toString(), 'PX', 3600000); // 1hrs
    }
}

export { KafkaConsumer };