import { streamText } from 'ai';
import { google, GEMINI_MODEL, systemPrompts } from '../gemini';

export interface TaskManagerInput {
  action: 'organize' | 'prioritize' | 'breakdown' | 'schedule' | 'analyze' | 'delegate';
  tasks?: string[];
  project?: string;
  deadline?: string;
  resources?: string[];
  constraints?: string;
  teamSize?: number;
  currentProgress?: string;
}

export async function manageTasks(input: TaskManagerInput) {
  const actionPrompts = {
    organize: 'Organize these tasks into logical categories and sequences',
    prioritize: 'Prioritize these tasks based on impact and urgency',
    breakdown: 'Break down these tasks into detailed subtasks',
    schedule: 'Create a realistic schedule for these tasks',
    analyze: 'Analyze task dependencies and potential bottlenecks',
    delegate: 'Suggest optimal task delegation based on team resources',
  };

  const prompt = `
Action Required: ${actionPrompts[input.action]}
${input.project ? `Project: ${input.project}` : ''}
${input.deadline ? `Deadline: ${input.deadline}` : ''}
${input.teamSize ? `Team Size: ${input.teamSize} people` : ''}
${input.constraints ? `Constraints: ${input.constraints}` : ''}
${input.currentProgress ? `Current Progress: ${input.currentProgress}` : ''}

${input.tasks?.length ? `Tasks:\n${input.tasks.map((task, i) => `${i + 1}. ${task}`).join('\n')}` : ''}
${input.resources?.length ? `Available Resources:\n${input.resources.join(', ')}` : ''}

Provide:
${input.action === 'organize' ? `
1. Task categories with clear groupings
2. Recommended execution order
3. Dependencies between task groups
4. Parallel execution opportunities` : ''}
${input.action === 'prioritize' ? `
1. Priority matrix (High/Low Impact vs Urgent/Not Urgent)
2. Recommended focus order with justification
3. Quick wins to build momentum
4. Critical path items` : ''}
${input.action === 'breakdown' ? `
1. Detailed subtasks for each main task
2. Time estimates for each subtask
3. Required skills/resources per subtask
4. Definition of done for each` : ''}
${input.action === 'schedule' ? `
1. Gantt chart representation (text-based)
2. Milestone markers
3. Buffer time recommendations
4. Daily/weekly task distribution` : ''}
${input.action === 'analyze' ? `
1. Dependency graph
2. Potential bottlenecks and risks
3. Critical path analysis
4. Optimization opportunities` : ''}
${input.action === 'delegate' ? `
1. Task-to-person assignments with rationale
2. Skill matching analysis
3. Workload balance assessment
4. Collaboration points` : ''}

Additional insights:
- Risk factors and mitigation strategies
- Success metrics for tracking
- Communication plan if applicable
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.taskManager,
    prompt,
    temperature: 0.5,
    maxTokens: 2500,
  });

  return result;
}

// Generate project plan from high-level description
export async function generateProjectPlan(
  projectDescription: string,
  duration: string,
  teamSize: number
) {
  const prompt = `
Project Description: ${projectDescription}
Duration: ${duration}
Team Size: ${teamSize}

Create a comprehensive project plan including:
1. Project phases with clear objectives
2. Task breakdown structure (WBS)
3. Resource allocation plan
4. Risk assessment and mitigation
5. Communication and reporting structure
6. Key milestones and deliverables
7. Success criteria and KPIs

Format as a structured project plan ready for implementation.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.taskManager,
    prompt,
    temperature: 0.6,
    maxTokens: 3000,
  });

  return result;
}

// Daily/Weekly planning assistant
export async function generateDailyPlan(
  goals: string[],
  availableHours: number,
  energyPattern?: 'morning' | 'afternoon' | 'evening' | 'mixed'
) {
  const prompt = `
Today's Goals:
${goals.map((goal, i) => `${i + 1}. ${goal}`).join('\n')}

Available Hours: ${availableHours}
Energy Pattern: ${energyPattern || 'mixed'} (when you're most productive)

Create an optimized daily schedule that:
1. Allocates time blocks for each goal
2. Includes breaks and buffer time
3. Matches tasks to energy levels
4. Suggests focus techniques (Pomodoro, time boxing, etc.)
5. Includes a "Plan B" for disruptions

Format as an hourly schedule with clear action items.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.taskManager,
    prompt,
    temperature: 0.4,
    maxTokens: 1500,
  });

  return result;
}

// Sprint planning for agile teams
export async function planSprint(
  backlogItems: string[],
  sprintDuration: string,
  teamVelocity?: number,
  previousSprintIssues?: string
) {
  const prompt = `
Sprint Duration: ${sprintDuration}
${teamVelocity ? `Team Velocity: ${teamVelocity} story points` : ''}
${previousSprintIssues ? `Previous Sprint Issues: ${previousSprintIssues}` : ''}

Backlog Items:
${backlogItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Create a sprint plan that includes:
1. Story point estimation for each item
2. Sprint goal recommendation
3. Task distribution across sprint days
4. Risk identification and mitigation
5. Definition of done for the sprint
6. Daily standup focus areas
7. Sprint review preparation checklist

Ensure realistic planning based on team capacity and past performance.
`;

  const result = await streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompts.taskManager,
    prompt,
    temperature: 0.5,
    maxTokens: 2000,
  });

  return result;
}