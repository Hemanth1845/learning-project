const fetch = require('node-fetch').default || (() => import('node-fetch').then(({default: f}) => f));

// Helper to perform API call to Google Gemini
const callGemini = async (prompt, systemInstruction = '') => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // If system instruction is provided, we structure the request accordingly
  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ];

  const body = {
    contents,
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  try {
    // Dynamic import of node-fetch or native global fetch if available
    const myFetch = typeof fetch === 'function' ? fetch : global.fetch;
    const response = await myFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.warn('Invalid Gemini API response shape:', JSON.stringify(data));
      throw new Error('API did not return a valid candidate.');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

// Extracted skills helper
const extractSkills = (resumeText) => {
  const skillsList = ['javascript', 'react', 'node', 'python', 'java', 'c++', 'sql', 'mongodb', 'express', 'html', 'css', 'docker', 'aws', 'machine learning', 'data science', 'generative ai', 'typescript', 'django', 'spring boot'];
  const textLower = resumeText.toLowerCase();
  const matched = [];
  skillsList.forEach(skill => {
    if (textLower.includes(skill)) {
      matched.push(skill.toUpperCase());
    }
  });
  return matched.length > 0 ? matched : ['SOFTWARE ENGINEERING', 'DSA', 'SQL'];
};

// Fallback response generator (simulates an AI interviewer offline or when API key is missing)
const getFallbackQuestion = (companyName, difficulty, chatHistory, resumeText) => {
  const skills = extractSkills(resumeText);
  const round = Math.floor(chatHistory.length / 2); // each round is 1 ai question + 1 user answer

  const companyQuestions = {
    TCS: [
      `Welcome to your TCS Technical Interview. Based on your resume, you have experience with ${skills.slice(0, 3).join(', ')}. Let's start with a foundational question: Can you explain the difference between a Process and a Thread in operating systems?`,
      `Great. For our next question: How do you handle database normalization? What is the main purpose of 3NF (Third Normal Form)?`,
      `Thank you. Let's look at programming. In ${skills[0] || 'Java/Python'}, what is the difference between synchronous and asynchronous execution?`,
      `Lastly, tell me about a challenging project from your resume where you used ${skills[0] || 'your core skills'}. What was your role and how did you solve the key challenges?`
    ],
    Infosys: [
      `Hi! Welcome to the Infosys Technical assessment. I notice you highlight ${skills.slice(0, 2).join(' and ')} in your resume. Let's begin: Can you describe the primary principles of Object-Oriented Programming (OOP) and give a real-world example of Polymorphism?`,
      `Good. Let's discuss data structures. How does a HashMap work internally, and what is its average and worst-case time complexity?`,
      `Excellent. For the next round: What are the differences between RESTful APIs and SOAP, and which one would you choose for a lightweight mobile app?`,
      `Finally: What steps do you take to optimize code performance and ensure clean code standards during development?`
    ],
    Amazon: [
      `Welcome to the Amazon Software Development Engineer (SDE) interview. We'll start with a DSA and problem-solving focus: Given an array of integers, how would you find the maximum subarray sum? Can you explain the approach and its time/space complexity?`,
      `Let's discuss system design. If you were building a scaleable rate limiter for Amazon API requests, how would you approach the design and what caching strategy would you use?`,
      `Amazon values leadership principles. Tell me about a time when you had to make a quick decision without complete data. How did you handle it and what was the outcome?`,
      `Looking at your resume, you worked on projects using ${skills[0]}. If we needed to scale this project to handle 10 million daily active users, where would the primary bottlenecks be and how would you resolve them?`
    ],
    Default: [
      `Welcome to your Technical Mock Interview. Let's start by discussing your background: I see you have experience with ${skills.slice(0, 3).join(', ')}. Can you give a quick 2-minute overview of your most significant project?`,
      `Excellent. Let's dive deeper: Can you explain how memory management works in your preferred programming language, and how memory leaks can be avoided?`,
      `Great. In system design or database architecture, how do SQL and NoSQL databases differ? Under what scenarios would you choose MongoDB over PostgreSQL?`,
      `To wrap up our interview: What is the most difficult technical bug you have faced in your projects, and how did you go about debugging and solving it?`
    ]
  };

  const list = companyQuestions[companyName] || companyQuestions.Default;
  if (round < list.length) {
    return list[round];
  }
  return null;
};

// Generates feedback scorecard in fallback mode
const getFallbackFeedback = (companyName, difficulty, chatHistory, resumeText) => {
  const skills = extractSkills(resumeText);
  // Calculate average score based on difficulty and length of responses
  let score = 75;
  if (difficulty === 'Easy') score = 82;
  if (difficulty === 'Hard') score = 68;

  // Enhance score slightly if user gave detailed responses
  let totalLength = 0;
  chatHistory.forEach(msg => {
    if (msg.sender === 'user') totalLength += msg.message.length;
  });
  if (totalLength > 300) score += 8;
  if (score > 98) score = 98;

  return {
    overallScore: score,
    summary: `You completed a ${difficulty} difficulty mock interview for ${companyName}. You showed solid knowledge in foundational areas, especially relating to your resume stack (${skills.slice(0, 2).join(', ')}). Your communications were clear, though technical details can be expanded.`,
    strengths: [
      `Familiarity with core stack: ${skills.slice(0, 3).join(', ')}`,
      `Clear structured communication during technical explanations`,
      `Good understanding of practical application in projects`
    ],
    weaknesses: [
      `Could provide deeper explanations of algorithmic complexity`,
      difficulty === 'Hard' ? `Needs deeper systems architecture understanding under high loads` : `Could elaborate more on edge case handling in programming questions`
    ],
    tips: [
      `Practice explaining your code line-by-line while considering space/time optimization`,
      `Review system architecture patterns like caching, replication, and load balancing`,
      `Review standard behavioral frameworks (STAR method) for Amazon and product-firm interviews`
    ]
  };
};

const callGeminiWithMedia = async (fileBase64, mimeType, prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = [
    {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: fileBase64
          }
        },
        {
          text: prompt
        }
      ]
    }
  ];

  const body = {
    contents,
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  try {
    const myFetch = typeof fetch === 'function' ? fetch : global.fetch;
    const response = await myFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.warn('Invalid Gemini API response shape:', JSON.stringify(data));
      throw new Error('API did not return a valid candidate.');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

module.exports = {
  callGemini,
  callGeminiWithMedia,
  getFallbackQuestion,
  getFallbackFeedback,
  extractSkills
};

