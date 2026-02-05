export interface Question {
  id: string;
  text: string;
  options: string[];
  skill: string; // Maps to category skill
}

export const questionsByCategory: Record<string, Question[]> = {
  technical: [
    {
      id: "tech-1",
      text: "How would you approach debugging a production issue that only occurs intermittently?",
      options: [
        "Add extensive logging and monitor in production",
        "Reproduce the issue in a local environment first",
        "Check recent code changes and rollback if needed",
        "Ask team members if they've seen similar issues"
      ],
      skill: "Problem Solving"
    },
    {
      id: "tech-2",
      text: "When designing a distributed system, what's your primary concern?",
      options: [
        "Data consistency and reliability",
        "Performance and scalability",
        "Cost optimization",
        "Ease of development"
      ],
      skill: "System Design"
    },
    {
      id: "tech-3",
      text: "How do you ensure code quality in a large codebase?",
      options: [
        "Code reviews, automated testing, and linting",
        "Pair programming only",
        "Extensive documentation",
        "Regular refactoring sessions"
      ],
      skill: "Programming"
    },
    {
      id: "tech-4",
      text: "What's your approach to choosing between microservices and monolith?",
      options: [
        "Start with monolith, extract services when needed",
        "Always use microservices for scalability",
        "Use monolith for small teams, microservices for large",
        "Choose based on team expertise"
      ],
      skill: "Architecture"
    },
    {
      id: "tech-5",
      text: "How do you handle a situation where requirements change mid-sprint?",
      options: [
        "Assess impact, communicate with stakeholders, adjust plan",
        "Stick to original plan and defer changes",
        "Immediately pivot to new requirements",
        "Document change and handle in next sprint"
      ],
      skill: "Problem Solving"
    },
    {
      id: "tech-6",
      text: "What's most important when designing an API?",
      options: [
        "Consistency, versioning, and clear documentation",
        "Performance above all else",
        "Following REST conventions strictly",
        "Making it easy to use"
      ],
      skill: "Architecture"
    },
    {
      id: "tech-7",
      text: "How do you approach learning a new programming language?",
      options: [
        "Build a small project while reading documentation",
        "Read books and tutorials first",
        "Take an online course",
        "Jump into an existing project"
      ],
      skill: "Programming"
    },
    {
      id: "tech-8",
      text: "What's your strategy for database optimization?",
      options: [
        "Profile queries, add indexes, optimize slow queries",
        "Upgrade hardware first",
        "Normalize database schema",
        "Use caching extensively"
      ],
      skill: "System Design"
    }
  ],
  soft: [
    {
      id: "soft-1",
      text: "How do you handle a disagreement with a team member?",
      options: [
        "Have a private conversation to understand their perspective",
        "Escalate to manager immediately",
        "Avoid conflict and find a compromise",
        "Present your case in a team meeting"
      ],
      skill: "Communication"
    },
    {
      id: "soft-2",
      text: "What's your approach to working in a team?",
      options: [
        "Collaborate closely, share knowledge, support others",
        "Work independently and sync periodically",
        "Lead the team and delegate tasks",
        "Focus on my own tasks and deliver on time"
      ],
      skill: "Teamwork"
    },
    {
      id: "soft-3",
      text: "How do you adapt when project priorities suddenly change?",
      options: [
        "Quickly reassess and reprioritize my work",
        "Feel stressed but try to adapt",
        "Request clarification on new priorities",
        "Continue with original plan until told otherwise"
      ],
      skill: "Adaptability"
    },
    {
      id: "soft-4",
      text: "How do you approach solving a problem you've never encountered?",
      options: [
        "Research, experiment, and seek advice from experts",
        "Try different solutions until something works",
        "Ask for help immediately",
        "Break it down into smaller problems"
      ],
      skill: "Creativity"
    },
    {
      id: "soft-5",
      text: "How do you communicate complex technical concepts to non-technical stakeholders?",
      options: [
        "Use analogies and simple language, focus on business impact",
        "Provide detailed technical explanations",
        "Create visual diagrams and presentations",
        "Delegate to someone better at communication"
      ],
      skill: "Communication"
    },
    {
      id: "soft-6",
      text: "What's most important in team collaboration?",
      options: [
        "Clear communication and mutual respect",
        "Defined roles and responsibilities",
        "Regular meetings and updates",
        "Shared goals and vision"
      ],
      skill: "Teamwork"
    },
    {
      id: "soft-7",
      text: "How do you handle feedback on your work?",
      options: [
        "Listen actively, ask clarifying questions, implement improvements",
        "Defend my approach and explain reasoning",
        "Accept all feedback without question",
        "Consider feedback but trust my judgment"
      ],
      skill: "Adaptability"
    },
    {
      id: "soft-8",
      text: "How do you generate new ideas for solving problems?",
      options: [
        "Brainstorm with team, research best practices, think creatively",
        "Look at how others solved similar problems",
        "Think outside the box independently",
        "Use structured problem-solving frameworks"
      ],
      skill: "Creativity"
    }
  ],
  leadership: [
    {
      id: "lead-1",
      text: "How do you communicate your vision to your team?",
      options: [
        "Share the 'why' behind goals, connect to bigger picture",
        "Provide clear instructions and expectations",
        "Lead by example and demonstrate values",
        "Have one-on-ones to understand individual motivations"
      ],
      skill: "Vision"
    },
    {
      id: "lead-2",
      text: "How do you make important decisions under uncertainty?",
      options: [
        "Gather data, consult team, make informed decision",
        "Trust my intuition and experience",
        "Delegate decision to subject matter experts",
        "Wait for more information before deciding"
      ],
      skill: "Decision Making"
    },
    {
      id: "lead-3",
      text: "How do you influence others without authority?",
      options: [
        "Build relationships, demonstrate expertise, find common ground",
        "Present compelling data and logical arguments",
        "Lead by example and show results",
        "Collaborate and build consensus"
      ],
      skill: "Influence"
    },
    {
      id: "lead-4",
      text: "How do you develop your team members?",
      options: [
        "Identify strengths, provide opportunities, give constructive feedback",
        "Assign challenging projects",
        "Provide training and resources",
        "Mentor one-on-one regularly"
      ],
      skill: "Development"
    },
    {
      id: "lead-5",
      text: "What's your approach to setting team goals?",
      options: [
        "Involve team in goal-setting, ensure alignment with vision",
        "Set clear, measurable, achievable goals",
        "Set ambitious stretch goals",
        "Let team define their own goals"
      ],
      skill: "Vision"
    },
    {
      id: "lead-6",
      text: "How do you handle a team member not meeting expectations?",
      options: [
        "Have honest conversation, understand root cause, create improvement plan",
        "Provide clear feedback and set deadlines",
        "Reassign to tasks better suited to their skills",
        "Escalate to HR or manager"
      ],
      skill: "Decision Making"
    },
    {
      id: "lead-7",
      text: "How do you build trust with your team?",
      options: [
        "Be transparent, keep commitments, show vulnerability",
        "Demonstrate competence and reliability",
        "Protect team from external pressures",
        "Give credit and recognition"
      ],
      skill: "Influence"
    },
    {
      id: "lead-8",
      text: "What's your approach to delegation?",
      options: [
        "Match tasks to skills, provide context and support, trust but verify",
        "Delegate completely and let them figure it out",
        "Provide detailed instructions and check frequently",
        "Only delegate tasks I'm confident they can handle"
      ],
      skill: "Development"
    }
  ],
  analytical: [
    {
      id: "anal-1",
      text: "How do you approach analyzing a large dataset?",
      options: [
        "Start with exploratory analysis, identify patterns, form hypotheses",
        "Use statistical methods and tools",
        "Visualize data first to understand structure",
        "Clean data thoroughly before analysis"
      ],
      skill: "Data Analysis"
    },
    {
      id: "anal-2",
      text: "How do you evaluate the validity of information?",
      options: [
        "Check sources, verify facts, consider bias and context",
        "Cross-reference with multiple sources",
        "Apply critical thinking frameworks",
        "Trust expert opinions and established sources"
      ],
      skill: "Critical Thinking"
    },
    {
      id: "anal-3",
      text: "How do you conduct research on an unfamiliar topic?",
      options: [
        "Start broad, narrow focus, verify sources, synthesize findings",
        "Read academic papers and research",
        "Consult experts and practitioners",
        "Use multiple search strategies and databases"
      ],
      skill: "Research"
    },
    {
      id: "anal-4",
      text: "How do you identify patterns in complex information?",
      options: [
        "Look for similarities, differences, and relationships systematically",
        "Use visualization and pattern recognition tools",
        "Break down into smaller components",
        "Apply domain knowledge and experience"
      ],
      skill: "Pattern Recognition"
    },
    {
      id: "anal-5",
      text: "How do you handle conflicting data in your analysis?",
      options: [
        "Investigate discrepancies, check data quality, reconcile differences",
        "Use statistical methods to resolve conflicts",
        "Choose the most reliable data source",
        "Present both sides and explain uncertainty"
      ],
      skill: "Data Analysis"
    },
    {
      id: "anal-6",
      text: "How do you challenge assumptions in your thinking?",
      options: [
        "Ask 'why' repeatedly, seek alternative perspectives, test assumptions",
        "Use structured thinking frameworks",
        "Consult with diverse team members",
        "Question everything systematically"
      ],
      skill: "Critical Thinking"
    },
    {
      id: "anal-7",
      text: "How do you ensure your research is comprehensive?",
      options: [
        "Use multiple sources, check citations, verify completeness",
        "Follow systematic research methodology",
        "Consult with subject matter experts",
        "Review existing literature thoroughly"
      ],
      skill: "Research"
    },
    {
      id: "anal-8",
      text: "How do you recognize patterns that others might miss?",
      options: [
        "Look at data from multiple angles, use different analytical approaches",
        "Apply domain expertise and intuition",
        "Use advanced analytical tools and techniques",
        "Collaborate with others to see different perspectives"
      ],
      skill: "Pattern Recognition"
    }
  ]
};
