# CRM Lead Processor - Full Stack Application

A modern full-stack application that uses AI to extract contact, company, and deal information from meeting summaries. Built with React frontend and FastAPI backend.

## 🚀 Features

- **AI-Powered Extraction**: Uses OpenAI GPT models to extract structured CRM data
- **PII Detection**: Identifies and flags personally identifiable information
- **Real-time Processing**: Fast API responses with confidence scoring
- **Modern UI**: Clean, responsive React interface with Tailwind CSS
- **Data Persistence**: MongoDB integration for storing leads
- **Export Capabilities**: Download data as CSV or JSON
- **Dashboard Analytics**: View statistics and insights

## 🏗️ Architecture

```
main-crm-processor/
├── backend/           # FastAPI Python backend
│   ├── main.py       # API server
│   ├── models.py     # Pydantic models
│   ├── database.py   # MongoDB integration
│   ├── processor.py  # Core processing logic
│   ├── entity_extractor.py  # OpenAI integration
│   └── pii_detector.py      # PII detection
└── frontend/         # React TypeScript frontend
    ├── src/
    │   ├── components/   # React components
    │   ├── services/     # API client
    │   └── types/        # TypeScript types
    └── package.json
```

## 🛠️ Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)
- OpenAI API key

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
# Edit .env with your credentials:
# OPENAI_API_KEY=your_openai_key
# MONGO_URI=your_mongodb_uri

# Start the backend server
python run.py
```

The API will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
cd main-crm-processor/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
OPENAI_API_KEY=your_openai_api_key
MONGO_URI=mongodb://localhost:27017/crm  # or MongoDB Atlas URI
OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:8000
```

### MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB and start service
mongod
```

**MongoDB Atlas:**
1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get connection string
3. Add to MONGO_URI in backend .env

## 📡 API Endpoints

- `POST /api/process` - Process meeting summary
- `GET /api/leads` - Get all stored leads
- `GET /api/stats` - Get aggregated statistics
- `DELETE /api/leads` - Clear all leads (testing)
- `GET /` - Health check

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

### Frontend Components

- **MeetingInput**: Text input with examples and processing controls
- **ProcessingResults**: Displays extracted data with export options
- **Dashboard**: Analytics view with statistics and recent activity
- **Navigation**: Seamless switching between views

### Backend Architecture

- **FastAPI**: Modern, fast web framework with automatic API docs
- **Pydantic**: Data validation and serialization
- **MongoDB**: Document storage for flexible lead data
- **LangChain**: OpenAI integration with prompt management

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

- Use environment-specific configurations
- Set up proper logging and monitoring
- Configure CORS for production domains
- Use production MongoDB cluster
- Implement rate limiting and authentication

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MONGO_URI in .env
   - Ensure MongoDB is running
   - Verify network connectivity

2. **OpenAI API Error**
   - Verify OPENAI_API_KEY is correct
   - Check API quota and billing
   - Ensure model access permissions

3. **CORS Issues**
   - Check frontend URL in backend CORS settings
   - Verify ports match (frontend: 5173, backend: 8000)

4. **Dependencies Issues**
   - Update pip: `pip install --upgrade pip`
   - Clear npm cache: `npm cache clean --force`
   - Reinstall dependencies

### Getting Help

- Check the API documentation at `http://localhost:8000/docs`
- Review console logs for detailed error messages
- Ensure all environment variables are set correctly

## 📄 License

MIT License - see LICENSE file for details