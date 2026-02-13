import simpleGit, { SimpleGit } from "simple-git";
import { GitFile, GitCommit } from "../types";

export class GitService {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  async isGitRepository(): Promise<boolean> {
    try {
      return await this.git.checkIsRepo();
    } catch {
      return false;
    }
  }

  async getStagedFiles(): Promise<GitFile[]> {
    try {
      const status = await this.git.status();
      const stagedFiles: GitFile[] = [];

      // Add staged files
      status.staged.forEach((file) => {
        stagedFiles.push({
          path: file,
          status: "staged",
          isStaged: true,
        });
      });

      return stagedFiles;
    } catch (error) {
      throw new Error(`Failed to get staged files: ${error}`, { cause: error });
    }
  }

  async getRecentCommits(limit: number = 50): Promise<GitCommit[]> {
    try {
      const log = await this.git.log({ maxCount: limit });

      return log.all.map((commit) => ({
        hash: commit.hash,
        message: commit.message,
        author: commit.author_name,
        date: commit.date,
      }));
    } catch {
      // Silently handle git history errors - don't show them to user
      // This is common in new repositories with no commits
      return [];
    }
  }

  async commit(message: string): Promise<void> {
    try {
      await this.git.commit(message);
    } catch (error) {
      throw new Error(`Failed to commit: ${error}`, { cause: error });
    }
  }

  async getDiff(): Promise<string> {
    try {
      const diff = await this.git.diff(["--cached"]);
      return diff;
    } catch {
      // Silently fail - don't interfere with TUI
      return "";
    }
  }

  async getDiffStats(): Promise<{
    added: number;
    deleted: number;
    modified: number;
    renamed: number;
    files: string[];
  }> {
    try {
      const status = await this.git.status();
      const diffStats = await this.git.diffSummary(["--cached"]);

      return {
        added: diffStats.insertions,
        deleted: diffStats.deletions,
        modified: status.modified.length,
        renamed: status.renamed.length,
        files: status.staged,
      };
    } catch {
      // Silently fail - don't interfere with TUI
      return { added: 0, deleted: 0, modified: 0, renamed: 0, files: [] };
    }
  }

  async hasStagedChanges(): Promise<boolean> {
    try {
      const status = await this.git.status();
      return status.staged.length > 0;
    } catch {
      return false;
    }
  }

  async stageAll(): Promise<void> {
    try {
      await this.git.add(".");
    } catch {
      throw new Error(`Failed to stage all files`);
    }
  }

  async hasUnstagedChanges(): Promise<boolean> {
    try {
      const status = await this.git.status();
      return (
        status.not_added.length > 0 ||
        status.modified.length > 0 ||
        status.created.length > 0 ||
        status.deleted.length > 0
      );
    } catch {
      return false;
    }
  }

  async push(): Promise<string> {
    await this.git.push();
    return "Push successful";
  }
}
