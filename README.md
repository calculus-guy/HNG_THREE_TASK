An intelligent AI agent built with Mastra that challenges your viewpoints by taking the opposite stance in any debate. Perfect for critical thinking practice, exam preparation, and exploring alternative perspectives.

## 🎯 What It Does

The Debate Partner Agent is an AI-powered debate companion that:
- **Always takes the opposite stance** to your arguments
- **Provides 2-3 well-reasoned counterarguments** with logical reasoning
- **Maintains conversation context** across multiple debate rounds
- **Generates comprehensive summaries** of the debate upon request
- **Keeps a respectful and educational tone** throughout the conversation

### Key Features

✅ Automatic counter-argumentation on any topic
✅ Numbered, structured responses with clear reasoning
✅ Context-aware conversation tracking
✅ Debate summarization after 3+ rounds
✅ Integration with Telex.im via A2A protocol
✅ RESTful API for external integrations

---

## 🚀 How It Works

1. **User shares an opinion** on any topic (e.g., "I think remote work is better than office work")
2. **Agent analyzes the statement** and takes the opposing position
3. **Agent responds with 2-3 counterarguments** backed by logical reasoning
4. **User continues the debate** with rebuttals or new points
5. **Agent maintains context** and adapts responses based on conversation history
6. **User requests summary** by typing "summarize", "end", or "summary" after 3+ rounds
7. **Agent provides comprehensive summary** covering both perspectives


## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone 
cd debate-partner-agent
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
GOOGLE_API_KEY=your_gemini_api_key_here
NODE_ENV=production
```

## 🏃‍♂️ Running Locally

### Development Mode

npm run dev
```

The server will start at `http://localhost:3000`

### Production Mode
npm run build
npm start
```

---

##  API Endpoints

### 1. A2A Protocol Endpoint (Telex Integration)

**Endpoint:** `POST https://hngthreetask-production.up.railway.app/a2a/agent/debateAgent`

**Request Format:**
```json
{
  "message": {
    "role": "user",
    "content": "I think AI will replace all jobs"
  },
  "conversationId": "unique-conversation-id",
  "metadata": {
    "channelId": "channel-id",
    "userId": "user-id"
  }
}
```

**Response Format:**
```json
{
  "message": {
    "role": "assistant",
    "content": "Interesting view! But I disagree because:\n1. AI creates new job categories...\n2. Human creativity remains irreplaceable...\n3. Historical technological shifts increased employment...\n\nWhat are your thoughts on AI augmenting rather than replacing human work?"
  }
}
```

### 2. Standard API Endpoint

**Endpoint:** `POST /api/mastra/debate`

**Request Format:**
```json
{
  "message": {
    "content": "I think remote work is better"
  },
  "conversationId": "optional-conv-id",
  "topic": "Remote Work"
}
```

**Response Format:**
```json
{
  "conversationId": "generated-or-provided-id",
  "reply": "Counter-arguments from the agent...",
  "turn": 1,
  "summary": null
}
```

### 3. Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T10:00:00Z"
}
```

---

## 🔗 Telex.im Integration

### Step 1: Get Telex Access

Run this command in HNG Slack:
```
/telex-invite your-email@example.com
```

### Step 2: Upload Workflow

1. Log into Telex.im
2. Navigate to **AI Coworkers** section
3. Click **"Add New"**
4. Fill in the form or upload `workflow.json`

### Step 3: Configure the Agent

- **Name:** Debate Partner Agent
- **Category:** Education & Learning
- **Endpoint URL:** `https://your-app.railway.app/a2a/agent/debateAgent`
- **Visibility:** Public
- **Status:** Active

### Step 4: Test in Telex

In any Telex channel:
```
@debate_partner_agent I think climate change is exaggerated
```

The agent will respond with counter-arguments!

---

## 📊 Usage Examples

### Example 1: Basic Debate

**User:**
> I think cryptocurrencies are the future of money

**Agent:**
> Interesting view! But I disagree because:
> 1. Extreme volatility makes cryptocurrencies unreliable as a store of value or medium of exchange
> 2. Lack of regulation creates opportunities for fraud and manipulation
> 3. Energy consumption of blockchain technology is environmentally unsustainable
>
> What are your thoughts on the role of government regulation in financial systems?

### Example 2: Multi-Round Debate

**Round 1:**
> User: Remote work is more productive

**Round 2:**
> User: But people can manage their own time better

**Round 3:**
> User: Studies show remote workers are happier

**Round 4:**
> User: summarize

**Agent:** Provides comprehensive summary of all arguments from both sides.

---

## 🚢 Deployment

### Deploy to Railway

1. **Connect your GitHub repository** to Railway
2. **Add environment variables:**
   - `GOOGLE_API_KEY`
   - `PORT` (Railway auto-assigns)
3. **Deploy** - Railway will auto-detect Node.js and deploy
4. **Copy your Railway URL** (e.g., `https://your-app.railway.app`)
5. **Update workflow.json** with your Railway URL
6. **Upload to Telex**

### Deploy to Other Platforms

The app works on any Node.js hosting platform:
- Heroku
- Vercel (with serverless functions)
- AWS EC2
- DigitalOcean
- Render

---

## 🧪 Testing

### Test with cURL
```bash
# Test A2A endpoint
curl -X POST https://your-app.railway.app/a2a/agent/debateAgent \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "content": "I think pineapple belongs on pizza"
    },
    "conversationId": "test-123"
  }'
```

### Test with Postman

1. Import the endpoints
2. Set method to `POST`
3. Add JSON body with message content
4. Send request and verify response format

---

## 🔍 Monitoring & Logs

### View Telex Logs
```
https://api.telex.im/agent-logs/{channel-id}.txt
```

Replace `{channel-id}` with your Telex channel UUID from the URL.

### View Railway Logs

1. Go to Railway dashboard
2. Select your project
3. Click "Deployments"
4. View real-time logs

---

## 🛡️ Features

- ✅ **Context Preservation:** Remembers conversation history per session
- ✅ **Smart Summarization:** Generates summaries on demand or after 3 rounds
- ✅ **Flexible Topics:** Works on any debate topic
- ✅ **Respectful Tone:** Maintains educational and constructive dialogue
- ✅ **A2A Protocol:** Fully compliant with Telex A2A standard
- ✅ **Error Handling:** Graceful error responses
- ✅ **CORS Support:** Works with web-based integrations

---

## 📖 Technical Stack

- **Framework:** Express.js (Node.js)
- **AI Agent Library:** Mastra
- **LLM:** Google Gemini 2.0 Flash
- **Language:** TypeScript
- **Hosting:** Railway
- **Integration Protocol:** A2A (Agent-to-Agent)

---

## 🐛 Troubleshooting

### Agent doesn't respond in Telex

1. Check if agent is **added to the channel**
2. Verify agent is **Active** in settings
3. Try mentioning with `@debate_partner_agent`
4. Check Telex logs for errors

### "No message content provided" error

- Ensure request body includes `message.content` field
- Check that content is not empty string

### Conversation history not working

- Verify `conversationId` is consistent across requests
- Check Railway logs for memory storage issues

### Response format errors

- Ensure response always includes `message.role` and `message.content`
- Return status `200` for all successful responses

---

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `8080` |
| `GOOGLE_API_KEY` | Yes | Google Gemini API key | `AIza...` |
| `NODE_ENV` | No | Environment mode | `production` |
## 👨‍💻 Author

**Abdul Lateef Sakariyau**

Built with Mastra for HNG Internship Stage 3

---

## 🔗 Links

- **Live Agent:** https://telex.im/telex-ai-intergration/dm/019a4636-2611-740a-a78a-f762b2c383dd/019a4632-79ae-739c-8f16-427caecdaf76

- **API Endpoint:** https://hngthreetask-production.up.railway.app/a2a/agent/debateAgent
- **Blog Post:** 
- **Tweet:** 

**Ready to debate? Challenge the AI and strengthen your critical thinking!** 🧠💪