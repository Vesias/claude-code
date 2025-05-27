import express from 'express';
import { Octokit } from '@octokit/rest';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'mcp-github' });
});

// List repositories
app.post('/api/repos/list', async (req, res) => {
  try {
    const { username, org, type = 'owner', sort = 'updated' } = req.body;
    
    const response = org 
      ? await octokit.repos.listForOrg({ org, type, sort })
      : await octokit.repos.listForAuthenticatedUser({ type, sort });
    
    res.json({
      success: true,
      data: response.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        private: repo.private,
        url: repo.html_url,
        defaultBranch: repo.default_branch,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
      })),
    });
  } catch (error: any) {
    logger.error('Error listing repositories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create repository
app.post('/api/repos/create', async (req, res) => {
  try {
    const { name, description, private: isPrivate = false, autoInit = true } = req.body;
    
    const response = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      private: isPrivate,
      auto_init: autoInit,
    });
    
    res.json({
      success: true,
      data: {
        id: response.data.id,
        name: response.data.name,
        fullName: response.data.full_name,
        url: response.data.html_url,
        cloneUrl: response.data.clone_url,
      },
    });
  } catch (error: any) {
    logger.error('Error creating repository:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get file content
app.post('/api/files/get', async (req, res) => {
  try {
    const { owner, repo, path, ref } = req.body;
    
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });
    
    if (!Array.isArray(response.data) && response.data.type === 'file') {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      res.json({
        success: true,
        data: {
          name: response.data.name,
          path: response.data.path,
          content,
          sha: response.data.sha,
          size: response.data.size,
        },
      });
    } else {
      res.status(400).json({ success: false, error: 'Path is not a file' });
    }
  } catch (error: any) {
    logger.error('Error getting file content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create or update file
app.post('/api/files/update', async (req, res) => {
  try {
    const { owner, repo, path, content, message, branch, sha } = req.body;
    
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
      sha, // Required for updates
    });
    
    res.json({
      success: true,
      data: {
        commit: response.data.commit.sha,
        content: {
          name: response.data.content?.name,
          path: response.data.content?.path,
          sha: response.data.content?.sha,
        },
      },
    });
  } catch (error: any) {
    logger.error('Error updating file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create issue
app.post('/api/issues/create', async (req, res) => {
  try {
    const { owner, repo, title, body, assignees, labels } = req.body;
    
    const response = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      assignees,
      labels,
    });
    
    res.json({
      success: true,
      data: {
        number: response.data.number,
        title: response.data.title,
        state: response.data.state,
        url: response.data.html_url,
        createdAt: response.data.created_at,
      },
    });
  } catch (error: any) {
    logger.error('Error creating issue:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create pull request
app.post('/api/pulls/create', async (req, res) => {
  try {
    const { owner, repo, title, body, head, base, draft = false } = req.body;
    
    const response = await octokit.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base,
      draft,
    });
    
    res.json({
      success: true,
      data: {
        number: response.data.number,
        title: response.data.title,
        state: response.data.state,
        url: response.data.html_url,
        mergeable: response.data.mergeable,
        createdAt: response.data.created_at,
      },
    });
  } catch (error: any) {
    logger.error('Error creating pull request:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  logger.info(`MCP GitHub service running on port ${PORT}`);
});