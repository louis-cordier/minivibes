## Prompting Guidelines

### For Initial Specification

**Example Prompt**:
```
I'm building [PROJECT NAME]. The goal is to [OBJECTIVE].

Reference project: [LINK if applicable]

Key features:
- [Feature 1]
- [Feature 2]
- [Feature 3]

Technology constraints:
- Must use [TECH]
- Should run in [ENVIRONMENT]

Please write a comprehensive specification including:
1. Functional breakdown (components/services)
2. Technical stack with versions
3. Complete file structure
4. Development strategy (order of implementation)
5. Fidelity rules (what success looks like)
6. Resource plan for the day

Format as markdown for easy reference throughout development.
```

### For Feature Implementation

**Good Prompt**:
```
Looking at the specification section "3.2 Authentication":

Implement the login form component that:
- Takes email and password inputs
- Validates before submission
- Shows loading state during auth
- Displays error messages on failure
- Redirects to dashboard on success

Use React hooks. Store auth token in localStorage.
File: src/components/LoginForm.js

Previous similar component: [point to example if exists]
```

**Bad Prompt** (too vague):
```
Can you make the login page work?
```

### For Debugging/Problem Solving (Use premium here)

**Good Prompt**:
```
The physics collision detection is incorrect. 

Expected behavior: Ball should bounce off track walls at 45° angle.
Actual behavior: Ball passes through walls or bounces unpredictably.

Current implementation: src/engine/physics.js lines 34-67

Can you:
1. Identify the bug
2. Explain the fix
3. Provide corrected code

Reference: [Link to Three.js physics guide if applicable]
```