import { FC } from "react";
import {
  IconPlugConnected,
  IconPlugConnectedX,
  IconMessage,
  IconAlertCircle,
  IconInfoCircle,
} from "@tabler/icons-react";
import { match } from "ts-pattern";
import classnames from "classnames";

export type MessageType =
  | "CONNECTED"
  | "DISCONNECTED"
  | "MESSAGE"
  | "ERROR"
  | "INFO";

export type Message = {
  text: string;
  type: MessageType;
};

export type TextLineProps = {
  message: Message;
};

export const TextLine: FC<TextLineProps> = ({ message }) => {
  const Icon = match(message.type)
    .with("CONNECTED", () => IconPlugConnected)
    .with("DISCONNECTED", () => IconPlugConnectedX)
    .with("MESSAGE", () => IconMessage)
    .with("ERROR", () => IconAlertCircle)
    .with("INFO", () => IconInfoCircle)
    .exhaustive();

  const preClasses = classnames("flex", "items-center", "max-w-full", "mb-2", {
    "text-error-content": message.type === "ERROR",
    "bg-error": message.type === "ERROR",
    "text-info": message.type === "INFO",
    "text-warning": message.type === "DISCONNECTED",
    "text-success-content": message.type === "CONNECTED",
    "bg-success": message.type === "CONNECTED",
  });

  return (
    <pre className={preClasses}>
      <Icon className="inline-block mr-2" />
      <code className="break-words w-full max-w-full truncate whitespace-pre-wrap">
        {message.text}
      </code>
    </pre>
  );
};
