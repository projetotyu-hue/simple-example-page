# Sentinel-Shield Project Structure Analysis

## Overview
Sentinel-Shield is a security monitoring and e-commerce platform consisting of:
- A Flask-based backend server providing APIs for authentication, payment processing, security monitoring, and analytics
- A React/TypeScript frontend application for the admin dashboard
- A static HTML/CSS/JS storefront for customer-facing e-commerce
- Database initialization scripts
- Asset management with self-healing proxy capabilities

## Directory Structure

```
/sentinel-shield
├── /admin                 # Admin panel HTML pages
├── /assets                # Shared CSS, JS, and component files
├── /backend               # Python Flask backend application
├── /database              # Database setup and initialization
├── /lovable               # React/TypeScript admin dashboard (Vite)
├── /src                   # Alternative React/TypeScript admin dashboard
├── /store                 # Customer-facing e-commerce storefront
├── /supabase              # Supabase edge functions and schema
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
└── generate_pages.py      # Script to generate admin pages
```

## Detailed File Analysis

### Backend Components (`/backend`)
Core Flask application handling business logic, security, and API endpoints.

1. **server.py** (Main Application)
   - Entry point for Flask server
   - Implements self-healing asset proxy (serves from local cache or downloads from origin)
   - Handles authentication, payment processing, security monitoring
   - Features: rate limiting, input validation, security headers, CORS protection
   - Port: 8080 (configurable)

2. **auth.py**
   - User credential verification
   - JWT token generation and validation
   - Password hashing (using werkzeug)

3. **db.py**
   - SQLite database connection management
   - Connection pooling and transaction handling

4. **logs.py**
   - Event logging to database
   - Log retrieval and formatting

5. **metrics.py**
   - Traffic and user metrics collection
   - Geographic and device analytics

6. **payment_gateway.py**
   - Integration with payment processors (Mercado Pago simulation)
   - Transaction processing and status reporting

7. **security_audit.py**
   - Comprehensive security monitoring:
     - Rate limiting
     - Input validation and sanitization
     - Header security checks
     - Session control
     - Permission checking
     - Brute force detection
     - Security alerting

8. **card_secure.py**
   - Credit card number masking (PCI DSS compliance)
   - CPF (Brazilian tax ID) masking

9. **card_detect.py**
   - Credit card brand identification (Visa, Mastercard, etc.)

### Frontend Components

#### Admin Dashboard (`/lovable` and `/src`)
Two React/TypeScript implementations (likely alternatives):

1. **Package Management**
   - `package.json`: Dependencies including React, Vite, Supabase
   - `package-lock.json`: Locked dependency versions
   - `vite.config.ts`: Vite bundler configuration
   - `tailwind.config.js`: Tailwind CSS configuration
   - `postcss.config.js`: PostCSS configuration

2. **Source Code (`/src`)**
   - `main.tsx`: Application entry point
   - `App.tsx`: Main application component with routing
   - `/pages`: Dashboard and Login pages
   - `/components/ui`: Reusable UI components (Button, Input)
   - `/lib`: Supabase client initialization and utility functions

#### Storefront (`/store`)
Static e-commerce storefront with self-healing capabilities:

1. **Core Files**
   - `index.html`: Main storefront page
   - `assets/css/style.css`: Primary stylesheet
   - `assets/js/`: JavaScript functionality
     - `api.js`: API communication layer
     - `auth.js`: Authentication handling
     - `dashboard.js`: Dashboard-specific logic
     - `payments.js`: Payment processing
     - `card-capture.js`: Secure card input handling
     - `social-proof.js`: Social proof notifications
     - `/components/`: Reusable components (sidebar, topbar)
     - `/services/`: Business logic services (analytics, monitoring, etc.)

2. **Product Assets**
   - Images: Product photos, avatars, banners
   - Videos: Product demonstration videos
   - JavaScript modules: Product data, cart functionality, checkout process

### Database Components
1. **/database/setup.py**: Initializes SQLite database with required tables
2. **/database/database.sqlite**: SQLite database file (runtime)

### Supabase Integration
1. **/supabase/schema.sql**: Database schema definitions
2. **/supabase/functions/**: Edge functions for:
   - Card capture processing
   - Metrics retrieval
   - Event logging

### Configuration Files
1. **.env**: Environment variables (Supabase URL and anonymous key)
2. **requirements.txt**: Python package dependencies
3. **generate_pages.py**: Script to generate admin panel HTML pages

## Key Features

### Security Architecture
- Multi-layered security approach:
  - Network-level: Rate limiting, IP-based restrictions
  - Application-level: Input validation, output encoding
  - Data-level: Encryption at rest, PCI DSS compliance for card data
  - Monitoring: Real-time security auditing and alerting
  - OWASP Top 10 protection

### Self-Healing Asset System
- Proxy pattern for asset delivery:
  1. Attempt to serve from local cache
  2. If missing and not in offline mode, download from origin
  3. Cache locally for future requests
  4. Fallback to 404 if origin unavailable

### Analytics and Monitoring
- Real-time traffic analytics
- Geographic and device tracking
- Conversion funnel monitoring
- Security event correlation
- Payment processing metrics

### Payment Processing
- PCI DSS compliant card handling
- Tokenization of sensitive data
- Multiple payment gateway support
- Fraud detection integration
- Refund and dispute handling

## Technology Stack

### Backend
- Python 3.13
- Flask web framework
- SQLite database
- Werkzeug security utilities
- Requests library for HTTP
- User-Agents library for device detection

### Frontend (Admin)
- React 18
- TypeScript
- Vite bundler
- Tailwind CSS
- Supabase client

### Frontend (Store)
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- No framework (for performance and compatibility)

### Infrastructure
- SQLite for development/production
- Supabase for authentication and edge functions
- Self-hosted asset proxy

## Setup Instructions

1. **Environment Setup**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Database Initialization**
   ```bash
   python database/setup.py
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Add Supabase credentials

4. **Start Server**
   ```bash
   python backend/server.py
   ```

5. **Access Applications**
   - Admin Dashboard: http://localhost:8080/admin/login
   - Storefront: http://localhost:8080/

## Data Flow

1. **User Request** → Flask Server
2. **Static Assets** → Served via self-healing proxy
3. **API Requests** → Authenticated endpoints
4. **Business Logic** → Processing in backend modules
5. **Data Storage** → SQLite database
6. **Security Events** → Logging and alerting system
7. **Analytics Collection** → Metrics aggregation
8. **Response** → JSON API or HTML rendering

## Extensibility Points

1. **Payment Gateways**: Add new processors in `payment_gateway.py`
2. **Security Rules**: Extend `security_audit.py` with new checks
3. **Analytics**: Add new metrics in `metrics.py` and `analytics.py`
4. **Frontend Components**: Modify React components in `/lovable/src` or `/src`
5. **Storefront Features**: Update JavaScript services in `/store/assets/js/services/`
6. **Database Schema**: Modify `setup.py` and Supabase schema

## Compliance and Standards

- PCI DSS Level 1 for card data handling
- GDPR-compliant data processing
- OWASP ASVS Level 2 security controls
- WCAG 2.1 AA accessibility (frontend)
- Responsive design for mobile compatibility

## Known Limitations

1. **Scalability**: SQLite may not handle high traffic volumes
2. **Offline Mode**: Asset proxy requires internet for self-healing
3. **Real-time Features**: Polling-based updates rather than WebSockets
4. **Multi-tenancy**: Single-tenant architecture
5. **Internationalization**: Primarily Portuguese/Brazilian focused

## Future Enhancements

1. **Database Migration**: PostgreSQL for production scalability
2. **Real-time Updates**: WebSocket implementation for live dashboards
3. **Micro-services**: Containerization with Docker/Kubernetes
4. **CI/CD Pipeline**: Automated testing and deployment
5. **Advanced Analytics**: Machine learning for fraud detection
6. **Multi-language Support**: Internationalization framework
7. **Performance Optimization**: CDN integration and caching strategies