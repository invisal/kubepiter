import express from 'express';

export function parseTokenFromBearer(authorization: string) {
  if (authorization) {
    const splittedAuth = authorization.split(' ');
    if (splittedAuth[0] === 'Bearer') return splittedAuth[1];
  }

  return '';
}

export default function parseTokenFromRequest(req: express.Request) {
  // Take from token query
  if (req.query?.token) return req.query.token;

  // Take from authorization bearer
  if (req.headers?.authorization) {
    return parseTokenFromBearer(req.headers?.authorization);
  }

  return '';
}
