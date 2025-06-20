import { fastify, FastifyRequest } from 'fastify';
import { } from '@fastify/cors';
import { z } from 'zod';
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from 'fastify-type-provider-zod';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', () => {
    return 'OK';
});

const createOrderBodySchema = z.object({
    amount: z.number(),
});

type CreateOrderBody = z.infer<typeof createOrderBodySchema>;

app.post('/orders', {
    schema: {
        body: createOrderBodySchema
    }
}, (request: FastifyRequest<{ Body: CreateOrderBody }>, reply) => {

    const { amount } = request.body;

    console.log('Creating an order with amount', amount);

    return reply.status(201).send();
});

app.listen({ host: '0.0.0.0', port: 3333 }).then(() => {
    console.log('[Orders] HTTP Server running!');
});
