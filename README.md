# CRM Lead Processor - AI-Powered Meeting Analysis

A modern full-stack application that uses AI to extract contact, company, and deal information from meeting summaries. Built with React frontend and FastAPI backend.

## 🚀 Features

- **AI-Powered Extraction**: Uses OpenAI GPT models to extract structured CRM data
- **PII Detection**: Identifies and extracts personally identifiable information
- **Real-time Processing**: Fast API responses with confidence scoring (30-60 seconds)
- **Modern UI**: Clean, responsive React interface with Tailwind CSS
- **Data Persistence**: MongoDB integration for storing leads
- **Export Capabilities**: Download data as CSV or JSON
- **Dashboard Analytics**: View statistics and insights
- **SSL Support**: Works with MongoDB Atlas and local MongoDB instances

## 🏗️ Architecture

```
main-crm-processor/
├── backend/           # FastAPI Python backend
│   ├── main.py       # API server with CORS and error handling
│   ├── models.py     # Pydantic models for data validation
│   ├── database.py   # MongoDB integration with SSL support
│   ├── processor.py  # Core processing logic
│   ├── entity_extractor.py  # OpenAI integration with timeout handling
│   └── pii_detector.py      # PII detection using Presidio
└── frontend/         # React TypeScript frontend
    ├── src/
    │   ├── components/   # React components
    │   ├── services/     # API client with timeout handling
    │   └── types/        # TypeScript types
    └── package.json
```

## 🛠️ Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **MongoDB** (local or Atlas)
- **OpenAI API key** with GPT model access

### 1. Backend Setup

```bash
cd main-crm-processor/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
```

**Edit `.env` file:**
```env
OPENAI_API_KEY=your_openai_api_key_here
MONGO_URI=mongodb://localhost:27017/crm  # or MongoDB Atlas URI
OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini
```

**Start the backend:**
```bash
python run.py
```

✅ API will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
cd main-crm-processor/frontend

# Install dependencies
npm install

# Create environment file (optional)
cp .env.example .env
```

**Edit `.env` file (optional):**
```env
VITE_API_BASE_URL=http://localhost:8000
```

**Start the frontend:**
```bash
npm run dev
```

✅ Frontend will be available at `http://localhost:5173`

## 🔧 Configuration

### MongoDB Setup Options

**Option 1: Local MongoDB**
```bash
# Install MongoDB and start service
mongod
# Use: mongodb://localhost:27017/crm
```

**Option 2: MongoDB Atlas (Recommended)**
1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get connection string (includes SSL configuration)
3. Add to `MONGO_URI` in backend `.env`

### Environment Variables

**Backend (.env)**
```env
OPENAI_API_KEY=your_openai_api_key_here
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crm
OPENAI_MODEL=gpt-4o-mini
```

**Frontend (.env) - Optional**
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📡 API Endpoints

| Method | Endpoint | Description | Timeout |
|--------|----------|-------------|---------|
| `GET` | `/` | Health check | 10s |
| `POST` | `/api/process` | Process meeting summary | 90s |
| `GET` | `/api/leads` | Get all stored leads | 60s |
| `GET` | `/api/stats` | Get aggregated statistics | 60s |
| `DELETE` | `/api/leads` | Clear all leads (testing) | 60s |

## 🧪 Testing

### Test the API directly:

```bash
curl -X POST "http://localhost:8000/api/process" \
  -H "Content-Type: application/json" \
  -d '{"summary": "Met with John Doe from TechCorp about a $50K deal"}'
```

### Example Meeting Summary:

```
Had a call with Sarah Johnson, Marketing Director at GrowthTech Solutions. 
They need marketing automation for their 50-person team. Budget is around $30K annually. 
Currently evaluating HubSpot vs our solution. Next step: Demo scheduled for Friday. 
Sarah has decision-making authority. Company is growing fast, currently using manual processes.
```

## 🔍 Key Features Explained

### AI Processing Pipeline

1. **PII Detection**: Uses Microsoft Presidio to identify sensitive information
2. **Entity Extraction**: OpenAI GPT extracts structured contact/company/deal data
3. **Confidence Scoring**: Calculates extraction quality based on completeness
4. **Data Normalization**: Ensures consistent schema across all records
5. **Timeout Handling**: 60-90 second timeouts for AI processing

### Frontend Components

- **MeetingInput**: Text input with examples and processing controls
- **ProcessingResults**: Displays extracted data with export options
- **Dashboard**: Analytics view with statistics and recent activity
- **Navigation**: Seamless switching between views
- **Error Handling**: Comprehensive error states and retry mechanisms

### Backend Architecture

- **FastAPI**: Modern, fast web framework with automatic API docs
- **Pydantic**: Data validation and serialization
- **MongoDB**: Document storage with SSL support for Atlas
- **LangChain**: OpenAI integration with prompt management
- **Presidio**: PII detection and extraction

## 🚀 Deployment

### Using Docker Compose

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your credentials

# Start all services
docker-compose up -d
```

### Production Considerations

- ✅ SSL certificate handling for MongoDB Atlas
- ✅ Extended timeouts for AI processing
- ✅ CORS configuration for production domains
- ✅ Error handling and retry mechanisms
- ✅ Environment variable validation
- ✅ Connection health checks

## 🆘 Troubleshooting

### Common Issues

**1. MongoDB SSL Certificate Error**
```
[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed
```
**Solution**: The app automatically handles SSL certificates for MongoDB Atlas. If issues persist, check your connection string.

**2. API Timeout Errors**
```
Request timeout - the server is taking too long to respond
```
**Solution**: AI processing takes 30-60 seconds. The frontend automatically handles this with extended timeouts.

**3. OpenAI API Errors**
```
OpenAI not configured. Please check OPENAI_API_KEY
```
**Solution**: 
- Verify `OPENAI_API_KEY` is correct in `.env`
- Check API quota and billing
- Ensure model access permissions

**4. CORS Issues**
```
Access to fetch blocked by CORS policy
```
**Solution**: Backend includes comprehensive CORS settings. Ensure frontend runs on port 5173.

**5. Dashboard Loading Errors**
```
Cannot read properties of undefined
```
**Solution**: Fixed with safe property access and fallback values.

### Getting Help

- 📖 Check API documentation at `http://localhost:8000/docs`
- 🔍 Review console logs for detailed error messages
- ✅ Ensure all environment variables are set correctly
- 🔄 Use the retry buttons in the UI for temporary issues

## 📊 Performance

- **Processing Time**: 30-60 seconds for AI extraction
- **API Timeout**: 90 seconds for processing, 60 seconds for other operations
- **Database**: Optimized queries with proper indexing
- **Frontend**: Responsive design with loading states

## 📄 License

MIT License - see LICENSE file for details

---

## 🎯 Quick Verification

After setup, verify everything works:

1. ✅ Backend starts without errors
2. ✅ Frontend connects to API
3. ✅ MongoDB connection established
4. ✅ Process a test meeting summary
5. ✅ View results in dashboard
6. ✅ Export data as CSV/JSON

**Need help?** Check the troubleshooting section above or review the console logs for specific error messages.