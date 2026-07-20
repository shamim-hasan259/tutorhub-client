import { getAuth } from '@/lib/server';
import { toNextJsHandler } from 'better-auth/next-js';

const auth = getAuth();
const handler = toNextJsHandler(auth);

export const GET = handler.GET;
export const POST = handler.POST;
