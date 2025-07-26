import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Room } from '../../models/room';
import { DataService } from '../../services/data';

@Component({
  selector: 'app-rates',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rates.html',
  styleUrl: './rates.scss'
})
export class Rates implements OnInit {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);

  rateForm!: FormGroup;
  rooms: Room[] = [];
  selectedRoomId: string = '1';
  loading = true;
  saving = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.initializeForm();
    this.loadRooms();
  }

  private initializeForm() {
    this.rateForm = this.fb.group({
      rent: [0, [Validators.required, Validators.min(0)]],
      water: [0, [Validators.required, Validators.min(0)]],
      wifi: [0, [Validators.required, Validators.min(0)]],
      electric: [0, [Validators.required, Validators.min(0)]],
      occupants: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  private async loadRooms() {
    try {
      this.loading = true;
      const rooms$ = await this.dataService.getRooms();
      
      rooms$.subscribe({
        next: (rooms) => {
          this.rooms = rooms.sort((a, b) => parseInt(a.id) - parseInt(b.id));
          
          if (this.rooms.length === 0) {
            // Initialize default rooms if none exist
            this.initializeDefaultRooms();
          } else {
            // Load the first room or selected room
            const roomToLoad = this.rooms.find(r => r.id === this.selectedRoomId) || this.rooms[0];
            this.selectRoom(roomToLoad.id);
          }
          
          this.loading = false;
        },
        error: (error:any) => {
          console.error('Error loading rooms:', error);
          this.errorMessage = 'Failed to load room data. Please try again.';
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error loading rooms:', error);
      this.errorMessage = 'Failed to load room data. Please try again.';
      this.loading = false;
    }
  }

  private async initializeDefaultRooms() {
    const defaultRooms: Room[] = [
      { id: '1', rent: 5000, water: 100, wifi: 500, electric: 15, occupants: 1 },
      { id: '2', rent: 4000, water: 100, wifi: 500, electric: 15, occupants: 2 },
      { id: '3', rent: 3500, water: 120, wifi: 400, electric: 12, occupants: 1 }
    ];

    try {
      for (const room of defaultRooms) {
        await this.dataService.saveRoom(room);
      }
    } catch (error) {
      console.error('Error initializing default rooms:', error);
    }
  }

  selectRoom(roomId: string) {
    this.selectedRoomId = roomId;
    const room = this.rooms.find(r => r.id === roomId);
    
    if (room) {
      this.rateForm.patchValue({
        rent: room.rent,
        water: room.water,
        wifi: room.wifi,
        electric: room.electric,
        occupants: room.occupants
      });
    }

    // Clear messages when switching rooms
    this.clearMessages();
  }

  calculateWaterTotal(): number {
    const waterRate = this.rateForm.get('water')?.value || 0;
    const occupants = this.rateForm.get('occupants')?.value || 1;
    return waterRate * occupants;
  }

  calculateFixedTotal(): number {
    const rent = this.rateForm.get('rent')?.value || 0;
    const wifi = this.rateForm.get('wifi')?.value || 0;
    const waterTotal = this.calculateWaterTotal();
    return rent + wifi + waterTotal;
  }

  async saveRates() {
    if (this.rateForm.invalid || this.saving) {
      return;
    }

    this.saving = true;
    this.clearMessages();

    try {
      const formValue = this.rateForm.value;
      const updatedRoom: Room = {
        id: this.selectedRoomId,
        rent: formValue.rent,
        water: formValue.water,
        wifi: formValue.wifi,
        electric: formValue.electric,
        occupants: formValue.occupants
      };

      await this.dataService.saveRoom(updatedRoom);
      
      this.successMessage = `Room ${this.selectedRoomId} rates saved successfully!`;
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);

    } catch (error) {
      console.error('Error saving rates:', error);
      this.errorMessage = 'Failed to save rates. Please try again.';
    } finally {
      this.saving = false;
    }
  }

  resetForm() {
    const room = this.rooms.find(r => r.id === this.selectedRoomId);
    if (room) {
      this.rateForm.patchValue({
        rent: room.rent,
        water: room.water,
        wifi: room.wifi,
        electric: room.electric,
        occupants: room.occupants
      });
    }
    this.clearMessages();
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
