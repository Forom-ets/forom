import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pingDatabase } from '../database/db.js';
import {
  ensureUserAuthSchema,
  findUserById,
  findUserByEmail,
  findUserByUsername,
  findUserByProvider,
  usernameExists,
  createUserWithPassword,
  updateUserPassword,
  setUserJwtSecureCode,
  linkUserToProvider,
  createUserWithProvider,
} from '../database/userRepository.js';

const app = express();
const port = Number(process.env.API_PORT || 4000);
const jwtSecret = process.env.JWT_SECRET || 'secret-test';
const frontendBaseUrl = process.env.FE_BASE_URL || 'http://localhost:5173';

const oauthStateStore = new Map();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

function cleanEmail(rawEmail) {
  return String(rawEmail || '').trim().toLowerCase();
}

function toSafeUsername(seed) {
  const base = String(seed || '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 24);

  return base || `user_${crypto.randomInt(1000, 9999)}`;
}

async function createUniqueUsername(seed) {
  const base = toSafeUsername(seed);
  if (!(await usernameExists(base))) {
    return base;
  }

  for (let i = 0; i < 20; i += 1) {
    const candidate = `${base}_${crypto.randomInt(10, 9999)}`.slice(0, 32);
    if (!(await usernameExists(candidate))) {
      return candidate;
    }
  }

  return `user_${crypto.randomInt(100000, 999999)}`;
}

async function issueAuthToken(userId) {
  const jwtSecureCode = crypto.randomUUID();
  await setUserJwtSecureCode({ userId, jwtSecureCode });

  const token = jwt.sign({ id: userId, jwtSecureCode }, jwtSecret, {
    expiresIn: '7d',
  });

  return token;
}

function buildFrontendRedirect(params) {
  const url = new URL(frontendBaseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice('Bearer '.length);
}

function toUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role || 'associate',
    currency: Number(user.currency || 0),
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/email', async (req, res) => {
  try {
    const email = cleanEmail(req.body?.email);
    const password = String(req.body?.password || '');
    const requestedUsername = String(req.body?.username || '');

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'password must be at least 8 characters' });
    }

    let user = await findUserByEmail(email);

    if (!user) {
      const usernameSeed = requestedUsername || email.split('@')[0];
      const username = await createUniqueUsername(usernameSeed);
      const passwordHash = await bcrypt.hash(password, 10);

      user = await createUserWithPassword({
        username,
        email,
        passwordHash,
      });
    } else if (!user.password_hash) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await updateUserPassword({
        userId: user.id,
        passwordHash,
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'invalid credentials' });
      }
    }

    const accessToken = await issueAuthToken(user.id);

    return res.json({
      accessToken,
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error('POST /api/auth/email failed:', error);
    return res.status(500).json({ message: 'internal auth error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const username = String(req.body?.username || '').trim();
    const email = cleanEmail(req.body?.email);
    const password = String(req.body?.password || '');
    const confirmPassword = String(req.body?.confirmPassword || '');

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'username, email, password and confirmPassword are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'password confirmation does not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'password must be at least 8 characters' });
    }

    const normalizedUsername = toSafeUsername(username);
    if (await usernameExists(normalizedUsername)) {
      return res.status(409).json({ message: 'username already exists' });
    }

    if (await findUserByEmail(email)) {
      return res.status(409).json({ message: 'email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUserWithPassword({
      username: normalizedUsername,
      email,
      passwordHash,
    });
    const accessToken = await issueAuthToken(user.id);

    return res.json({
      accessToken,
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error('POST /api/auth/register failed:', error);
    return res.status(500).json({ message: 'internal auth error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '');

    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }

    const normalizedUsername = toSafeUsername(username);
    const user = await findUserByUsername(normalizedUsername);

    if (!user || !user.password_hash) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const accessToken = await issueAuthToken(user.id);

    return res.json({
      accessToken,
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error('POST /api/auth/login failed:', error);
    return res.status(500).json({ message: 'internal auth error' });
  }
});

app.get('/api/auth/authentik', (req, res) => {
  const clientId = process.env.AUTHENTIK_CLIENT_ID || '';
  const authorizeUrl = process.env.AUTHENTIK_AUTHORIZE_URL || '';
  const redirectUri = process.env.AUTHENTIK_REDIRECT_URI || `http://localhost:${port}/api/auth/authentik/callback`;

  if (!clientId || !authorizeUrl) {
    return res.status(500).json({ message: 'Authentik is not configured' });
  }

  const state = crypto.randomUUID();
  oauthStateStore.set(state, Date.now());

  // Remove stale OAuth states to avoid unbounded growth.
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [key, timestamp] of oauthStateStore.entries()) {
    if (timestamp < cutoff) {
      oauthStateStore.delete(key);
    }
  }

  const url = new URL(authorizeUrl);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', process.env.AUTHENTIK_SCOPE || 'openid profile email');
  url.searchParams.set('state', state);

  return res.redirect(url.toString());
});

app.get('/api/auth/authentik/callback', async (req, res) => {
  const code = String(req.query.code || '');
  const state = String(req.query.state || '');

  if (!code || !state || !oauthStateStore.has(state)) {
    return res.redirect(buildFrontendRedirect({ authError: 'oauth_state_invalid' }));
  }

  oauthStateStore.delete(state);

  const tokenUrl = process.env.AUTHENTIK_TOKEN_URL || '';
  const userInfoUrl = process.env.AUTHENTIK_USERINFO_URL || '';
  const clientId = process.env.AUTHENTIK_CLIENT_ID || '';
  const clientSecret = process.env.AUTHENTIK_CLIENT_SECRET || '';
  const redirectUri = process.env.AUTHENTIK_REDIRECT_URI || `http://localhost:${port}/api/auth/authentik/callback`;

  if (!tokenUrl || !userInfoUrl || !clientId || !clientSecret) {
    return res.redirect(buildFrontendRedirect({ authError: 'oauth_config_missing' }));
  }

  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const details = await tokenResponse.text();
      console.error('Authentik token exchange failed:', details);
      return res.redirect(buildFrontendRedirect({ authError: 'oauth_token_exchange_failed' }));
    }

    const tokenPayload = await tokenResponse.json();
    const providerAccessToken = tokenPayload.access_token;

    if (!providerAccessToken) {
      return res.redirect(buildFrontendRedirect({ authError: 'oauth_token_missing' }));
    }

    const userInfoResponse = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${providerAccessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      const details = await userInfoResponse.text();
      console.error('Authentik userinfo request failed:', details);
      return res.redirect(buildFrontendRedirect({ authError: 'oauth_userinfo_failed' }));
    }

    const profile = await userInfoResponse.json();
    const providerId = String(profile.sub || '');
    const email = cleanEmail(profile.email);
    const profileName = String(profile.preferred_username || profile.name || email.split('@')[0] || 'user');

    if (!providerId || !email) {
      return res.redirect(buildFrontendRedirect({ authError: 'oauth_profile_incomplete' }));
    }

    let user = await findUserByProvider('authentik', providerId);

    if (!user) {
      const existingByEmail = await findUserByEmail(email);
      if (existingByEmail) {
        user = await linkUserToProvider({
          userId: existingByEmail.id,
          provider: 'authentik',
          providerId,
        });
      } else {
        const username = await createUniqueUsername(profileName);
        user = await createUserWithProvider({
          username,
          email,
          provider: 'authentik',
          providerId,
        });
      }
    }

    const accessToken = await issueAuthToken(user.id);

    return res.redirect(
      buildFrontendRedirect({
        authToken: accessToken,
        username: user.username,
        authProvider: 'authentik',
      })
    );
  } catch (error) {
    console.error('GET /api/auth/authentik/callback failed:', error);
    return res.redirect(buildFrontendRedirect({ authError: 'oauth_callback_failed' }));
  }
});

app.get('/api/auth/me', async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: 'missing bearer token' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await findUserById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'user not found' });
    }

    return res.json({
      user: toUserResponse(user),
    });
  } catch {
    return res.status(401).json({ message: 'invalid token' });
  }
});

async function startServer() {
  try {
    await ensureUserAuthSchema();
    await pingDatabase();

    app.listen(port, () => {
      console.log(`Auth API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start API server:', error);
    process.exit(1);
  }
}

startServer();
