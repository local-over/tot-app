/**
 * Pick today's topic for a user based on their profile and history.
 *
 * Strategy:
 * 1. Filter to user's selected categories
 * 2. Filter by reading style (quick vs deep) if not "mix"
 * 3. Boost categories the user has rated highly, demote poorly-rated ones
 * 4. Prefer topics the user hasn't read yet
 * 5. Use date as seed for deterministic daily selection
 */
export function getRecommendation(topics, userProfile, feedbackHistory = []) {
  const { categories: userCategories, readingStyle, contentVibe } = userProfile;

  // 1. Filter to user's categories
  let pool = topics.filter(t => userCategories.includes(t.categoryId));

  // 2. Filter by reading style
  if (readingStyle === 'quick') {
    pool = pool.filter(t => t.readTime <= 3);
  } else if (readingStyle === 'deep') {
    pool = pool.filter(t => t.readTime >= 4);
  }
  // 'mix' = no filter

  // 3. Filter by vibe if user has a preference
  if (contentVibe && contentVibe !== 'mix') {
    const vibeMatches = pool.filter(t => t.vibe === contentVibe);
    if (vibeMatches.length > 0) {
      // 60% chance to match vibe, 40% chance any topic
      pool = vibeMatches.length >= 3 ? vibeMatches : pool;
    }
  }

  // 4. Remove already-read topics
  const readIds = new Set(feedbackHistory.map(f => f.topicId));
  const unread = pool.filter(t => !readIds.has(t.$id));
  if (unread.length > 0) {
    pool = unread;
  }

  // 5. Build category weights from feedback
  const categoryScores = {};
  for (const fb of feedbackHistory) {
    const topic = topics.find(t => t.$id === fb.topicId);
    if (!topic) continue;
    const cat = topic.categoryId;
    if (!categoryScores[cat]) categoryScores[cat] = { total: 0, count: 0 };
    categoryScores[cat].total += fb.rating;
    categoryScores[cat].count += 1;

    // "More" preference boosts, "Less" demotes
    if (fb.moreOrLess === 'more') categoryScores[cat].total += 1;
    if (fb.moreOrLess === 'less') categoryScores[cat].total -= 1;
  }

  // 6. Score each topic
  const scored = pool.map(topic => {
    let score = 1;
    const catScore = categoryScores[topic.categoryId];
    if (catScore) {
      const avg = catScore.total / catScore.count;
      score *= (avg / 3); // normalize around 1
    }
    return { topic, score };
  });

  // 7. Use today's date as a deterministic seed
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  // Sort by score descending, then use date seed to pick among top candidates
  scored.sort((a, b) => b.score - a.score);
  const topN = scored.slice(0, Math.max(3, Math.ceil(scored.length / 2)));
  const index = dateSeed % topN.length;

  return topN[index]?.topic || topics[dateSeed % topics.length];
}

/**
 * Get reading streak from feedback history.
 */
export function getStreak(feedbackHistory = []) {
  if (feedbackHistory.length === 0) return 0;

  // Sort by date descending
  const sorted = [...feedbackHistory]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const feedbackDate = new Date(sorted[i].date);
    feedbackDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (feedbackDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
