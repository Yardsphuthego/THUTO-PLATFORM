# Thuto BAC - Digital Voting Platform Backend

A secure, scalable, and transparent digital voting platform for educational institutions in Botswana.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Voter Management**: Register students and manage voter eligibility
- **Election Management**: Create and manage elections with multiple candidates
- **Voting System**: Secure ballot casting with voting verification
- **Results & Analytics**: Real-time election results and vote counting
- **Admin Dashboard**: Comprehensive election and voter management

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Python Version**: 3.8+

## Installation

### Prerequisites
- Python 3.8+
- PostgreSQL
- pip

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd thuto-bac-backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and secret key
```

5. Create database tables:
```bash
python -c "from app.db.database import engine; from app.models.models import Base; Base.metadata.create_all(bind=engine)"
```

## Running the Application

Start the development server:
```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Interactive API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/verify-token` - Verify token validity

### Users
- `GET /api/users/` - List all voters
- `GET /api/users/{user_id}` - Get user details
- `PUT /api/users/{user_id}` - Update user information

### Elections
- `POST /api/elections/` - Create new election
- `GET /api/elections/` - List all elections
- `GET /api/elections/{election_id}` - Get election details
- `PUT /api/elections/{election_id}` - Update election
- `GET /api/elections/{election_id}/results` - Get election results

### Votes
- `POST /api/votes/` - Cast a vote
- `GET /api/votes/{election_id}/voter-status/{voter_id}` - Check voting status
- `GET /api/votes/{election_id}` - Get election votes (admin)

## Project Structure

```
thuto-bac-backend/
├── app/
│   ├── core/              # Configuration and security
│   │   ├── config.py      # Settings
│   │   └── security.py    # JWT and password utilities
│   ├── db/                # Database
│   │   └── database.py    # Database connection
│   ├── models/            # SQLAlchemy models
│   │   └── models.py      # User, Election, Candidate, Vote
│   ├── routes/            # API endpoints
│   │   ├── auth.py        # Authentication endpoints
│   │   ├── users.py       # User endpoints
│   │   ├── elections.py   # Election endpoints
│   │   └── votes.py       # Voting endpoints
│   ├── schemas/           # Pydantic schemas
│   │   └── schemas.py     # Request/response models
│   └── main.py            # Application entry point
├── tests/                 # Unit tests
├── requirements.txt       # Python dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 30 minutes (configurable)
- CORS is enabled but should be restricted in production
- Database credentials should be stored in environment variables
- All API endpoints should be protected with authentication in production

## Development

### Running Tests
```bash
pytest tests/
```

### Code Style
```bash
# Format code with black
black app/

# Lint with flake8
flake8 app/
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:password@localhost:5432/thuto_bac |
| SECRET_KEY | JWT secret key | your-secret-key-here |
| ALGORITHM | JWT algorithm | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Token expiration time | 30 |

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Email verification
- [ ] Biometric voting options
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] Audit logging
- [ ] Role-based access control (RBAC)
- [ ] Blockchain integration for vote verification

## Contributing

1. Create a feature branch
2. Commit changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, contact the development team or create an issue in the repository.

---

**Built with ❤️ for Botswana's educational institutions**
