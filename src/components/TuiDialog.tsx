import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

export type DialogType = "input" | "password" | "textarea" | "select";

export interface DialogProps {
  title: string;
  type: DialogType;
  initialValue?: string;
  options?: string[];
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export const TuiDialog: React.FC<DialogProps> = ({
  title,
  type,
  initialValue = "",
  options = [],
  onSubmit,
  onCancel,
}) => {
  const [value, setValue] = useState(initialValue);
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (type === "select" && initialValue) {
      const index = options.indexOf(initialValue);
      return index !== -1 ? index : 0;
    }
    return 0;
  });
  const [cursorPosition, setCursorPosition] = useState(initialValue.length);

  useInput((input, key) => {
    // Handle escape to cancel
    if (key.escape) {
      onCancel();
      return;
    }

    if (type === "select") {
      if (key.upArrow) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      } else if (key.downArrow) {
        setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      } else if (key.return) {
        onSubmit(options[selectedIndex]);
      }
    } else {
      // Input / Password / Textarea
      if (key.tab && type === "textarea") {
        // Tab: Submit for textarea
        onSubmit(value.trim());
      } else if (key.return) {
        if (type === "textarea") {
          // Enter: Insert newline for textarea
          const before = value.slice(0, cursorPosition);
          const after = value.slice(cursorPosition);
          setValue(before + "\n" + after);
          setCursorPosition(cursorPosition + 1);
        } else {
          // Enter: Submit for input/password
          onSubmit(value.trim());
        }
      } else if (key.leftArrow) {
        setCursorPosition((prev) => Math.max(0, prev - 1));
      } else if (key.rightArrow) {
        setCursorPosition((prev) => Math.min(value.length, prev + 1));
      } else if (key.backspace || key.delete) {
        if (cursorPosition > 0) {
          const before = value.slice(0, cursorPosition - 1);
          const after = value.slice(cursorPosition);
          setValue(before + after);
          setCursorPosition(cursorPosition - 1);
        }
      } else if (input && !key.ctrl && !key.meta) {
        const before = value.slice(0, cursorPosition);
        const after = value.slice(cursorPosition);
        setValue(before + input + after);
        setCursorPosition(cursorPosition + input.length);
      }
    }
  });

  const renderInputField = () => {
    const displayValue = type === "password" ? "•".repeat(value.length) : value;
    const beforeCursor = displayValue.slice(0, cursorPosition);
    const cursorChar = displayValue[cursorPosition] || " ";
    const afterCursor = displayValue.slice(cursorPosition + 1);

    return (
      <Box borderStyle="round" borderColor="#6366f1" paddingX={1} flexGrow={1}>
        <Text>
          <Text color="#e5e7eb">{beforeCursor}</Text>
          <Text backgroundColor="#8b5cf6" color="#ffffff" bold>
            {cursorChar}
          </Text>
          <Text color="#e5e7eb">{afterCursor}</Text>
        </Text>
      </Box>
    );
  };

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      padding={2}
      borderStyle="round"
      borderColor="#6366f1"
    >
      {/* Header */}
      <Box marginBottom={1}>
        <Text bold color="#8b5cf6">
          {title}
        </Text>
      </Box>

      {/* Content */}
      {type === "select" ? (
        <Box flexDirection="column" marginBottom={1}>
          {options.map((option, index) => (
            <Box key={option} paddingX={1}>
              <Text
                bold={index === selectedIndex}
                inverse={index === selectedIndex}
              >
                {index === selectedIndex ? "› " : "  "}
                {option}
              </Text>
            </Box>
          ))}
        </Box>
      ) : (
        <Box flexDirection="column" marginBottom={1}>
          {renderInputField()}
          {type === "textarea" && (
            <Box marginTop={1}>
              <Text color="#6b7280" dimColor>
                Enter for new line • Tab to submit
              </Text>
            </Box>
          )}
        </Box>
      )}

      {/* Footer */}
      <Box
        borderTop={true}
        borderStyle="single"
        borderColor="#374151"
        paddingTop={1}
      >
        <Text color="#6b7280">
          {type === "select" ? (
            <Text>
              <Text color="#60a5fa">↑↓</Text> Navigate •{" "}
              <Text color="#10b981">Enter</Text> Confirm •{" "}
              <Text color="#ef4444">Esc</Text> Cancel
            </Text>
          ) : type === "textarea" ? (
            <Text>
              <Text color="#60a5fa">←→</Text> Move •{" "}
              <Text color="#10b981">Tab</Text> Submit •{" "}
              <Text color="#ef4444">Esc</Text> Cancel
            </Text>
          ) : (
            <Text>
              <Text color="#60a5fa">←→</Text> Move •{" "}
              <Text color="#10b981">Enter</Text> Confirm •{" "}
              <Text color="#ef4444">Esc</Text> Cancel
            </Text>
          )}
        </Text>
      </Box>
    </Box>
  );
};
