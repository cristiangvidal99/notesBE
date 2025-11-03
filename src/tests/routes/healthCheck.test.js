import request from 'supertest';
import { health } from '../../routes/apiRoutes';
import { describe, it, expect } from 'vitest';

describe('API Health Check', () => {
    it('should return ok status', async () => {
        const res = await request(health).get('api/check');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'OK' });
    });
});