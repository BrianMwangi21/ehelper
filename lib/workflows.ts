import { Workflow } from "./types";

const workflows: Workflow[] = [
  {
    id: "login-ecitizen",
    label: "Login to ecitizen",
    icon: "🔒",
    steps: [
      {
        action: "goto",
        url: "https://accounts.ecitizen.go.ke",
        message: "Navigating to ecitizen...",
      },
      {
        action: "act",
        prompt: "click the Sign In button",
        message: "Looking for the Sign In button...",
        maxRetries: 3,
      },
      {
        action: "pause",
        message: "Please enter your credentials in the browser window",
      },
    ],
  },
];

export default workflows;