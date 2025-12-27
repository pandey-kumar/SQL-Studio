const Assignment = require('../models/Assignment.model');

// LLM API configuration - supports both OpenAI and Gemini
const getLLMResponse = async (prompt) => {
  // Try OpenAI first, then Gemini
  if (process.env.OPENAI_API_KEY) {
    return await callOpenAI(prompt);
  } else if (process.env.GEMINI_API_KEY) {
    return await callGemini(prompt);
  } else {
    throw new Error('No LLM API key configured');
  }
};

// OpenAI API call
const callOpenAI = async (prompt) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful SQL tutor. Your role is to provide hints and guidance to help students learn SQL, NOT to give them complete solutions.

IMPORTANT RULES:
1. NEVER provide the complete SQL query solution
2. Give conceptual hints about SQL concepts they need
3. Point them in the right direction without solving it for them
4. If they're close, acknowledge what's correct and hint at what's missing
5. Use encouraging language
6. Keep hints concise (2-3 sentences max)
7. You can mention SQL keywords they might need, but don't show how to combine them`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI API error');
  }
  
  return data.choices[0].message.content;
};

// Google Gemini API call
const callGemini = async (prompt) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a helpful SQL tutor. Your role is to provide hints and guidance to help students learn SQL, NOT to give them complete solutions.

IMPORTANT RULES:
1. NEVER provide the complete SQL query solution
2. Give conceptual hints about SQL concepts they need
3. Point them in the right direction without solving it for them
4. If they're close, acknowledge what's correct and hint at what's missing
5. Use encouraging language
6. Keep hints concise (2-3 sentences max)
7. You can mention SQL keywords they might need, but don't show how to combine them

Student's question: ${prompt}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7
        }
      })
    }
  );

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gemini API error');
  }
  
  return data.candidates[0].content.parts[0].text;
};

// Get hint for an assignment
exports.getHint = async (req, res, next) => {
  try {
    const { assignmentId, currentQuery, specificQuestion } = req.body;

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        message: 'Assignment ID is required'
      });
    }

    // Get the assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Build the prompt for LLM
    const tableInfo = assignment.sampleTables.map(table => {
      const columns = table.columns.map(c => `${c.columnName} (${c.dataType})`).join(', ');
      return `Table: ${table.tableName}\nColumns: ${columns}`;
    }).join('\n\n');

    let prompt = `
SQL Assignment: "${assignment.title}"
Question: ${assignment.question}
Difficulty: ${assignment.difficulty}

Available Tables:
${tableInfo}

`;

    if (currentQuery && currentQuery.trim()) {
      prompt += `\nStudent's current attempt:\n${currentQuery}\n`;
    }

    if (specificQuestion) {
      prompt += `\nStudent's specific question: ${specificQuestion}\n`;
    }

    prompt += `\nProvide a helpful hint to guide the student without giving away the solution.`;

    // Get hint from LLM
    const hint = await getLLMResponse(prompt);

    res.status(200).json({
      success: true,
      data: {
        hint,
        hintsRemaining: 3 // You can implement hint limiting logic
      }
    });
  } catch (error) {
    console.error('LLM Error:', error);
    
    // Fallback to predefined hints if LLM fails (rate limit, API error, etc.)
    const assignment = await Assignment.findById(req.body.assignmentId);
    const fallbackHint = assignment?.hints?.[0] || 
      'Try breaking down the problem into smaller parts. What tables do you need? What columns?';
    
    return res.status(200).json({
      success: true,
      data: {
        hint: fallbackHint,
        hintsRemaining: 3,
        fallback: true,
        message: error.message.includes('quota') ? 'AI hint service is rate limited. Using predefined hint.' : undefined
      }
    });
  }
};

// Get concept explanation
exports.explainConcept = async (req, res, next) => {
  try {
    const { concept } = req.body;

    if (!concept) {
      return res.status(400).json({
        success: false,
        message: 'Concept is required'
      });
    }

    const prompt = `Explain the SQL concept "${concept}" in simple terms. 
    - Keep it brief (3-4 sentences)
    - Give a simple example if helpful
    - Focus on when and why to use it`;

    const explanation = await getLLMResponse(prompt);

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation
      }
    });
  } catch (error) {
    next(error);
  }
};
