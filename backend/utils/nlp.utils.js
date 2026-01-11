const Doubt = require('../models/Doubt.model');

// Simple keyword-based topic extraction
const topicKeywords = {
  'useState': ['usestate', 'state', 'setstate', 'hook'],
  'useEffect': ['useeffect', 'side effect', 'dependency', 'cleanup'],
  'props': ['props', 'properties', 'pass data', 'parent child'],
  'component': ['component', 'render', 're-render', 'rerender'],
  'event': ['event', 'onclick', 'onchange', 'handler'],
  'styling': ['css', 'style', 'tailwind', 'className']
};

function extractTopic(question) {
  const lowerQuestion = question.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
      return topic;
    }
  }
  
  return 'General';
}

// Simple similarity check using keyword matching
function calculateSimilarity(question1, question2) {
  const words1 = question1.toLowerCase().split(/\s+/);
  const words2 = question2.toLowerCase().split(/\s+/);
  
  const commonWords = words1.filter(word => 
    words2.includes(word) && word.length > 3
  );
  
  return commonWords.length / Math.max(words1.length, words2.length);
}

async function findSimilarDoubts(sessionId, question, threshold = 0.4) {
  const recentDoubts = await Doubt.find({
    sessionId,
    mergedWith: null,
    isAnswered: false,
    createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 minutes
  }).limit(50);

  const similarDoubts = recentDoubts
    .map(doubt => ({
      doubt,
      similarity: calculateSimilarity(question, doubt.question)
    }))
    .filter(item => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .map(item => item.doubt);

  return similarDoubts;
}

module.exports = {
  extractTopic,
  calculateSimilarity,
  findSimilarDoubts
};
