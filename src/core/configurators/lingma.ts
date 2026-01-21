import path from 'path';
import { ToolConfigurator } from './base.js';
import { FileSystemUtils } from '../../utils/file-system.js';
import { TemplateManager } from '../templates/index.js';
import { OPENSPEC_MARKERS } from '../config.js';

/**
 * Lingma IDE AI Tool Configurator
 * 
 * Configures OpenSpec integration for Lingma IDE AI coding assistant.
 * Creates and manages .lingma/rules/openspec-rules.md configuration file with OpenSpec instructions.
 * 
 * @implements {ToolConfigurator}
 */
export class LingmaConfigurator implements ToolConfigurator {
  /** Display name for the Lingma tool */
  name = 'Lingma';

  /** Configuration file name in .lingma/rules directory */
  configFileName = '.lingma/rules/openspec-rules.md';

  /** Indicates tool is available for configuration */
  isAvailable = true;

  /**
   * Configure Lingma integration for a project
   * 
   * Creates or updates .lingma/rules/openspec-rules.md file with OpenSpec instructions.
   * Includes trigger configuration for automatic application.
   * Uses agent-standard template for instruction content.
   * Wrapped with OpenSpec markers for future updates.
   * 
   * @param {string} projectPath - Absolute path to project root directory
   * @param {string} openspecDir - Path to openspec directory (unused but required by interface)
   * @returns {Promise<void>} Resolves when configuration is complete
   */
  async configure(projectPath: string, openspecDir: string): Promise<void> {
    const filePath = path.join(projectPath, this.configFileName);
    const content = TemplateManager.getAgentsStandardTemplate();
    const frontmatter = `---\ntrigger: always_on\nalwaysApply: true\n---`;
    if (await FileSystemUtils.fileExists(filePath)) {
      // Update existing file: only update content between markers
      await FileSystemUtils.updateFileWithMarkers(
        filePath,
        content,
        OPENSPEC_MARKERS.start,
        OPENSPEC_MARKERS.end
      );
    } else {
      // Create new file: frontmatter + markers + content
      const fullContent = `${frontmatter}\n${OPENSPEC_MARKERS.start}\n${content}\n${OPENSPEC_MARKERS.end}\n`;
      await FileSystemUtils.writeFile(filePath, fullContent);
    }
  }
}