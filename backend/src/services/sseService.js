// Server-Sent Events (SSE) Broadcast Engine for Real-Time Notifications

class SSEService {
  constructor() {
    // Map of userId -> Set of response objects
    this.clients = new Map();
  }

  addClient(userId, res) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId).add(res);

    // Keep connection alive with periodic comment pings
    const keepAlive = setInterval(() => {
      try {
        res.write(': keep-alive\n\n');
      } catch (e) {
        clearInterval(keepAlive);
      }
    }, 25000);

    const closeHandler = () => {
      clearInterval(keepAlive);
      const userClients = this.clients.get(userId);
      if (userClients) {
        userClients.delete(res);
        if (userClients.size === 0) {
          this.clients.delete(userId);
        }
      }
    };

    return closeHandler;
  }

  sendToUser(userId, eventName, data) {
    const userClients = this.clients.get(userId);
    if (!userClients || userClients.size === 0) return;

    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;

    for (const client of userClients) {
      try {
        client.write(payload);
      } catch (error) {
        userClients.delete(client);
      }
    }
  }

  broadcast(eventName, data) {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const [userId, userClients] of this.clients.entries()) {
      for (const client of userClients) {
        try {
          client.write(payload);
        } catch (error) {
          userClients.delete(client);
        }
      }
    }
  }
}

export const sseService = new SSEService();
