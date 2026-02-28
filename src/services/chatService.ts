const baseUrl = import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000/";

export const sendChatMessage = async (message: string) => {
    try {
        const response = await fetch(`${baseUrl}/api/chatbot/chat/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to get response from AI");
        }

        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error("Chat Service Error:", error);
        throw error;
    }
};
