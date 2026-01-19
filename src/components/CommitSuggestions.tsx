import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import { CommitSuggestion } from "../types";

interface CommitSuggestionsProps {
  suggestions: CommitSuggestion[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onCommit: (index: number) => void;
  onTryAgain: () => void;
  onCustomInput: () => void;
  isLoading: boolean;
  isUsingFallback?: boolean;
}

export const CommitSuggestions: React.FC<CommitSuggestionsProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  onCommit,
  onTryAgain,
  onCustomInput,
  isLoading,
  isUsingFallback = false,
}) => {
  const totalOptions = isUsingFallback
    ? suggestions.length
    : suggestions.length + 2;
  const [frame, setFrame] = useState(0);

  const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  // Alternative spinners:
  // const spinnerFrames = ['◐', '◓', '◑', '◒'];

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setFrame((prev) => (prev + 1) % spinnerFrames.length);
      }, 80);
      return () => clearInterval(timer);
    }
  }, [isLoading, spinnerFrames.length]);

  useInput((input, key) => {
    if (key.upArrow) {
      const newIndex = selectedIndex > 0 ? selectedIndex - 1 : totalOptions - 1;
      onSelect(newIndex);
    } else if (key.downArrow) {
      const newIndex = selectedIndex < totalOptions - 1 ? selectedIndex + 1 : 0;
      onSelect(newIndex);
    } else if (key.return) {
      if (selectedIndex < suggestions.length) {
        onCommit(selectedIndex);
      } else if (!isUsingFallback) {
        if (selectedIndex === suggestions.length) {
          onTryAgain();
        } else if (selectedIndex === suggestions.length + 1) {
          onCustomInput();
        }
      }
    }
  });

  if (isLoading) {
    return (
      <Box borderStyle="round" borderColor="#374151" paddingX={1}>
        <Text color="#6b7280">
          {spinnerFrames[frame]} Generating commit suggestions...
        </Text>
      </Box>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Box borderStyle="round" borderColor="#ef4444" paddingX={1}>
        <Text color="#ef4444">No suggestions available</Text>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="#374151"
      paddingX={1}
    >
      <Box>
        <Text bold color="#8b5cf6">
          Commit Messages
        </Text>
      </Box>

      {suggestions.map((suggestion, index) => {
        const isSelected = index === selectedIndex;
        const displayMsg =
          suggestion.message.length > 65
            ? suggestion.message.substring(0, 62) + "..."
            : suggestion.message;

        return (
          <Box key={index} marginLeft={1}>
            <Text color={isSelected ? "#10b981" : "#6b7280"}>
              {isSelected ? "❯" : " "}
            </Text>
            <Text color={isSelected ? "#ffffff" : "#9ca3af"} bold={isSelected}>
              {" "}
              {displayMsg}
            </Text>
          </Box>
        );
      })}

      {!isUsingFallback && (
        <Box marginTop={1} marginLeft={1} flexDirection="row">
          <Box marginRight={3}>
            <Text
              color={
                selectedIndex === suggestions.length ? "#10b981" : "#6b7280"
              }
            >
              {selectedIndex === suggestions.length ? "❯" : " "}
            </Text>
            <Text
              color={
                selectedIndex === suggestions.length ? "#60a5fa" : "#6b7280"
              }
              bold={selectedIndex === suggestions.length}
            >
              {" "}
              ↻ Try again
            </Text>
          </Box>
          <Box>
            <Text
              color={
                selectedIndex === suggestions.length + 1 ? "#10b981" : "#6b7280"
              }
            >
              {selectedIndex === suggestions.length + 1 ? "❯" : " "}
            </Text>
            <Text
              color={
                selectedIndex === suggestions.length + 1 ? "#f59e0b" : "#6b7280"
              }
              bold={selectedIndex === suggestions.length + 1}
            >
              {" "}
              ✎ Custom input
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};
