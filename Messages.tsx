import React from 'react';
import ReactMarkdown from 'react-markdown';

type DataType = {
  context: any[];
};

type MessageProps = {
  messages: any[];
  parsedData: DataType[];
};

const Messages: React.FC<MessageProps> = ({ messages, parsedData }) => {
  return (
    <div className="mx-auto w-full max-w-2xl py-10 flex flex-col stretch"
    >
      {messages.length > 0
        ? messages.map((m, i) => (
            <div key={m.id} className="flex flex-col mb-6">
              <b  style={{ color: 'white' }}>{m.role === "user" ? "User: " : "AI: "}</b>
              <small className="text-gray-500">
                {parsedData?.[i]?.context
                  ?.map(({ payload }) => payload.article)
                  .join(", ")}
              </small>
              <p className="whitespace-pre-wrap"  style={{ color: 'white' }}>
                <ReactMarkdown
                  components={{
                    code: ({ node, className, children, ...props }) => {
                      const language = className
                        ? className.replace("language-", "")
                        : "";
                      return (
                        <code
                          style={{
                            backgroundColor: "lightgrey",
                            padding: "0.2rem 0.4rem",
                            borderRadius: "0.3rem",
                          }}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {m.content.trim()}
                </ReactMarkdown>
              </p>
            </div>
          ))
        : null}
    </div>
  );
};

export default Messages;
