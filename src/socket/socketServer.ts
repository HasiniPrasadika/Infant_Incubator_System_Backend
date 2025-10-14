import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { prismaClient } from '..';

interface SocketData {
  babyId: string;
  userId: string;
}

interface SensorData {
  babyId: string;
  value: number;
  timestamp: string;
}

class SocketServer {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: ['http://localhost:5173'],
        credentials: true,
      },
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join baby-specific room
      socket.on('join-baby-room', (babyId: string) => {
        socket.join(`baby-${babyId}`);
        console.log(`Socket ${socket.id} joined room: baby-${babyId}`);
      });

      // Leave baby-specific room
      socket.on('leave-baby-room', (babyId: string) => {
        socket.leave(`baby-${babyId}`);
        console.log(`Socket ${socket.id} left room: baby-${babyId}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Emit temperature update to specific baby room
  public emitTemperatureUpdate(data: SensorData) {
    this.io.to(`baby-${data.babyId}`).emit('temperature-update', {
      babyId: data.babyId,
      temperature: data.value,
      timestamp: data.timestamp,
    });
  }

  // Emit humidity update to specific baby room
  public emitHumidityUpdate(data: SensorData) {
    this.io.to(`baby-${data.babyId}`).emit('humidity-update', {
      babyId: data.babyId,
      humidity: data.value,
      timestamp: data.timestamp,
    });
  }

  // Emit SPO2 update to specific baby room
  public emitSpo2Update(data: SensorData) {
    this.io.to(`baby-${data.babyId}`).emit('spo2-update', {
      babyId: data.babyId,
      spo2: data.value,
      timestamp: data.timestamp,
    });
  }

  // Emit heart rate update to specific baby room
  public emitHeartRateUpdate(data: SensorData) {
    this.io.to(`baby-${data.babyId}`).emit('heart-rate-update', {
      babyId: data.babyId,
      heartRate: data.value,
      timestamp: data.timestamp,
    });
  }

  // Emit baby status update
  public emitBabyStatusUpdate(babyId: string, status: any) {
    this.io.to(`baby-${babyId}`).emit('baby-status-update', {
      babyId,
      status,
    });
  }

  // Emit alert for critical values
  public emitAlert(babyId: string, alertType: string, message: string) {
    this.io.to(`baby-${babyId}`).emit('alert', {
      babyId,
      alertType,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  // Get connected clients count
  public getConnectedClientsCount(): number {
    return this.io.engine.clientsCount;
  }
}

export default SocketServer;
