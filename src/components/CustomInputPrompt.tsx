import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

interface CustomInputPromptProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CustomInputPrompt: React.FC<CustomInputPromptProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const [cursorPosition, setCursorPosition] = useState(value.length);

  useInput((input, key) => {
    if (key.return) {
      onSubmit();
    } else if (key.escape) {
      onCancel();
    } else if (key.backspace || key.delete) {
      if (cursorPosition > 0) {
        const before = value.slice(0, cursorPosition - 1);
        const after = value.slice(cursorPosition);
        onChange(before + after);
        setCursorPosition(cursorPosition - 1);
      }
    } else if (key.leftArrow) {
      setCursorPosition((prev: number) => Math.max(0, prev - 1));
    } else if (key.rightArrow) {
      setCursorPosition((prev: number) => Math.min(value.length, prev + 1));
    } else if (input && !key.ctrl && !key.meta) {
      const before = value.slice(0, cursorPosition);
      const after = value.slice(cursorPosition);
      onChange(before + input + after);
      setCursorPosition(cursorPosition + input.length);
    }
  });

  const displayValue = value || "";
  const beforeCursor = displayValue.slice(0, cursorPosition);
  const cursorChar = displayValue[cursorPosition] || " ";
  const afterCursor = displayValue.slice(cursorPosition + 1);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="#8b5cf6"
      paddingX={1}
    >
      <Box>
        <Text bold color="#8b5cf6">
          Custom Message
        </Text>
      </Box>

      <Box marginLeft={1}>
        <Text>
          <Text color="#e5e7eb">{beforeCursor}</Text>
          <Text backgroundColor="#8b5cf6" color="#ffffff" bold>
            {cursorChar}
          </Text>
          <Text color="#e5e7eb">{afterCursor}</Text>
          {displayValue.length === 0 && (
            <Text color="#6b7280"> type your commit message...</Text>
          )}
        </Text>
      </Box>

      <Box marginTop={1}>
        <Text color="#6b7280">
          <Text color="#10b981">Enter</Text> submit{" "}
          <Text color="#ef4444">Esc</Text> cancel
        </Text>
      </Box>
    </Box>
  );
};
