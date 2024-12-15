const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const BASE_URL = "https://api.elevenlabs.io/v1/convai";

interface Agent {
  agent_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  document_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Agent Management
export async function getAgent({
  agentId,
}: {
  agentId: string;
}): Promise<Agent> {
  //TODO: https://elevenlabs.io/docs/conversational-ai/api-reference/get-conversational-ai-agents
  const response = await fetch(`${BASE_URL}/agents/${agentId}`, {
    headers: {
      "xi-api-key": ELEVEN_LABS_API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }

  return response.json();
}

export async function createAgent(
  name: string,
  description?: string
): Promise<Agent> {
  // TODO: https://elevenlabs.io/docs/conversational-ai/api-reference/post-conversational-ai-agent
  const response = await fetch(`${BASE_URL}/agents`, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVEN_LABS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    throw new Error("Failed to create agent");
  }

  return response.json();
}

export async function deleteAgent(agentId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/agents/${agentId}`, {
    method: "DELETE",
    headers: {
      "xi-api-key": ELEVEN_LABS_API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete agent");
  }
}

// Knowledge Base Management
export async function getDocuments(agentId: string): Promise<Document[]> {
  //TODO: https://elevenlabs.io/docs/conversational-ai/api-reference/get-conversational-ai-knowledge-base-document
  const response = await fetch(`${BASE_URL}/agents/${agentId}/knowledge-base`, {
    headers: {
      "xi-api-key": ELEVEN_LABS_API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
}

export async function addDocument(
  agentId: string,
  file: File,
  name: string,
  description?: string
): Promise<Document> {
  //TODO: https://elevenlabs.io/docs/conversational-ai/api-reference/post-conversational-ai-knowledge-base-document
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  if (description) {
    formData.append("description", description);
  }

  const response = await fetch(
    `${BASE_URL}/agents/${agentId}/add-to-knowledge-base`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_LABS_API_KEY!,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add document");
  }

  return response.json();
}

export async function deleteDocument(
  agentId: string,
  documentId: string
): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/agents/${agentId}/knowledge-base/${documentId}`,
    {
      method: "DELETE",
      headers: {
        "xi-api-key": ELEVEN_LABS_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete document");
  }
}
