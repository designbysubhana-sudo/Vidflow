const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'videos.json');

/**
 * Helper to safely read videos from JSON file
 */
function readVideos() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading videos file:', err);
    return [];
  }
}

/**
 * Helper to safely write videos to JSON file
 */
function writeVideos(videos) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(videos, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing videos file:', err);
    return false;
  }
}

/**
 * GET /api/videos
 * Returns list of videos with optional status filtering
 */
router.get('/', (req, res) => {
  try {
    let videos = readVideos();
    const { status, date } = req.query;

    if (status && status !== 'all') {
      videos = videos.filter(v => v.status === status);
    }

    if (date) {
      videos = videos.filter(v => v.date === date);
    }

    // Sort chronologically by date and time
    videos.sort((a, b) => {
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return new Date(`${a.date}T${timeA}`) - new Date(`${b.date}T${timeB}`);
    });

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve videos' });
  }
});

/**
 * GET /api/stats
 * Returns summary counts for dashboard and home
 */
router.get('/stats', (req, res) => {
  try {
    const videos = readVideos();
    const published = videos.filter(v => v.status === 'published').length;
    const scheduled = videos.filter(v => v.status === 'scheduled').length;
    const draft = videos.filter(v => v.status === 'draft').length;

    res.json({
      published,
      scheduled,
      draft,
      total: videos.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

/**
 * GET /api/videos/:id
 * Retrieve single video by ID
 */
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const videos = readVideos();
    const video = videos.find(v => v.id === id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve video' });
  }
});

/**
 * POST /api/videos
 * Create a new video (Draft, Published, or Scheduled)
 */
router.post('/', (req, res) => {
  try {
    const {
      title,
      description = '',
      thumbnail = '',
      tags = [],
      status = 'draft',
      publishedDate,
      publishedTime,
      scheduledDate,
      scheduledTime,
      date,
      time = ''
    } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Video title is required' });
    }

    const now = new Date();
    const todayString = now.toISOString().split('T')[0];
    const currentTimeString = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    let finalStatus = status;
    let finalDate = date || todayString;
    let finalTime = time || '';
    let finalPublishedDate = publishedDate || null;
    let finalPublishedTime = publishedTime || null;
    let finalScheduledDate = scheduledDate || null;
    let finalScheduledTime = scheduledTime || null;

    if (finalStatus === 'published') {
      finalPublishedDate = finalPublishedDate || finalDate || todayString;
      finalPublishedTime = finalPublishedTime || finalTime || currentTimeString;
      finalDate = finalPublishedDate;
      finalTime = finalPublishedTime;
    } else if (finalStatus === 'scheduled') {
      finalScheduledDate = finalScheduledDate || finalDate;
      finalScheduledTime = finalScheduledTime || finalTime;
      finalDate = finalScheduledDate || todayString;
      finalTime = finalScheduledTime || '';
    } else {
      finalStatus = 'draft';
      finalDate = finalDate || todayString;
      finalTime = '';
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    const newVideo = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80',
      tags: parsedTags,
      status: finalStatus,
      publishedDate: finalPublishedDate,
      publishedTime: finalPublishedTime,
      scheduledDate: finalScheduledDate,
      scheduledTime: finalScheduledTime,
      date: finalDate,
      time: finalTime,
      createdAt: now.toISOString()
    };

    const videos = readVideos();
    videos.push(newVideo);
    writeVideos(videos);

    res.status(201).json(newVideo);
  } catch (err) {
    console.error('Error creating video:', err);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

/**
 * PUT /api/videos/:id
 * Update an existing video
 */
router.put('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const videos = readVideos();
    const index = videos.findIndex(v => v.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const current = videos[index];
    const {
      title,
      description,
      thumbnail,
      tags,
      status,
      date,
      time,
      publishedDate,
      publishedTime,
      scheduledDate,
      scheduledTime
    } = req.body;

    const updated = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      description: description !== undefined ? description.trim() : current.description,
      thumbnail: thumbnail !== undefined ? thumbnail.trim() : current.thumbnail,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean)) : current.tags,
      status: status || current.status,
      date: date || current.date,
      time: time !== undefined ? time : current.time,
      publishedDate: publishedDate !== undefined ? publishedDate : current.publishedDate,
      publishedTime: publishedTime !== undefined ? publishedTime : current.publishedTime,
      scheduledDate: scheduledDate !== undefined ? scheduledDate : current.scheduledDate,
      scheduledTime: scheduledTime !== undefined ? scheduledTime : current.scheduledTime,
      updatedAt: new Date().toISOString()
    };

    videos[index] = updated;
    writeVideos(videos);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update video' });
  }
});

/**
 * DELETE /api/videos/:id
 * Delete a video by ID
 */
router.delete('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    let videos = readVideos();
    const existing = videos.find(v => v.id === id);

    if (!existing) {
      return res.status(404).json({ error: 'Video not found' });
    }

    videos = videos.filter(v => v.id !== id);
    writeVideos(videos);

    res.json({
      success: true,
      message: 'Video deleted successfully',
      id
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

module.exports = router;
