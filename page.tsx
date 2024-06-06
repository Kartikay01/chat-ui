"use client";

import { useMemo, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import React from "react";
import { TextField, Box, Container, IconButton, InputAdornment } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import Messages from "./Messages";

type DataType = {
  context: any[];
};

export default function Chat() {
  const { messages, data, input, handleInputChange, handleSubmit, setInput } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const parsedData = useMemo<DataType[]>(
    () => data?.flatMap((x: string) => [null, JSON.parse(x)]),
    [data]
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Modified handleSubmit to reset the input field
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setInput(''); // Clear the input field to disable history
  };

  return (
    <Container
      disableGutters
      maxWidth="md"
      sx={{
        padding: '0 !important', // Override padding
        margin: '0 !important', // Override margin
        width: '100vw', // Fill entire viewport width
        backgroundColor: '#161C24', // Background color
        minHeight: '100vh', // Minimum height
        minWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MessagesContainer>
        <Messages messages={messages} parsedData={parsedData} />
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputForm onSubmit={handleFormSubmit} input={input} handleInputChange={handleInputChange} />
    </Container>
  );
}

const MessagesContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      flex: '1',
      overflowY: 'auto',
      padding: '16px',
      width: '100%' // Ensure messages container takes full width
    }}
  >
    {children}
  </Box>
);

const InputForm: React.FC<{ onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, input: string, handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ onSubmit, input, handleInputChange }) => (
  <Box
    sx={{
      padding: '16px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      position: 'sticky',
      bottom: 0,
      backgroundColor: '#161C24', // Same background as container
    }}
  >
    <form onSubmit={onSubmit} style={{ width: "40%" }}>
      <TextField
        fullWidth
        variant="outlined"
        value={input}
        placeholder="Say something..."
        onChange={handleInputChange}
        autoComplete="off"
        margin="normal"
        sx={{
          backgroundColor: 'rgb(34, 39, 47)',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)', // default border color
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.87)', // border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3f51b5', // border color when focused
            },
          },
          '& .MuiInputBase-input': {
            color: 'white', // text color
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit" color="primary">
                <ArrowForward />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  </Box>
);
