const PageView = require('../models/PageView');

// ── Helper: detect device from UA ───────────────────────────────────────────
function detectDevice(ua = '') {
  const s = ua.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(s)) return 'mobile';
  if (/tablet|ipad/.test(s)) return 'tablet';
  return 'desktop';
}

// POST /api/analytics/pageview  — Public (fire-and-forget from frontend)
exports.trackPageView = async (req, res) => {
  try {
    const { page } = req.body;
    if (!page) return res.status(400).json({ success: false, message: 'page is required' });

    const ua = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || req.body.referer || '';

    await PageView.create({
      page,
      referer,
      userAgent: ua.substring(0, 300),
      device: detectDevice(ua),
    });

    res.json({ success: true });
  } catch (err) {
    // Never crash the site for analytics errors
    res.json({ success: false });
  }
};

// GET /api/analytics/stats  — Admin
exports.getStats = async (req, res) => {
  try {
    const { page, days = 30 } = req.query;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const filter = { createdAt: { $gte: since } };
    if (page) filter.page = page;

    const [total, byDevice, topPages, dailyTrend] = await Promise.all([
      PageView.countDocuments(filter),

      PageView.aggregate([
        { $match: filter },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      PageView.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      PageView.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({ success: true, total, byDevice, topPages, dailyTrend });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
