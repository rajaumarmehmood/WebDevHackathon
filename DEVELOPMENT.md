# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:
```env
JWT_SECRET=your-super-secret-key-change-in-production
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Running the App

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

## Code Organization

### Adding a New Page

1. Create a new folder in `src/app/`
2. Add a `page.tsx` file
3. Implement the page component
4. Add route protection if needed

Example:
```tsx
// src/app/new-page/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

### Adding a New Component

1. Create file in `src/components/`
2. Use TypeScript for props
3. Export as default or named export

Example:
```tsx
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
    </div>
  );
}
```

### Adding a New API Route

1. Create folder structure in `src/app/api/`
2. Add `route.ts` file
3. Export HTTP method handlers

Example:
```tsx
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

## Styling Guidelines

### Using Tailwind CSS

```tsx
// Basic styling
<div className="p-4 bg-white dark:bg-black rounded-lg">
  <h1 className="text-2xl font-bold text-black dark:text-white">
    Title
  </h1>
</div>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>

// Hover and focus states
<button className="px-4 py-2 bg-black hover:bg-neutral-800 focus:ring-2 focus:ring-black">
  Click me
</button>
```

### Dark Mode Support

Always include dark mode variants:
```tsx
<div className="bg-white dark:bg-black text-black dark:text-white">
  Content
</div>
```

### Custom Animations

Use GSAP for complex animations:
```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedComponent() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-in', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref}>
      <div className="fade-in">Item 1</div>
      <div className="fade-in">Item 2</div>
    </div>
  );
}
```

## State Management

### Using Auth Context

```tsx
import { useAuth } from '@/context/AuthContext';

export default function MyComponent() {
  const { user, isLoading, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login('email@example.com', 'password');
    if (result.success) {
      // Handle success
    } else {
      // Handle error
      console.error(result.error);
    }
  };

  return (
    <div>
      {user ? (
        <p>Welcome, {user.name}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Local State with Hooks

```tsx
import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {data.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

## Working with Constants

Always use constants from `src/lib/constants.ts`:

```tsx
import { APP_CONFIG, ERROR_MESSAGES, UPLOAD_CONFIG } from '@/lib/constants';

// Use app config
console.log(APP_CONFIG.name); // 'CareerAI'

// Use error messages
alert(ERROR_MESSAGES.auth.invalidCredentials);

// Use upload config
if (file.size > UPLOAD_CONFIG.maxFileSize) {
  alert('File too large');
}
```

## Using Helper Functions

Import from `src/lib/helpers.ts`:

```tsx
import { 
  validateResumeFile, 
  formatFileSize, 
  getMatchScoreInfo,
  formatRelativeTime 
} from '@/lib/helpers';

// Validate file
const validation = validateResumeFile(file);
if (!validation.valid) {
  alert(validation.error);
}

// Format file size
const size = formatFileSize(file.size); // "2.5 MB"

// Get match score info
const { color, label } = getMatchScoreInfo(85); // { color: 'blue', label: 'Good Match' }

// Format date
const timeAgo = formatRelativeTime(new Date('2024-01-01')); // "2 days ago"
```

## API Integration (Future)

### Calling External APIs

```tsx
async function fetchJobs() {
  try {
    const response = await fetch('/api/jobs/discover', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skills: ['React', 'TypeScript'],
        experience: 3,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return null;
  }
}
```

### Error Handling

```tsx
import { ERROR_MESSAGES } from '@/lib/constants';

async function handleAction() {
  try {
    const result = await someAsyncOperation();
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { 
      success: false, 
      error: ERROR_MESSAGES.network.generic 
    };
  }
}
```

## TypeScript Best Practices

### Define Interfaces

```tsx
interface User {
  id: string;
  email: string;
  name: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  match: number;
  salary: string;
  tags: string[];
}

interface InterviewPrep {
  company: string;
  role: string;
  technologies: string[];
  questions: Question[];
}
```

### Use Type Guards

```tsx
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string';
}

if (isUser(data)) {
  // TypeScript knows data is User
  console.log(data.email);
}
```

### Generic Functions

```tsx
function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}
```

## Testing (Future Implementation)

### Unit Tests

```tsx
// __tests__/helpers.test.ts
import { validateResumeFile, formatFileSize } from '@/lib/helpers';

describe('validateResumeFile', () => {
  it('should accept valid PDF files', () => {
    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    const result = validateResumeFile(file);
    expect(result.valid).toBe(true);
  });

  it('should reject non-PDF files', () => {
    const file = new File(['content'], 'resume.doc', { type: 'application/msword' });
    const result = validateResumeFile(file);
    expect(result.valid).toBe(false);
  });
});
```

### Component Tests

```tsx
// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Debugging

### Console Logging

```tsx
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### React DevTools

1. Install React DevTools browser extension
2. Inspect component tree
3. View props and state
4. Profile performance

### Network Debugging

1. Open browser DevTools (F12)
2. Go to Network tab
3. Monitor API calls
4. Check request/response data

## Performance Optimization

### Code Splitting

```tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

### Memoization

```tsx
import { useMemo, useCallback } from 'react';

export default function MyComponent({ data }) {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);

  // Memoize callbacks
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <div onClick={handleClick}>{processedData}</div>;
}
```

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // For above-the-fold images
/>
```

## Common Issues and Solutions

### Issue: "Module not found"
**Solution**: Check import paths, ensure file exists, restart dev server

### Issue: "Hydration mismatch"
**Solution**: Ensure server and client render the same content, avoid using browser-only APIs during SSR

### Issue: "Cannot read property of undefined"
**Solution**: Add optional chaining (`?.`) or null checks

### Issue: Dark mode not working
**Solution**: Ensure you're using `dark:` prefix in Tailwind classes

### Issue: Animations not playing
**Solution**: Check GSAP context cleanup, ensure refs are properly set

## Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/what-changed` - Code refactoring
- `docs/what-documented` - Documentation updates

### Commit Messages
```
feat: Add resume upload functionality
fix: Resolve authentication redirect issue
refactor: Simplify job matching algorithm
docs: Update README with setup instructions
style: Format code with Prettier
```

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create PR with description
5. Request review
6. Address feedback
7. Merge when approved

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [GSAP](https://greensock.com/docs)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [React Community](https://react.dev/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

## Getting Help

1. Check documentation
2. Search existing issues
3. Ask in community forums
4. Create detailed issue report
5. Provide reproduction steps

## Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit pull request

---

Happy coding! 🚀
