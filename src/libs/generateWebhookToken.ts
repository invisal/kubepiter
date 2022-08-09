import crypto from 'crypto';

export default function generateWebhookToken() {
  return crypto.randomBytes(48).toString('hex');
}
