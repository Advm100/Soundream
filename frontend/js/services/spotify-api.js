// js/services/spotify-api.js

// Spotify API credentials (store these securely in a production environment)
const SPOTIFY_CLIENT_ID = 'YOUR_CLIENT_ID';
const SPOTIFY_REDIRECT_URI = window.location.origin + '/callback';
const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Required scopes for your app functionality
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-library-modify',
  'user-read-playback-state',
  'user-modify-playback-state',
  'streaming',
  'playlist-read-private',
  'playlist-modify-private'
];

// Generate a random string for state validation
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Initialize Spotify authentication
export function initSpotifyAuth() {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);
  
  const args = new URLSearchParams({
    response_type: 'token',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES.join(' '),
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: state
  });
  
  window.location = `${SPOTIFY_AUTH_ENDPOINT}?${args.toString()}`;
}

// Handle the Spotify callback
export function handleSpotifyCallback() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  
  if (params.has('access_token')) {
    const accessToken = params.get('access_token');
    const state = params.get('state');
    const storedState = localStorage.getItem('spotify_auth_state');
    
    if (state === null || state !== storedState) {
      console.error('State mismatch');
      return false;
    }
    
    // Store token and expiration
    const expiresIn = params.get('expires_in');
    const expirationTime = Date.now() + (expiresIn * 1000);
    
    localStorage.setItem('spotify_access_token', accessToken);
    localStorage.setItem('spotify_token_expiration', expirationTime);
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, '/');
    return true;
  }
  return false;
}

// Get the stored access token
export function getAccessToken() {
  const token = localStorage.getItem('spotify_access_token');
  const expiration = localStorage.getItem('spotify_token_expiration');
  
  if (!token || !expiration) {
    return null;
  }
  
  if (Date.now() > parseInt(expiration)) {
    // Token expired, need to re-authenticate
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiration');
    return null;
  }
  
  return token;
}

// API call helper with authentication
async function spotifyFetch(endpoint, options = {}) {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No valid token available');
  }
  
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  const url = endpoint.startsWith('http') ? endpoint : `${SPOTIFY_API_BASE}${endpoint}`;
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token might be expired, clear it
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_token_expiration');
      throw new Error('Authentication failed, please login again');
    }
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
}

// API Functions

// Get current user profile
export async function getCurrentUser() {
  return spotifyFetch('/me');
}

// Get user's playlists
export async function getUserPlaylists(limit = 50) {
  return spotifyFetch(`/me/playlists?limit=${limit}`);
}

// Get a playlist's tracks
export async function getPlaylistTracks(playlistId) {
  return spotifyFetch(`/playlists/${playlistId}/tracks`);
}

// Search for tracks, artists, albums, etc.
export async function search(query, type = 'track,artist,album,playlist', limit = 20) {
  const params = new URLSearchParams({
    q: query,
    type: type,
    limit: limit
  });
  return spotifyFetch(`/search?${params.toString()}`);
}

// Get a track's details
export async function getTrack(trackId) {
  return spotifyFetch(`/tracks/${trackId}`);
}

// Get user's saved tracks
export async function getSavedTracks(limit = 50, offset = 0) {
  return spotifyFetch(`/me/tracks?limit=${limit}&offset=${offset}`);
}

// Save tracks to user's library
export async function saveTrack(trackId) {
  return spotifyFetch(`/me/tracks?ids=${trackId}`, { method: 'PUT' });
}

// Remove a track from user's library
export async function removeTrack(trackId) {
  return spotifyFetch(`/me/tracks?ids=${trackId}`, { method: 'DELETE' });
}

// Check if tracks are saved in user's library
export async function checkSavedTracks(trackIds) {
  const ids = Array.isArray(trackIds) ? trackIds.join(',') : trackIds;
  return spotifyFetch(`/me/tracks/contains?ids=${ids}`);
}

// Get featured playlists
export async function getFeaturedPlaylists() {
  return spotifyFetch('/browse/featured-playlists');
}

// Get categories
export async function getCategories() {
  return spotifyFetch('/browse/categories');
}

// Get a category's playlists
export async function getCategoryPlaylists(categoryId) {
  return spotifyFetch(`/browse/categories/${categoryId}/playlists`);
}