// Interview Experience Service
// Handles all API calls for the Interview Experience feature
import apiClient from './apiClient';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://switchboardpro.in/api/v1';

// Demo data for UI testing
const DEMO_INTERVIEWS = [
  {
    id: '1',
    title: 'Software Engineer Intern',
    company: 'Google',
    location: 'Mountain View, CA',
    interviewType: 'Virtual',
    difficulty: 'Medium',
    userName: 'Sarah Chen',
    userAvatar: null,
    summary: 'Great experience with algorithmic problems and system design discussions. The interviewers were very friendly and provided helpful feedback.',
    content: `## Interview Process

The interview process at Google was well-structured and consisted of multiple rounds:

### Round 1: Technical Phone Screen (45 mins)
- Basic data structures and algorithms
- One coding problem involving arrays and hashmaps
- Discussion about time and space complexity

### Round 2: Virtual Onsite (3 hours)
- **Coding Round 1**: Dynamic programming problem
- **Coding Round 2**: Tree traversal and graph algorithms  
- **System Design**: Design a simple URL shortener
- **Behavioral Round**: Questions about teamwork and problem-solving

## Technical Questions
1. **Implement a LRU Cache** - Had to implement using HashMap and Doubly Linked List
2. **Binary Tree Level Order Traversal** - Used BFS approach
3. **Design URL Shortener** - Discussed encoding, database design, and scalability

## Tips
- Practice coding on a whiteboard or shared screen
- Think out loud during problem solving
- Ask clarifying questions
- Discuss trade-offs in system design

Overall, it was a positive experience and I learned a lot from the process!`,
    tags: ['Algorithms', 'System Design', 'Virtual Interview'],
    upvotes: 24,
    comments: 8,
    readTime: 5,
    createdAt: '2024-10-15',
    updatedAt: '2024-11-10',
    imageName: null
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    interviewType: 'Onsite',
    difficulty: 'Hard',
    userName: 'Alex Kumar',
    userAvatar: null,
    summary: 'Challenging interview focusing on React internals, performance optimization, and complex UI problems. Great learning experience.',
    content: `## Meta Frontend Interview Experience

### Interview Structure
The interview process was intense but fair, spanning a full day at their Menlo Park campus.

### Round 1: JavaScript Fundamentals (45 mins)
- Closures and scope
- Async/await vs Promises
- Event loop and callstack
- Prototypal inheritance

### Round 2: React Deep Dive (60 mins)
- Implement a custom hook for data fetching
- React reconciliation process
- Performance optimization techniques
- Context API vs Redux

### Round 3: System Design (45 mins)
- Design Facebook's news feed frontend
- Discussed virtual scrolling
- State management at scale
- Caching strategies

### Round 4: Coding Challenge (60 mins)
Built a mini Instagram-like component with:
- Image upload and preview
- Like/unlike functionality
- Comments system
- Real-time updates simulation

## Key Takeaways
- Know React internals deeply
- Practice building complex UIs from scratch
- Understand browser performance optimization
- Be ready to discuss trade-offs

The team was incredibly smart and the questions were thoughtful. Even though it was challenging, I felt respected throughout the process.`,
    tags: ['React', 'JavaScript', 'Frontend', 'System Design'],
    upvotes: 31,
    comments: 12,
    readTime: 7,
    createdAt: '2024-09-22',
    updatedAt: '2024-11-08',
    imageName: null
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    interviewType: 'Hybrid',
    difficulty: 'Medium',
    userName: 'Maya Patel',
    userAvatar: null,
    summary: 'Focused on machine learning algorithms, A/B testing, and recommendation systems. Great discussion about real-world applications.',
    content: `## Netflix Data Science Interview

### Background
Applied for a Data Scientist role focusing on recommendation algorithms and personalization.

### Round 1: Technical Phone Screen (45 mins)
- SQL queries on user behavior data
- Basic statistics and probability
- Python pandas operations

### Round 2: Case Study Presentation (60 mins)
- Analyze a sample dataset
- Build a recommendation model
- Present findings and methodology
- Discuss model evaluation metrics

### Round 3: Machine Learning Deep Dive (45 mins)
- Collaborative filtering approaches
- Handling cold start problems
- A/B testing methodology
- Feature engineering for recommendations

### Round 4: Business Case Discussion (45 mins)
- How to measure recommendation quality
- Balancing engagement vs diversity
- Revenue impact of personalization
- Ethical considerations in ML

## Technical Challenges
1. **Recommendation Algorithm**: Implement matrix factorization
2. **A/B Test Analysis**: Analyze experiment results with statistical significance
3. **Data Pipeline**: Design for real-time recommendation updates

## Advice
- Understand both technical and business aspects
- Practice explaining complex ML concepts simply
- Know Netflix's business model and challenges
- Prepare case studies from your experience

The interview felt more like a collaboration than a test. The team was genuinely interested in my thought process and previous work.`,
    tags: ['Machine Learning', 'Python', 'A/B Testing', 'Recommendations'],
    upvotes: 18,
    comments: 6,
    readTime: 6,
    createdAt: '2024-08-30',
    updatedAt: '2024-11-05',
    imageName: null
  },
  {
    id: '4',
    title: 'Backend Engineer',
    company: 'Amazon',
    location: 'Seattle, WA',
    interviewType: 'Onsite',
    difficulty: 'Hard',
    userName: 'David Johnson',
    userAvatar: null,
    summary: 'Leadership principles-focused interview with deep technical discussions on distributed systems and scalability.',
    content: `## Amazon Backend Engineer Interview

### The Amazon Way
The interview process heavily emphasizes Amazon's Leadership Principles alongside technical competency.

### Round 1: Online Assessment
- 2 coding problems on HackerRank
- Focus on algorithms and data structures
- 90 minutes to complete

### Round 2: Technical Phone Screen (45 mins)
- System design: Design a chat application
- Discussed scalability, reliability, and consistency
- Database choices and trade-offs

### Round 3: Onsite (4 hours)

**Technical Round 1**: Data Structures & Algorithms
- Dynamic programming problem
- Graph traversal optimization
- Complexity analysis

**Technical Round 2**: System Design
- Design Amazon's product catalog system
- Microservices architecture
- Database partitioning strategies
- Caching layers

**Leadership Principles Round 1**: Customer Obsession
- Tell me about a time you went above and beyond for a customer
- How do you prioritize competing customer needs?

**Leadership Principles Round 2**: Ownership & Delivery
- Describe a project you owned end-to-end
- How do you handle tight deadlines?

### Bar Raiser Round (45 mins)
- Cross-functional collaboration scenarios
- Long-term thinking and innovation
- Dive deep into technical decisions

## Key Focus Areas
- **Scalability**: Design for millions of users
- **Reliability**: 99.99% uptime requirements  
- **Cost Optimization**: Efficient resource usage
- **Leadership**: Demonstrate ownership mindset

## Leadership Principles to Study
1. Customer Obsession
2. Ownership  
3. Invent and Simplify
4. Dive Deep
5. Have Backbone; Disagree and Commit

The bar is incredibly high, but the growth opportunities are unmatched. Prepare stories that demonstrate leadership principles with concrete technical examples.`,
    tags: ['System Design', 'Leadership Principles', 'Distributed Systems', 'Scalability'],
    upvotes: 42,
    comments: 15,
    readTime: 8,
    createdAt: '2024-11-01',
    updatedAt: '2024-11-12',
    imageName: null
  },
  {
    id: '5',
    title: 'iOS Developer',
    company: 'Apple',
    location: 'Cupertino, CA',
    interviewType: 'Onsite',
    difficulty: 'Medium',
    userName: 'Jennifer Wu',
    userAvatar: null,
    summary: 'Focus on Swift programming, iOS fundamentals, and user experience design. Great discussion about Apple\'s design philosophy.',
    content: `## Apple iOS Developer Interview

### Interview Experience
The interview process was thorough and focused on both technical skills and cultural fit with Apple's values.

### Round 1: Technical Phone Screen (45 mins)
- Swift programming concepts
- iOS app lifecycle
- Memory management (ARC)
- Basic UIKit questions

### Round 2: Onsite Technical Rounds (3 hours)

**Round 1**: Swift & iOS Fundamentals
- Implement a custom view controller
- Delegates vs closures
- Core Data basics
- Auto Layout programmatically

**Round 2**: Algorithm & Problem Solving  
- Implement algorithms using Swift
- String manipulation problems
- Tree and graph traversal
- Optimization challenges

**Round 3**: Design & Architecture
- Discuss MVC vs MVVM patterns
- Dependency injection in iOS
- Protocol-oriented programming
- Testing strategies (Unit tests, UI tests)

### Round 3: Design Discussion (45 mins)
- Critique existing iOS app designs
- Discuss Apple's Human Interface Guidelines
- Accessibility considerations
- User experience principles

### Round 4: Cultural Fit (30 mins)
- Why Apple?
- Passion for technology and design
- Collaboration and teamwork examples
- Innovation mindset

## Technical Deep Dives
1. **Memory Management**: Explain ARC, strong/weak references, retain cycles
2. **Concurrency**: GCD, Operation Queues, async/await
3. **Networking**: URLSession, handling errors, data parsing
4. **UI/UX**: Smooth animations, responsive design, accessibility

## Apple-Specific Focus
- **Design Excellence**: Attention to detail in UI/UX
- **Performance**: Smooth 60fps animations
- **Privacy**: User data protection principles
- **Accessibility**: VoiceOver, Dynamic Type support

## Preparation Tips
- Build polished portfolio apps
- Study Human Interface Guidelines thoroughly
- Practice coding on a whiteboard
- Understand Apple's ecosystem and values

The interview felt like a conversation with fellow developers who are passionate about creating amazing user experiences. The technical bar is high, but the focus on quality and user delight makes it worthwhile.`,
    tags: ['iOS', 'Swift', 'UIKit', 'Design', 'Mobile Development'],
    upvotes: 28,
    comments: 9,
    readTime: 7,
    createdAt: '2024-10-08',
    updatedAt: '2024-11-15',
    imageName: null
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'Microsoft',
    location: 'Redmond, WA',
    interviewType: 'Virtual',
    difficulty: 'Medium',
    userName: 'Carlos Rodriguez',
    userAvatar: null,
    summary: 'Great focus on cloud technologies, CI/CD pipelines, and infrastructure as code. Practical scenario-based questions.',
    content: `## Microsoft DevOps Engineer Interview

### Overview
Applied for a DevOps Engineer position focusing on Azure cloud infrastructure and CI/CD automation.

### Round 1: Technical Assessment
- Azure fundamentals quiz
- Docker containerization scenarios
- Kubernetes basic concepts
- CI/CD pipeline design

### Round 2: Technical Interview (60 mins)

**Infrastructure as Code**:
- Terraform vs ARM templates
- Best practices for state management
- Resource organization strategies

**CI/CD Pipeline Design**:
- Azure DevOps vs GitHub Actions
- Multi-stage deployments
- Testing strategies in pipelines
- Security scanning integration

**Monitoring & Observability**:
- Application Insights setup
- Log aggregation strategies
- Alert management
- Performance monitoring

### Round 3: Scenario-Based Discussion (45 mins)

**Scenario**: Migration from on-premises to Azure
- Assessment of existing infrastructure
- Migration strategy and timeline
- Risk mitigation approaches
- Cost optimization techniques

**Scenario**: Production incident response
- Incident detection and alerting
- Root cause analysis process
- Communication during outages
- Post-incident review procedures

### Round 4: Cultural Fit & Growth Mindset (30 mins)
- Examples of learning from failures
- Collaboration across teams
- Innovation and continuous improvement
- Microsoft's cultural values

## Key Technical Areas
1. **Cloud Platforms**: Deep Azure knowledge, some AWS comparison
2. **Containerization**: Docker, Kubernetes, container security
3. **Infrastructure as Code**: Terraform, ARM templates, best practices
4. **CI/CD**: Azure DevOps, GitHub Actions, deployment strategies
5. **Monitoring**: Application Insights, Azure Monitor, log analytics

## Soft Skills Focus
- **Growth Mindset**: Learning from failures and continuous improvement
- **Collaboration**: Working across diverse teams and cultures
- **Customer Focus**: Understanding internal and external customer needs
- **Innovation**: Finding creative solutions to complex problems

## Preparation Advice
- Hands-on experience with Azure services
- Practice explaining complex technical concepts simply
- Prepare real-world scenarios and solutions
- Understand Microsoft's culture and values

The interview process felt collaborative rather than interrogative. Microsoft values diverse perspectives and genuine curiosity about technology. The team was interested in both technical depth and the ability to work well with others.`,
    tags: ['DevOps', 'Azure', 'CI/CD', 'Infrastructure', 'Kubernetes'],
    upvotes: 22,
    comments: 7,
    readTime: 6,
    createdAt: '2024-09-15',
    updatedAt: '2024-11-18',
    imageName: null
  }
];

// Popular companies for search autocomplete
const POPULAR_COMPANIES = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Tesla', 'Uber', 
  'Airbnb', 'Twitter', 'LinkedIn', 'Spotify', 'Adobe', 'Salesforce', 'Oracle',
  'IBM', 'Intel', 'NVIDIA', 'PayPal', 'Square', 'Stripe', 'Coinbase', 'Robinhood'
];

/**
 * Get all interviews with pagination and sorting
 * @param {Object} params - Query parameters
 * @param {number} params.pageNumber - Page number (0-indexed)
 * @param {number} params.pageSize - Number of items per page
 * @param {string} params.sortBy - Sort field (default: "updatedAt")
 * @param {string} params.sortDir - Sort direction (asc/desc)
 * @returns {Promise<Object>} Paginated interview data
 */
/**
 * Get all interviews with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.pageNumber - Page number (0-indexed)
 * @param {number} params.pageSize - Items per page
 * @param {string} params.sortBy - Field to sort by
 * @param {string} params.sortDir - Sort direction (asc/desc)
 * @returns {Promise<Object>} Paginated interview data
 */
export const getAllInterviews = async (params = {}) => {
  const {
    pageNumber = 0,
    pageSize = 10,
    sortBy = 'createdAt',
    sortDir = 'desc'
  } = params;

  try {
    // apiClient base is /api/v1, so we add /interview/getAll/interviews
    const response = await apiClient.get('/interview/getAll/interviews', {
      params: {
        pageNumber,
        pageSize,
        sortBy,
        sortDir
      }
    });

    return response.data;
  } catch (error) {




    
    // If backend is not available (404, network error, etc.), return demo data

    
    // Return demo data with pagination structure matching API contract
    const sortedData = [...DEMO_INTERVIEWS].sort((a, b) => {
      if (sortBy === 'updatedAt' || sortBy === 'createdAt') {
        const dateA = new Date(a[sortBy]);
        const dateB = new Date(b[sortBy]);
        return sortDir === 'desc' ? dateB - dateA : dateA - dateB;
      }
      return 0;
    });

    const startIndex = pageNumber * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    return {
      content: paginatedData,
      pageNumber,
      pageSize,
      totalElements: DEMO_INTERVIEWS.length,
      totalPages: Math.ceil(DEMO_INTERVIEWS.length / pageSize),
      lastPage: pageNumber >= Math.ceil(DEMO_INTERVIEWS.length / pageSize) - 1
    };
  }
};

/**
 * Get interview by ID
 * @param {string} id - Interview UUID
 * @returns {Promise<Object>} Interview data
 */
export const getInterviewById = async (id) => {
  try {
    const response = await apiClient.get(`/interview/get/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Interview not found');
    }

    throw error;
  }
};

/**
 * Search interviews by email
 * @param {string} email - User email
 * @returns {Promise<Array>} Array of interviews
 */
export const searchInterviewsByEmail = async (email) => {
  try {
    const response = await apiClient.get('/interview/search/email', {
      params: { email }
    });
    return response.data;
  } catch (error) {

    throw error;
  }
};

/**
 * Get current user's interviews
 * @returns {Promise<Array>} Array of interviews
 */
export const getMyInterviews = async () => {
  try {
    const response = await apiClient.get('/interview/search');
    return response.data;
  } catch (error) {

    throw error;
  }
};

/**
 * Search interviews by company
 * @param {string} companyName - Company name
 * @returns {Promise<Array>} Array of interviews
 */
export const searchInterviewsByCompany = async (companyName) => {
  try {
    const response = await apiClient.get('/interview/search/company', {
      params: { company: companyName }
    });
    return response.data;
  } catch (error) {

    throw error;
  }
};

/**
 * Create new interview experience
 * @param {Object} interviewData - Interview request data
 * @returns {Promise<Object>} Created interview data
 */
export const createInterview = async (interviewData) => {
  try {
    const requestBody = {
      title: interviewData.title,
      content: interviewData.content,
      companyName: interviewData.companyName,
      role: interviewData.role,
      interviewType: interviewData.interviewType,
      experienceLevel: interviewData.experienceLevel,
      outcome: interviewData.outcome,
      numberOfRounds: interviewData.numberOfRounds || null
    };


    const response = await apiClient.post('/interview/', requestBody);
    return response.data;
  } catch (error) {



    throw error;
  }
};

/**
 * Update interview experience
 * @param {string} id - Interview ID
 * @param {Object} interviewData - Updated interview data
 * @returns {Promise<Object>} Updated interview data
 */
export const updateInterview = async (id, interviewData) => {
  try {
    const requestBody = {
      title: interviewData.title,
      content: interviewData.content,
      companyName: interviewData.companyName,
      role: interviewData.role,
      interviewType: interviewData.interviewType,
      experienceLevel: interviewData.experienceLevel,
      outcome: interviewData.outcome,
      numberOfRounds: interviewData.numberOfRounds || null
    };

    const response = await apiClient.put(`/interview/update/${id}`, requestBody);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Interview not found');
    }

    throw error;
  }
};

/**
 * Delete interview experience
 * @param {string} id - Interview ID
 * @returns {Promise<string>} Success message
 */
export const deleteInterview = async (id) => {
  try {
    const response = await apiClient.delete(`/interview/delete/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Interview not found');
    }

    throw error;
  }
};

/**
 * Utility function to format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Utility function to calculate read time
 * @param {string} content - Interview content
 * @returns {string} Estimated read time
 */
export const calculateReadTime = (content) => {
  if (!content) return '1 min read';
  
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(words / wordsPerMinute);
  
  return `${readTime} min read`;
};

/**
 * Utility function to truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get company list for autocomplete (mock data - replace with API call if available)
 * @returns {Array<string>} List of popular company names
 */
export const getPopularCompanies = () => {
  return POPULAR_COMPANIES.sort();
};