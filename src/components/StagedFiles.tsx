import React from "react";
import { Box, Text } from "ink";
import { GitFile } from "../types";

interface StagedFilesProps {
  files: GitFile[];
}

export const StagedFiles: React.FC<StagedFilesProps> = ({ files }) => {
  if (files.length === 0) {
    return (
      <Box
        borderStyle="round"
        borderColor="#ef4444"
        paddingX={1}
        marginBottom={1}
      >
        <Text color="#ef4444">No staged files found</Text>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="#374151"
      paddingX={1}
      marginBottom={1}
    >
      <Box>
        <Text bold color="#8b5cf6">
          Staged Files
        </Text>
        <Text color="#6b7280"> ({files.length})</Text>
      </Box>

      {files.slice(0, 6).map((file, index) => (
        <Box key={index} marginLeft={1}>
          <Text color="#10b981">•</Text>
          <Text color="#e5e7eb"> {file.path}</Text>
        </Box>
      ))}

      {files.length > 6 && (
        <Box marginLeft={1}>
          <Text color="#6b7280">+{files.length - 6} more files</Text>
        </Box>
      )}
    </Box>
  );
};
