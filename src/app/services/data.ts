import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  deleteDoc, 
  addDoc,
  updateDoc,
  writeBatch,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import { AuthService } from './auth';
import { BillingRecord } from '../models/billing';
import { Contract } from '../models/contract';
import { MeterReading } from '../models/meter';
import { Room } from '../models/room';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  // Cache for better performance
  private roomsCache$ = new BehaviorSubject<Room[]>([]);
  private contractsCache$ = new BehaviorSubject<Contract[]>([]);

  constructor() {
    // Initialize data when service is created
    this.initializeRealtimeListeners();
  }

  private getUserId(): string {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    return user.uid;
  }

  private initializeRealtimeListeners() {
    // Set up real-time listeners when user is authenticated
    this.authService.user$.subscribe(user => {
      if (user) {
        this.setupRoomsListener();
        this.setupContractsListener();
      } else {
        // Clear cache when user logs out
        this.roomsCache$.next([]);
        this.contractsCache$.next([]);
      }
    });
  }

  // =============================================================================
  // ROOMS MANAGEMENT
  // =============================================================================

  private setupRoomsListener() {
    try {
      const userId = this.getUserId();
      const roomsRef = collection(this.firestore, `users/${userId}/rooms`);
      const q = query(roomsRef, orderBy('id'));
      
      onSnapshot(q, (snapshot) => {
        const rooms: Room[] = [];
        snapshot.forEach((doc) => {
          rooms.push({ id: doc.id, ...doc.data() } as Room);
        });
        this.roomsCache$.next(rooms);
      }, (error) => {
        console.error('Error in rooms listener:', error);
      });
    } catch (error) {
      console.error('Error setting up rooms listener:', error);
    }
  }

  getRooms(): Observable<Room[]> {
    return this.roomsCache$.asObservable();
  }

  async getRoom(roomId: string): Promise<Room | null> {
    try {
      const userId = this.getUserId();
      const roomRef = doc(this.firestore, `users/${userId}/rooms/${roomId}`);
      const roomSnap = await getDoc(roomRef);
      
      if (roomSnap.exists()) {
        return { id: roomSnap.id, ...roomSnap.data() } as Room;
      }
      return null;
    } catch (error) {
      console.error('Error getting room:', error);
      throw error;
    }
  }

  async saveRoom(room: Room): Promise<void> {
    try {
      const userId = this.getUserId();
      const roomRef = doc(this.firestore, `users/${userId}/rooms/${room.id}`);
      
      // Add timestamps
      const roomData = {
        ...room,
        updatedAt: Timestamp.now(),
        // Add createdAt only if it's a new room
        ...(!await this.roomExists(room.id) && { createdAt: Timestamp.now() })
      };
      
      await setDoc(roomRef, roomData, { merge: true });
    } catch (error) {
      console.error('Error saving room:', error);
      throw error;
    }
  }

  private async roomExists(roomId: string): Promise<boolean> {
    try {
      const userId = this.getUserId();
      const roomRef = doc(this.firestore, `users/${userId}/rooms/${roomId}`);
      const roomSnap = await getDoc(roomRef);
      return roomSnap.exists();
    } catch (error) {
      return false;
    }
  }

  // =============================================================================
  // CONTRACTS MANAGEMENT
  // =============================================================================

  private setupContractsListener() {
    try {
      const userId = this.getUserId();
      const contractsRef = collection(this.firestore, `users/${userId}/contracts`);
      const q = query(contractsRef, orderBy('createdAt', 'desc'));
      
      onSnapshot(q, (snapshot) => {
        const contracts: Contract[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          contracts.push({
            id: doc.id,
            ...data,
            // Convert Firestore timestamps to strings
            createdAt: data['createdAt']?.toDate?.()?.toISOString() || data['createdAt'],
            updatedAt: data['updatedAt']?.toDate?.()?.toISOString() || data['updatedAt']
          } as Contract);
        });
        this.contractsCache$.next(contracts);
      }, (error) => {
        console.error('Error in contracts listener:', error);
      });
    } catch (error) {
      console.error('Error setting up contracts listener:', error);
    }
  }

  getContracts(): Observable<Contract[]> {
    return this.contractsCache$.asObservable();
  }

  getActiveContracts(): Observable<Contract[]> {
    return this.contractsCache$.pipe(
      map(contracts => contracts.filter(contract => contract.status === 'active'))
    );
  }

  getContractByRoom(roomId: string): Observable<Contract | null> {
    return this.contractsCache$.pipe(
      map(contracts => {
        const activeContract = contracts.find(
          contract => contract.roomId === roomId && contract.status === 'active'
        );
        return activeContract || null;
      })
    );
  }

  async saveContract(contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const userId = this.getUserId();
      const contractsRef = collection(this.firestore, `users/${userId}/contracts`);
      
      const contractData = {
        ...contract,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(contractsRef, contractData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving contract:', error);
      throw error;
    }
  }

  async updateContract(contractId: string, updates: Partial<Contract>): Promise<void> {
    try {
      const userId = this.getUserId();
      const contractRef = doc(this.firestore, `users/${userId}/contracts/${contractId}`);
      
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(contractRef, updateData);
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  }

  async terminateContract(contractId: string, terminationDate: string): Promise<void> {
    try {
      await this.updateContract(contractId, {
        status: 'terminated',
        endDate: terminationDate
      });
    } catch (error) {
      console.error('Error terminating contract:', error);
      throw error;
    }
  }

  // =============================================================================
  // METER READINGS MANAGEMENT
  // =============================================================================

  getMeterReadings(roomId: string): Observable<MeterReading[]> {
    const userId = this.getUserId();
    const readingsRef = collection(this.firestore, `users/${userId}/meterReadings`);
    const q = query(
      readingsRef, 
      where('roomId', '==', roomId), 
      orderBy('date', 'desc')
    );
    
    return new Observable(observer => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const readings: MeterReading[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          readings.push({
            id: doc.id,
            ...data,
            createdAt: data['createdAt']?.toDate?.()?.toISOString() || data['createdAt']
          } as MeterReading);
        });
        observer.next(readings);
      }, (error) => {
        console.error('Error getting meter readings:', error);
        observer.error(error);
      });
      
      return () => unsubscribe();
    });
  }

  async getLatestMeterReading(roomId: string): Promise<MeterReading | null> {
    try {
      const userId = this.getUserId();
      const readingsRef = collection(this.firestore, `users/${userId}/meterReadings`);
      const q = query(
        readingsRef, 
        where('roomId', '==', roomId), 
        orderBy('date', 'desc'), 
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data['createdAt']?.toDate?.()?.toISOString() || data['createdAt']
        } as MeterReading;
      }
      return null;
    } catch (error) {
      console.error('Error getting latest meter reading:', error);
      throw error;
    }
  }

  async saveMeterReading(reading: Omit<MeterReading, 'id' | 'createdAt'>): Promise<string> {
    try {
      const userId = this.getUserId();
      const readingsRef = collection(this.firestore, `users/${userId}/meterReadings`);
      
      const readingData = {
        ...reading,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(readingsRef, readingData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving meter reading:', error);
      throw error;
    }
  }

  // =============================================================================
  // BILLING HISTORY MANAGEMENT
  // =============================================================================

  getBillingHistory(roomId?: string): Observable<BillingRecord[]> {
    const userId = this.getUserId();
    const billingRef = collection(this.firestore, `users/${userId}/billingHistory`);
    
    let q;
    if (roomId) {
      q = query(
        billingRef, 
        where('roomId', '==', roomId), 
        orderBy('date', 'desc')
      );
    } else {
      q = query(billingRef, orderBy('date', 'desc'));
    }
    
    return new Observable(observer => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const records: BillingRecord[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          records.push({
            id: doc.id,
            ...data,
            createdAt: data['createdAt']?.toDate?.()?.toISOString() || data['createdAt']
          } as BillingRecord);
        });
        observer.next(records);
      }, (error) => {
        console.error('Error getting billing history:', error);
        observer.error(error);
      });
      
      return () => unsubscribe();
    });
  }

  async saveBillingRecord(record: Omit<BillingRecord, 'id' | 'createdAt'>): Promise<string> {
    try {
      const userId = this.getUserId();
      const billingRef = collection(this.firestore, `users/${userId}/billingHistory`);
      
      const recordData = {
        ...record,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(billingRef, recordData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving billing record:', error);
      throw error;
    }
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  // Generate billing record from current room data and meter reading
  async generateBillingRecord(
    roomId: string, 
    month: string, 
    year: string,
    electricConsumption: number = 0
  ): Promise<BillingRecord> {
    try {
      const room = await this.getRoom(roomId);
      if (!room) {
        throw new Error(`Room ${roomId} not found`);
      }

      const waterTotal = room.water * room.occupants;
      const electricTotal = electricConsumption * room.electric;
      const total = room.rent + waterTotal + room.wifi + electricTotal;

      const billingRecord: Omit<BillingRecord, 'id' | 'createdAt'> = {
        roomId,
        month,
        year,
        rent: room.rent,
        water: waterTotal,
        wifi: room.wifi,
        electric: electricTotal,
        total,
        date: new Date().toISOString(),
        status: 'pending'
      };

      return billingRecord as BillingRecord;
    } catch (error) {
      console.error('Error generating billing record:', error);
      throw error;
    }
  }

  // Get dashboard summary data
  getDashboardSummary(): Observable<{
    totalRooms: number;
    activeContracts: number;
    monthlyRevenue: number;
    occupancyRate: number;
  }> {
    return combineLatest([
      this.getRooms(),
      this.getActiveContracts(),
      this.getBillingHistory()
    ]).pipe(
      map(([rooms, contracts, billingHistory]) => {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        
        const currentMonthBilling = billingHistory.filter(
          record => parseInt(record.month) === currentMonth && 
                   parseInt(record.year) === currentYear
        );
        
        const monthlyRevenue = currentMonthBilling.reduce(
          (sum, record) => sum + record.total, 0
        );
        
        const occupancyRate = rooms.length > 0 ? 
          (contracts.length / rooms.length) * 100 : 0;

        return {
          totalRooms: rooms.length,
          activeContracts: contracts.length,
          monthlyRevenue,
          occupancyRate: Math.round(occupancyRate)
        };
      })
    );
  }

  // Initialize default data for new users
  async initializeDefaultData(): Promise<void> {
    try {
      const userId = this.getUserId();
      
      // Check if data already exists
      const roomsRef = collection(this.firestore, `users/${userId}/rooms`);
      const roomsSnapshot = await getDocs(roomsRef);
      
      if (!roomsSnapshot.empty) {
        return; // Data already exists
      }

      console.log('Initializing default data for new user...');

      // Initialize default rooms
      const defaultRooms: Room[] = [
        { id: '1', rent: 5000, water: 100, wifi: 500, electric: 15, occupants: 1 },
        { id: '2', rent: 4000, water: 100, wifi: 500, electric: 15, occupants: 2 },
        { id: '3', rent: 3500, water: 120, wifi: 400, electric: 12, occupants: 1 }
      ];

      // Initialize default meter readings
      const currentDate = new Date();
      const currentMonth = (currentDate.getMonth() + 1).toString();
      const currentYear = currentDate.getFullYear().toString();
      const dateString = currentDate.toISOString().split('T')[0];

      const defaultReadings: Omit<MeterReading, 'id' | 'createdAt'>[] = [
        { 
          roomId: '1', 
          reading: 1500, 
          previousReading: 1000,
          consumption: 500,
          date: dateString, 
          month: currentMonth, 
          year: currentYear
        },
        { 
          roomId: '2', 
          reading: 1167, 
          previousReading: 800,
          consumption: 367,
          date: dateString, 
          month: currentMonth, 
          year: currentYear
        },
        { 
          roomId: '3', 
          reading: 900, 
          previousReading: 600,
          consumption: 300,
          date: dateString, 
          month: currentMonth, 
          year: currentYear
        }
      ];

      // Save default data
      for (const room of defaultRooms) {
        await this.saveRoom(room);
      }

      for (const reading of defaultReadings) {
        await this.saveMeterReading(reading);
      }

      console.log('Default data initialized successfully');
    } catch (error) {
      console.error('Error initializing default data:', error);
      throw error;
    }
  }
}

// =============================================================================
// USAGE EXAMPLE IN COMPONENT
// =============================================================================

/*
// Example usage in a component:

import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Room } from '../models/room.model';

@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngFor="let room of rooms">
      Room {{ room.id }}: ₱{{ room.rent }}
    </div>
  `
})
export class ExampleComponent implements OnInit {
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  
  rooms: Room[] = [];
  loading = true;

  ngOnInit() {
    // Check if user is authenticated
    if (this.authService.isLoggedIn()) {
      this.loadRooms();
    }
  }

  private loadRooms() {
    this.dataService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.loading = false;
      }
    });
  }

  async saveRoom(room: Room) {
    try {
      await this.dataService.saveRoom(room);
      console.log('Room saved successfully');
    } catch (error) {
      console.error('Error saving room:', error);
    }
  }
}
*/
