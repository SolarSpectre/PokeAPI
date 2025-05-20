import { Injectable } from '@angular/core';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  deleteDoc,
  Firestore,
  getFirestore,
  Timestamp
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

export interface PokemonComment {
  id?: string;
  pokemonName: string;
  comment: string;
  timestamp: Date;
  userId?: string;
}

export interface SavedPokemon {
  id?: string;
  name: string;
  details: any;
  savedAt: Date;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: Firestore;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.db = getFirestore(app);
  }

  private convertTimestampToDate(timestamp: any): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === 'string') {
      return new Date(timestamp);
    }
    return new Date();
  }

  // Save a Pokémon to Firebase
  async savePokemon(pokemon: SavedPokemon): Promise<string> {
    const pokemonRef = collection(this.db, 'saved-pokemon');
    const docRef = await addDoc(pokemonRef, {
      ...pokemon,
      savedAt: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  }

  // Get all saved Pokémon
  async getSavedPokemon(): Promise<SavedPokemon[]> {
    const pokemonRef = collection(this.db, 'saved-pokemon');
    const querySnapshot = await getDocs(pokemonRef);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        savedAt: this.convertTimestampToDate(data['savedAt'])
      } as SavedPokemon;
    });
  }

  // Add a comment to a Pokémon
  async addComment(comment: PokemonComment): Promise<string> {
    const commentsRef = collection(this.db, 'pokemon-comments');
    const docRef = await addDoc(commentsRef, {
      ...comment,
      timestamp: Timestamp.fromDate(new Date())
    });
    return docRef.id;
  }

  // Get comments for a specific Pokémon
  async getPokemonComments(pokemonName: string): Promise<PokemonComment[]> {
    const commentsRef = collection(this.db, 'pokemon-comments');
    const q = query(commentsRef, where('pokemonName', '==', pokemonName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: this.convertTimestampToDate(data['timestamp'])
      } as PokemonComment;
    });
  }

  // Delete a comment
  async deleteComment(commentId: string): Promise<void> {
    const commentRef = doc(this.db, 'pokemon-comments', commentId);
    await deleteDoc(commentRef);
  }

  // Delete a saved Pokémon
  async deleteSavedPokemon(pokemonId: string): Promise<void> {
    const pokemonRef = doc(this.db, 'saved-pokemon', pokemonId);
    await deleteDoc(pokemonRef);
  }
} 