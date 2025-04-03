// server/routes/music.js
const router = require('express').Router();
const User = require('../models/user');
const { isAdmin } = require('../middleware/auth');

// Get user's playlists
router.get('/playlists', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new playlist
router.post('/playlists', async (req, res) => {
  try {
    const { name, description, coverImage, isPublic } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create new playlist
    const newPlaylist = {
      name,
      description: description || '',
      coverImage: coverImage || '',
      tracks: [],
      isPublic: isPublic || false,
      createdAt: new Date()
    };
    
    // Add playlist to user's playlists
    user.playlists.push(newPlaylist);
    await user.save();
    
    res.status(201).json({
      message: 'Playlist created successfully',
      playlist: user.playlists[user.playlists.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific playlist
router.get('/playlists/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find playlist by ID
    const playlist = user.playlists.id(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a playlist
router.put('/playlists/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, description, coverImage, isPublic } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find playlist by ID
    const playlist = user.playlists.id(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Update playlist fields
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (coverImage) playlist.coverImage = coverImage;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    
    await user.save();
    
    res.status(200).json({
      message: 'Playlist updated successfully',
      playlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a playlist
router.delete('/playlists/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find playlist by ID and remove it
    const playlist = user.playlists.id(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    playlist.remove();
    await user.save();
    
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a track to a playlist
router.post('/playlists/:playlistId/tracks', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { trackId } = req.body;
    
    if (!trackId) {
      return res.status(400).json({ message: 'Track ID is required' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find playlist by ID
    const playlist = user.playlists.id(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if track already exists in playlist
    if (playlist.tracks.includes(trackId)) {
      return res.status(400).json({ message: 'Track already in playlist' });
    }
    
    // Add track to playlist
    playlist.tracks.push(trackId);
    await user.save();
    
    res.status(200).json({
      message: 'Track added to playlist',
      playlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a track from a playlist
router.delete('/playlists/:playlistId/tracks/:trackId', async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find playlist by ID
    const playlist = user.playlists.id(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    // Check if track exists in playlist
    const trackIndex = playlist.tracks.indexOf(trackId);
    
    if (trackIndex === -1) {
      return res.status(404).json({ message: 'Track not found in playlist' });
    }
    
    // Remove track from playlist
    playlist.tracks.splice(trackIndex, 1);
    await user.save();
    
    res.status(200).json({
      message: 'Track removed from playlist',
      playlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's liked songs
router.get('/liked-songs', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.likedSongs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a song to liked songs
router.post('/liked-songs', async (req, res) => {
  try {
    const { trackId } = req.body;
    
    if (!trackId) {
      return res.status(400).json({ message: 'Track ID is required' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if song is already liked
    if (user.likedSongs.includes(trackId)) {
      return res.status(400).json({ message: 'Song already liked' });
    }
    
    // Add song to liked songs
    user.likedSongs.push(trackId);
    await user.save();
    
    res.status(200).json({
      message: 'Song added to liked songs',
      likedSongs: user.likedSongs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a song from liked songs
router.delete('/liked-songs/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if song is liked
    const trackIndex = user.likedSongs.indexOf(trackId);
    
    if (trackIndex === -1) {
      return res.status(404).json({ message: 'Song not found in liked songs' });
    }
    
    // Remove song from liked songs
    user.likedSongs.splice(trackIndex, 1);
    await user.save();
    
    res.status(200).json({
      message: 'Song removed from liked songs',
      likedSongs: user.likedSongs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
// Get all users (admin only)
router.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;