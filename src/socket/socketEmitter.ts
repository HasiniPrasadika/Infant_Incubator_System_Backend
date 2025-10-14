import SocketServer from './socketServer';

let socketServer: SocketServer | null = null;

export const initializeSocketServer = (server: any) => {
  socketServer = new SocketServer(server);
  return socketServer;
};

export const getSocketServer = () => {
  if (!socketServer) {
    throw new Error('Socket server not initialized');
  }
  return socketServer;
};

export const emitTemperatureUpdate = (data: {
  babyId: string;
  temperature: number;
  timestamp: string;
}) => {
  if (socketServer) {
    socketServer.emitTemperatureUpdate({
      babyId: data.babyId,
      value: data.temperature,
      timestamp: data.timestamp,
    });
  }
};

export const emitHumidityUpdate = (data: {
  babyId: string;
  humidity: number;
  timestamp: string;
}) => {
  if (socketServer) {
    socketServer.emitHumidityUpdate({
      babyId: data.babyId,
      value: data.humidity,
      timestamp: data.timestamp,
    });
  }
};

export const emitSpo2Update = (data: {
  babyId: string;
  spo2: number;
  timestamp: string;
}) => {
  if (socketServer) {
    socketServer.emitSpo2Update({
      babyId: data.babyId,
      value: data.spo2,
      timestamp: data.timestamp,
    });
  }
};

export const emitHeartRateUpdate = (data: {
  babyId: string;
  heartRate: number;
  timestamp: string;
}) => {
  if (socketServer) {
    socketServer.emitHeartRateUpdate({
      babyId: data.babyId,
      value: data.heartRate,
      timestamp: data.timestamp,
    });
  }
};

export const emitBabyStatusUpdate = (babyId: string, status: any) => {
  if (socketServer) {
    socketServer.emitBabyStatusUpdate(babyId, status);
  }
};

export const emitAlert = (babyId: string, alertType: string, message: string) => {
  if (socketServer) {
    socketServer.emitAlert(babyId, alertType, message);
  }
};
