import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FirebaseService, SavedPokemon } from '../services/firebase.service';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  savedPokemons: SavedPokemon[] = [];
  offset = 0;
  limit = 20;
  loading = false;
  searchTerm = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private firebaseService: FirebaseService,
    private toastController: ToastController
  ) {
    addIcons({ trashOutline });
  }

  ngOnInit(): void {
    this.loadPokemons();
    this.loadSavedPokemons();
  }

  async loadSavedPokemons() {
    try {
      this.savedPokemons = await this.firebaseService.getSavedPokemon();
    } catch (error) {
      console.error('Error loading saved pokemon:', error);
      this.presentToast('Error cargando pokemon guardado');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  loadPokemons(event?: any) {
    if(this.loading) return;
    this.loading = true;
    
    this.http.get<any>(`https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`).subscribe({
      next: async (response) => {
        // Fetch details for each Pokemon to get their IDs
        const pokemonDetails = await Promise.all(
          response.results.map((pokemon: any) => 
            this.http.get<any>(pokemon.url).toPromise()
          )
        );
        
        const pokemonsWithDetails = pokemonDetails.map((details: any) => ({
          name: details.name,
          id: details.id,
          url: details.url
        }));

        this.pokemons = [...this.pokemons, ...pokemonsWithDetails];
        this.filteredPokemons = [...this.pokemons];
        this.offset += this.limit;
        this.loading = false;
        
        if (event) {
          event.target.complete();
        }

        if(response.next == null && event) {
          event.target.disabled = true;
        }
      },
      error: (error) => {
        console.error('Error loading pokemon:', error);
        this.presentToast('Error cargando pokemon');
        this.loading = false;
        if (event) {
          event.target.complete();
        }
      }
    });
  }

  async savePokemon(pokemon: any, index: number) {
    try {
      const pokemonDetails = await this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`).toPromise();
      const filteredDetails = {
        weight: pokemonDetails.weight,
        name: pokemonDetails.name,
        types: pokemonDetails.types,
        height: pokemonDetails.height,
        abilities: pokemonDetails.abilities,
        id: pokemonDetails.id,
        forms: pokemonDetails.forms,
        species: pokemonDetails.species
      };
      
      const savedPokemon: SavedPokemon = {
        name: pokemon.name,
        details: filteredDetails,
        savedAt: new Date()
      };
      
      await this.firebaseService.savePokemon(savedPokemon);
      await this.loadSavedPokemons();
      this.presentToast('Pokemon guardado exitosamente!');
    } catch (error) {
      console.error('Error saving pokemon:', error);
      this.presentToast('Error al guardar pokemon');
    }
  }

  isPokemonSaved(pokemonName: string): boolean {
    return this.savedPokemons.some(p => p.name === pokemonName);
  }

  async deleteSavedPokemon(pokemonId: string) {
    try {
      await this.firebaseService.deleteSavedPokemon(pokemonId);
      await this.loadSavedPokemons();
      this.presentToast('Pokemon eliminado de la lista');
    } catch (error) {
      console.error('Error deleting pokemon:', error);
      this.presentToast('Error al eliminar pokemon');
    }
  }

  getImageUrl(pokemon: any): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  }

  getSavedPokemonImage(savedPokemon: SavedPokemon): string {
    const pokemonId = savedPokemon.details?.id;
    if (pokemonId) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    }
    return ''; // Return empty string or a default image if ID is not available
  }

  getDetalles(name: string) {
    this.router.navigate([`detalles/${name}`]);
  }

  filterPokemons(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredPokemons = this.pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm)
    );
  }

  async handleSaveOrDelete(pokemon: any, index: number) {
    if (this.isPokemonSaved(pokemon.name)) {
      const savedPokemon = this.savedPokemons.find(p => p.name === pokemon.name);
      if (savedPokemon?.id) {
        await this.deleteSavedPokemon(savedPokemon.id);
      }
    } else {
      await this.savePokemon(pokemon, index);
    }
  }
}
