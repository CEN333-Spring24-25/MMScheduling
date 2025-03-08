import { Injectable } from '@angular/core';
import { getDatabase, ref, get, set, update } from 'firebase/database';
import { Slot } from '../data/slot';

@Injectable({
  providedIn: 'root'
})
export class SlotsLoader {
  constructor() {}

  private SLOT_TIMES = [
    { start: "09:00", end: "10:45" },
    { start: "10:55", end: "12:40" },
    { start: "12:50", end: "14:35" },
    { start: "15:00", end: "16:45" },
    { start: "16:55", end: "18:40" },
    { start: "18:50", end: "20:35" },
    { start: "20:45", end: "22:30" }
  ];

  private DAYS = ["MW", "TR"];
  private LOCATIONS = ["AbuDhabi", "AlAin"];


  async initializeSlotsInFirebase(): Promise<void> {
    const db = getDatabase();
    const slotsRef = ref(db, 'slots');

    try {
      const snapshot = await get(slotsRef);
      if (snapshot.exists()) {
        console.log('✅ Slots already exist in Firebase');
        return;
      }

      console.log('No slots found in Firebase. Initializing empty slots...');
      
      let newSlots:any = {};
      let slotIndex = 1;

      this.LOCATIONS.forEach(location => {
        this.DAYS.forEach(day => {
          this.SLOT_TIMES.forEach(time => {
            const slotKey = slotIndex.toString();
            newSlots[slotKey] = {
              code: slotIndex,
              days: day,
              starttime: time.start,
              endtime: time.end,
              sections: [],
              campus: location
            };
            slotIndex++;
          });
        });

        newSlots[slotIndex.toString()] = { code: slotIndex, days: "F", starttime: "09:00", endtime: "12:30", sections: [], campus: location };
        slotIndex++;
        newSlots[slotIndex.toString()] = { code: slotIndex, days: "F", starttime: "15:00", endtime: "18:40", sections: [], campus: location };
        slotIndex++;
        newSlots[slotIndex.toString()] = { code: slotIndex, days: "F", starttime: "18:50", endtime: "22:30", sections: [], campus: location };
        slotIndex++;
      });

      await set(slotsRef, newSlots);
      console.log('✅ Slots initialized in Firebase:', newSlots);
    } catch (error) {
      console.error('❌ Error initializing slots in Firebase:', error);
    }
  }

  async loadSlotsFromFirebase(): Promise<Slot[]> {
    const db = getDatabase();
    try {
      const slotsRef = ref(db, 'slots');
      const snapshot = await get(slotsRef);
      if (snapshot.exists()) {
        const slotsArray: Slot[] = Object.values(snapshot.val());
        console.log('Slots loaded from Firebase:', slotsArray);
        return slotsArray;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching slots from Firebase:', error);
      return [];
    }
  }

  /**
   * 🔥 Update slots in Firebase
   */
  async updateSlotsInFirebase(slots: Slot[]): Promise<void> {
    const db = getDatabase();
    try {
      const slotUpdates = slots.reduce((acc, slot) => {
        acc[slot.code] = slot;
        return acc;
      }, {} as Record<string, any>);

      await set(ref(db, 'slots'), slotUpdates);
      console.log('Slots updated in Firebase successfully');
    } catch (error) {
      console.error('Error updating slots in Firebase:', error);
    }
  }
}
